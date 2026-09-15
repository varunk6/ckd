import numpy as np
import pandas as pd
from sklearn.feature_selection import (
    chi2, 
    VarianceThreshold, 
    RFE, 
    mutual_info_classif
)
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

def evaluate_feature_selection(X_transformed, y, feature_names, top_k=15):
    """
    Evaluates 6 feature selection methods on the preprocessed feature matrix X_transformed:
    1. Pearson Correlation
    2. Chi-Square (chi2)
    3. Variance Threshold
    4. Recursive Feature Elimination (RFE)
    5. LASSO (L1 Regularization)
    6. Mutual Information
    """
    n_features = X_transformed.shape[1]
    top_k = min(top_k, n_features)

    df_X = pd.DataFrame(X_transformed, columns=feature_names)

    # 1. Pearson Correlation Analysis
    correlations = {}
    for col in feature_names:
        corr = np.corrcoef(df_X[col], y)[0, 1]
        correlations[col] = 0.0 if np.isnan(corr) else abs(corr)
    corr_series = pd.Series(correlations).sort_values(ascending=False)

    # 2. Chi-Square Test (requires non-negative values)
    scaler = MinMaxScaler()
    X_non_neg = scaler.fit_transform(X_transformed)
    chi2_scores, p_values = chi2(X_non_neg, y)
    chi2_scores = np.nan_to_num(chi2_scores, nan=0.0)
    chi2_series = pd.Series(chi2_scores, index=feature_names).sort_values(ascending=False)

    # 3. Variance Threshold
    selector_var = VarianceThreshold(threshold=0.01)
    selector_var.fit(X_transformed)
    variances = selector_var.variances_
    var_series = pd.Series(variances, index=feature_names).sort_values(ascending=False)

    # 4. Recursive Feature Elimination (RFE)
    rf_base = RandomForestClassifier(n_estimators=50, random_state=42)
    rfe = RFE(estimator=rf_base, n_features_to_select=top_k)
    rfe.fit(X_transformed, y)
    rfe_ranking = pd.Series(rfe.ranking_, index=feature_names).sort_values(ascending=True)

    # 5. LASSO (L1 Regularization)
    lasso = LogisticRegression(penalty='l1', solver='liblinear', C=0.5, random_state=42)
    lasso.fit(X_transformed, y)
    lasso_coefs = np.abs(lasso.coef_[0])
    lasso_series = pd.Series(lasso_coefs, index=feature_names).sort_values(ascending=False)

    # 6. Mutual Information Classifier
    mi_scores = mutual_info_classif(X_transformed, y, random_state=42)
    mi_series = pd.Series(mi_scores, index=feature_names).sort_values(ascending=False)

    # Aggregate Scores to build consensus feature rankings
    summary_list = []
    for f in feature_names:
        summary_list.append({
            'feature': f,
            'correlation': float(correlations.get(f, 0)),
            'chi2_score': float(chi2_series.get(f, 0)),
            'variance': float(var_series.get(f, 0)),
            'rfe_rank': int(rfe_ranking.get(f, 99)),
            'lasso_coef': float(lasso_series.get(f, 0)),
            'mutual_info': float(mi_series.get(f, 0))
        })

    df_summary = pd.DataFrame(summary_list)
    
    # Compute normalized composite score
    df_summary['composite_score'] = (
        (df_summary['correlation'] / (df_summary['correlation'].max() or 1)) +
        (df_summary['chi2_score'] / (df_summary['chi2_score'].max() or 1)) +
        (df_summary['lasso_coef'] / (df_summary['lasso_coef'].max() or 1)) +
        (df_summary['mutual_info'] / (df_summary['mutual_info'].max() or 1))
    ) / 4.0

    df_summary = df_summary.sort_values(by='composite_score', ascending=False).reset_index(drop=True)

    selected_features_rfe = [f for f, s in zip(feature_names, rfe.support_) if s]

    return {
        'top_k': top_k,
        'summary': df_summary.to_dict(orient='records'),
        'selected_features': {
            'correlation': corr_series.head(top_k).index.tolist(),
            'chi2': chi2_series.head(top_k).index.tolist(),
            'rfe': selected_features_rfe,
            'lasso': lasso_series[lasso_series > 0].index.tolist()[:top_k],
            'mutual_info': mi_series.head(top_k).index.tolist(),
            'composite': df_summary.head(top_k)['feature'].tolist()
        }
    }
