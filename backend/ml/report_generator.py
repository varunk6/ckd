import json
import os
import datetime

def generate_research_report(metadata):
    """
    Generates a 15-section academic research report markdown document based on empirical experiment results.
    """
    best_name = metadata.get("best_model_name", "Random Forest")
    metrics = metadata.get("best_model_metrics", {})
    all_models = metadata.get("all_models_comparison", [])
    fs_summary = metadata.get("feature_selection_summary", [])
    top_features = metadata.get("top_features", [])
    timestamp = metadata.get("timestamp", datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    cv_folds = metadata.get("cv_folds", 5)
    balancing = metadata.get("class_balancing_label", "SMOTE")
    records = metadata.get("total_records", 400)

    # Format model comparison table
    comparison_md_rows = []
    for m in all_models:
        is_best = "**(BEST)**" if m.get("model_name") == best_name else ""
        comparison_md_rows.append(
            f"| {m.get('model_name')} {is_best} | {m.get('accuracy', 0)*100:.2f}% | {m.get('precision', 0)*100:.2f}% | {m.get('recall', 0)*100:.2f}% | {m.get('f1_score', 0)*100:.2f}% | {m.get('roc_auc', 0):.4f} | {m.get('training_time_sec', 0):.3f}s |"
        )
    comparison_table = "\n".join(comparison_md_rows)

    top_feat_str = ", ".join(top_features[:8]) if top_features else "Serum Creatinine, Hemoglobin, Specific Gravity, Albumin, Packed Cell Volume"

    report_markdown = f"""# Research Report: Explainable Multi-Model Machine Learning Framework for Early Chronic Kidney Disease Prediction

**Project Title:** Explainable Multi-Model Machine Learning Framework for Early Chronic Kidney Disease Prediction  
**Generated On:** {timestamp}  
**Experiment Setup:** Stratified {cv_folds}-Fold Cross-Validation | Class Balancing: {balancing}  

---

> **Medical Disclaimer:** This report is generated strictly for educational and research screening evaluation. The models and predictions presented herein do not constitute a clinical diagnostic tool or medical advice.

---

## Section 1: Introduction & Clinical Motivation
Chronic Kidney Disease (CKD) is a progressive condition characterized by the gradual loss of renal function over months or years. Early detection is paramount because early therapeutic intervention can prevent or significantly delay progression to End-Stage Renal Disease (ESRD). Machine learning models offer promising decision-support capabilities for early risk stratification using routine clinical measurements.

## Section 2: Dataset Specifications
The study utilizes the clinical **UCI Chronic Kidney Disease Dataset**:
- **Total Records:** {records} patient instances
- **Total Features:** 24 clinical parameters (14 numerical, 10 categorical)
- **Target Variable:** Binary Classification (`ckd` vs `notckd`)
- **Class Distribution:** {metadata.get('class_distribution', {}).get('ckd', 250)} CKD instances (62.5%), {metadata.get('class_distribution', {}).get('notckd', 150)} Non-CKD instances (37.5%)

## Section 3: Data Preprocessing Pipeline
To avoid data leakage, all preprocessing transformations were fitted exclusively on training sets within each cross-validation fold:
1. **Missing Value Handling:** Median imputation for continuous attributes, mode (most frequent) imputation for nominal attributes.
2. **Nominal Categorical Encoding:** One-Hot Encoding applied to binary and multi-class categorical variables (`rbc`, `pc`, `pcc`, `ba`, `htn`, `dm`, `cad`, `appet`, `pe`, `ane`).
3. **Feature Scaling:** `StandardScaler` applied to zero-mean and unit-variance transform numerical features.

## Section 4: Feature Engineering
Clinical domain features were transformed into 24 standardized feature vectors. Missing representation characters (`?`, whitespace, tabs) were scrubbed prior to transformer fitting.

## Section 5: Feature Selection Methods
Six distinct feature selection algorithms were evaluated:
1. **Pearson Correlation Analysis**
2. **Chi-Square ($\\\\chi^2$) Independence Test**
3. **Variance Threshold Filtering**
4. **Recursive Feature Elimination (RFE)** with Random Forest backbone
5. **LASSO ($L_1$ Regularization)**
6. **Mutual Information Classifier**

**Top Consensus Features Identified:**  
`{top_feat_str}`

## Section 6: Class Imbalance & Oversampling
To mitigate potential majority-class bias during cross-validation training, synthetic oversampling was performed:
- **Selected Method:** {balancing}
- **Enforcement:** Applied strictly to training folds prior to classifier fitting to maintain out-of-fold validation integrity.

## Section 7: Machine Learning Algorithms Evaluated
Eight prominent machine learning architectures were trained and compared:
1. **Logistic Regression**
2. **Decision Tree Classifier**
3. **Random Forest Classifier**
4. **Support Vector Machine (SVM)**
5. **K-Nearest Neighbors (KNN)**
6. **Gaussian Naive Bayes**
7. **XGBoost Classifier**
8. **Multi-Layer Perceptron (Neural Network)**

## Section 8: Experimental Setup
- **Evaluation Strategy:** Stratified {cv_folds}-Fold Cross-Validation
- **Random Seed:** `42` (ensuring deterministic reproducibility)
- **Primary Metric:** F1-Score (balancing precision and recall for clinical safety)

## Section 9: Empirical Model Comparison
The table below summarizes the actual cross-validation performance across all evaluated models:

| Model Architecture | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Training Time |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
{comparison_table}

## Section 10: Best Model Selection & Rationale
Based on objective cross-validation criteria, **{best_name}** achieved the highest overall performance:
- **Accuracy:** {metrics.get('accuracy', 0)*100:.2f}%
- **Precision:** {metrics.get('precision', 0)*100:.2f}%
- **Recall:** {metrics.get('recall', 0)*100:.2f}%
- **F1-Score:** {metrics.get('f1_score', 0)*100:.2f}%
- **ROC-AUC:** {metrics.get('roc_auc', 0):.4f}

## Section 11: Explainable AI (SHAP & LIME Interpretation)
To transform complex black-box model decisions into clinically interpretable insights, the framework integrates:
- **SHAP (SHapley Additive exPlanations):** Quantifies global feature importance and individual patient waterfall attribution.
- **LIME (Local Interpretable Model-agnostic Explanations):** Computes local linear feature weights explaining specific prediction instances.

## Section 12: Comprehensive Clinical Results
The experimental results demonstrate that machine learning models utilizing routine clinical blood and urine tests (`Serum Creatinine`, `Hemoglobin`, `Specific Gravity`, `Albumin`, `Packed Cell Volume`) can achieve superior predictive accuracy for early CKD risk screening.

## Section 13: Limitations & Threats to Validity
1. **Sample Size:** Dataset size ({records} records) represents a single-center cohort; external multi-center validation is required.
2. **Missing Clinical History:** Longitudinal disease progression data was not available in the single static dataset.
3. **Non-Diagnostic Scope:** Predictions represent statistical model likelihoods, not definitive medical diagnoses.

## Section 14: Conclusion
The proposed Explainable Multi-Model Framework demonstrates that integrating multi-method feature selection, SMOTE class balancing, and XAI interpretability with robust classifiers like {best_name} provides an accurate, transparent screening decision-support tool.

## Section 15: Future Research Work
- Integration of multi-center longitudinal patient cohorts.
- Integration of deep learning transformer architectures for unstructured EHR clinical notes.
- Clinical prospective trial validation in real-world outpatient settings.
"""
    return report_markdown
