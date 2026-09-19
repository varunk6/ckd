import os
import json
import joblib
import datetime
import numpy as np
import pandas as pd

from dataset import load_and_clean_dataset, NUMERIC_COLS, CATEGORICAL_COLS
from preprocessing import create_preprocessing_pipeline, get_transformed_feature_names
from feature_selection import evaluate_feature_selection
from balancing import apply_class_balancing
from models import get_model_dictionary
from evaluator import evaluate_models_cv
from xai import compute_global_shap_importance

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")
os.makedirs(MODEL_DIR, exist_ok=True)

def run_experiment_pipeline(
    cv_folds=5,
    balancing_method='smote',
    top_k_features=15,
    selected_model_name=None
):
    """
    Executes complete end-to-end CKD ML research experiment:
    Data Loading -> Preprocessing -> Feature Selection -> Class Balancing -> Multi-Model CV -> Best Model Selection -> Artifact Persistence.
    """
    # 1. Load & Clean Dataset
    df_clean, X, y, metadata = load_and_clean_dataset()

    # 2. Fit Preprocessing Pipeline
    preprocessor = create_preprocessing_pipeline(NUMERIC_COLS, CATEGORICAL_COLS)
    X_transformed = preprocessor.fit_transform(X)
    feature_names = get_transformed_feature_names(preprocessor, NUMERIC_COLS, CATEGORICAL_COLS)

    # 3. Feature Selection Analysis
    fs_results = evaluate_feature_selection(X_transformed, y, feature_names, top_k=top_k_features)

    # 4. Multi-Model CV Evaluation
    models_dict = get_model_dictionary()
    eval_results = evaluate_models_cv(
        models=models_dict,
        X=X_transformed,
        y=y,
        cv_folds=cv_folds,
        balancing_method=balancing_method
    )

    # 5. Objective Best Model Selection (based on highest F1-Score, then ROC-AUC, then Accuracy)
    sorted_models = sorted(
        eval_results.values(),
        key=lambda m: (m['f1_score'], m['roc_auc'], m['accuracy']),
        reverse=True
    )
    
    best_eval = sorted_models[0]
    best_model_name = selected_model_name if (selected_model_name and selected_model_name in models_dict) else best_eval['model_name']
    
    best_model_instance = models_dict[best_model_name]
    
    # 6. Apply balancing to full dataset & fit best model for persistence
    X_full_bal, y_full_bal, balance_label = apply_class_balancing(
        X_transformed, y, method=balancing_method
    )
    best_model_instance.fit(X_full_bal, y_full_bal)

    # 7. Compute Global SHAP Feature Importance across all 24 clinical attributes
    shap_results = compute_global_shap_importance(
        best_model_instance,
        X_transformed,
        feature_names,
        NUMERIC_COLS,
        CATEGORICAL_COLS
    )

    # 8. Persist Artifacts
    best_model_path = os.path.join(MODEL_DIR, "best_model.pkl")
    pipeline_path = os.path.join(MODEL_DIR, "preprocessing_pipeline.pkl")
    fs_path = os.path.join(MODEL_DIR, "feature_selection.pkl")
    metadata_path = os.path.join(MODEL_DIR, "model_metadata.json")
    
    # Also save fallback legacy names model.pkl / preprocessing.pkl for backwards compatibility
    legacy_model_path = os.path.join(MODEL_DIR, "model.pkl")
    legacy_prep_path = os.path.join(MODEL_DIR, "preprocessing.pkl")

    joblib.dump(best_model_instance, best_model_path)
    joblib.dump(preprocessor, pipeline_path)
    joblib.dump(shap_results, fs_path)

    joblib.dump(best_model_instance, legacy_model_path)
    joblib.dump(preprocessor, legacy_prep_path)

    model_metadata = {
        "project_title": "Machine Learning-Based Early Detection of Chronic Kidney Disease (CKD)",
        "guide": "Ms. Janani .D — AP/IT",
        "team": [
            "Arunkumar .K — 727624BIT105",
            "Ritheekvarshan .S — 727624BIT001",
            "Varun.K — 727624BIT021"
        ],
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "best_model_name": best_model_name,
        "class_balancing_method": balancing_method,
        "class_balancing_label": balance_label,
        "cv_folds": cv_folds,
        "total_records": metadata['total_records'],
        "total_features": metadata['total_features'],
        "transformed_features_count": len(feature_names),
        "best_model_metrics": best_eval,
        "all_models_comparison": list(eval_results.values()),
        "shap_analysis": shap_results,
        "top_13_attributes": shap_results["top_13_attributes"],
        "top_13_labels": shap_results["top_13_labels"],
        "all_24_attributes": shap_results["ranked_attributes"],
        "top_features": shap_results["top_13_attributes"],
        "feature_selection_summary": fs_results['summary'],
        "class_distribution": metadata['class_distribution']
    }

    with open(metadata_path, "w") as f:
        json.dump(model_metadata, f, indent=2)

    # Also save metrics.json for legacy endpoints
    metrics_path = os.path.join(MODEL_DIR, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(best_eval, f, indent=2)

    return {
        "status": "success",
        "message": f"Experiment completed. Best model selected: {best_model_name}",
        "best_model": best_model_name,
        "metrics": best_eval,
        "model_metadata": model_metadata,
        "all_models": list(eval_results.values()),
        "shap_analysis": shap_results,
        "feature_selection": fs_results
    }

if __name__ == "__main__":
    print("Running initial research experiment pipeline...")
    res = run_experiment_pipeline()
    print(f"Done! Best Model: {res['best_model']} (Accuracy: {res['metrics']['accuracy']*100:.1f}%)")
