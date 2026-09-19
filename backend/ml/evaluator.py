import time
import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    roc_curve,
    confusion_matrix
)
from balancing import apply_class_balancing

def evaluate_models_cv(models, X, y, cv_folds=5, balancing_method='smote', random_state=42):
    """
    Evaluates a dictionary of ML models using Stratified K-Fold Cross-Validation.
    Class balancing (SMOTE / SMOTETomek) is applied strictly inside each training fold to avoid data leakage.
    """
    skf = StratifiedKFold(n_splits=cv_folds, shuffle=True, random_state=random_state)
    
    results = {}

    for name, model_instance in models.items():
        acc_list = []
        prec_list = []
        rec_list = []
        f1_list = []
        auc_list = []
        
        y_true_all = []
        y_pred_all = []
        y_prob_all = []
        
        start_train_time = time.time()

        for train_idx, val_idx in skf.split(X, y):
            X_train_fold, X_val_fold = X[train_idx], X[val_idx]
            y_train_fold, y_val_fold = y.iloc[train_idx], y.iloc[val_idx]

            # Apply class balancing on training fold only
            X_train_bal, y_train_bal, _ = apply_class_balancing(
                X_train_fold, y_train_fold, method=balancing_method, random_state=random_state
            )

            # Fit model
            model_instance.fit(X_train_bal, y_train_bal)

            # Predict
            y_pred = model_instance.predict(X_val_fold)
            
            if hasattr(model_instance, "predict_proba"):
                y_prob = model_instance.predict_proba(X_val_fold)[:, 1]
            elif hasattr(model_instance, "decision_function"):
                df_scores = model_instance.decision_function(X_val_fold)
                y_prob = 1 / (1 + np.exp(-df_scores))
            else:
                y_prob = y_pred.astype(float)

            acc_list.append(accuracy_score(y_val_fold, y_pred))
            prec_list.append(precision_score(y_val_fold, y_pred, zero_division=0))
            rec_list.append(recall_score(y_val_fold, y_pred, zero_division=0))
            f1_list.append(f1_score(y_val_fold, y_pred, zero_division=0))
            
            try:
                auc_list.append(roc_auc_score(y_val_fold, y_prob))
            except Exception:
                auc_list.append(0.5)

            y_true_all.extend(y_val_fold.values)
            y_pred_all.extend(y_pred)
            y_prob_all.extend(y_prob)

        train_time = round(time.time() - start_train_time, 3)

        # Overall Confusion Matrix across all folds
        cm = confusion_matrix(y_true_all, y_pred_all)
        tn, fp, fn, tp = cm.ravel() if cm.shape == (2, 2) else (0, 0, 0, 0)

        # Compute combined ROC Curve for chart plotting
        try:
            fpr, tpr, _ = roc_curve(y_true_all, y_prob_all)
            # Sample 20 points for smooth frontend chart display
            indices = np.linspace(0, len(fpr) - 1, num=min(20, len(fpr)), dtype=int)
            roc_points = [
                {"fpr": round(float(fpr[i]), 3), "tpr": round(float(tpr[i]), 3)} 
                for i in indices
            ]
        except Exception:
            roc_points = [{"fpr": 0.0, "tpr": 0.0}, {"fpr": 1.0, "tpr": 1.0}]

        # Average performance metrics across folds
        mean_acc = float(np.mean(acc_list))
        mean_prec = float(np.mean(prec_list))
        mean_rec = float(np.mean(rec_list))
        mean_f1 = float(np.mean(f1_list))
        mean_auc = float(np.mean(auc_list))

        sensitivity = round(float(tp / (tp + fn)), 4) if (tp + fn) > 0 else 0.0
        specificity = round(float(tn / (tn + fp)), 4) if (tn + fp) > 0 else 0.0

        results[name] = {
            "model_name": name,
            "accuracy": round(mean_acc, 4),
            "precision": round(mean_prec, 4),
            "recall": round(mean_rec, 4),
            "f1_score": round(mean_f1, 4),
            "roc_auc": round(mean_auc, 4),
            "training_time_sec": train_time,
            "confusion_matrix": {
                "tp": int(tp),
                "tn": int(tn),
                "fp": int(fp),
                "fn": int(fn),
                "sensitivity": sensitivity,
                "specificity": specificity
            },
            "roc_curve": roc_points
        }

    return results
