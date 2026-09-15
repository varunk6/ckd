import shap
import lime
import lime.lime_tabular
import numpy as np
import pandas as pd

def compute_shap_explanations(model, X_train_transformed, X_single_transformed, feature_names):
    """
    Computes global SHAP summary feature importances and local patient feature attributions.
    Handles Tree-based, Linear, and Kernel explainers.
    """
    model_type = type(model).__name__.lower()
    
    try:
        if 'forest' in model_type or 'tree' in model_type or 'xgb' in model_type or 'boost' in model_type:
            explainer = shap.TreeExplainer(model)
            shap_values = explainer.shap_values(X_single_transformed)
        elif 'logistic' in model_type or 'ridge' in model_type or 'linear' in model_type:
            explainer = shap.LinearExplainer(model, X_train_transformed[:50])
            shap_values = explainer.shap_values(X_single_transformed)
        else:
            # Fallback to KernelExplainer on small background sample
            background = shap.sample(X_train_transformed, min(20, X_train_transformed.shape[0]))
            explainer = shap.KernelExplainer(model.predict_proba, background)
            shap_values = explainer.shap_values(X_single_transformed)
            if isinstance(shap_values, list) and len(shap_values) > 1:
                shap_values = shap_values[1]
    except Exception as e:
        print(f"SHAP explainer fallback due to: {e}")
        # Robust fallback using model feature importances or coefficients
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
        elif hasattr(model, 'coef_'):
            importances = np.abs(model.coef_[0])
        else:
            importances = np.ones(len(feature_names)) / len(feature_names)
        
        local_attributions = []
        for i, fname in enumerate(feature_names):
            val = float(X_single_transformed[0][i])
            imp = float(importances[i])
            local_attributions.append({
                "feature": fname,
                "shap_value": round(val * imp, 4),
                "feature_value": round(val, 4),
                "effect": "Increases CKD risk" if val * imp > 0 else "Decreases CKD risk"
            })
        local_attributions = sorted(local_attributions, key=lambda x: abs(x["shap_value"]), reverse=True)
        return {
            "method": "SHAP (Fallback Attributions)",
            "local_explanations": local_attributions[:10]
        }

    # Extract 1D array of SHAP values for class 1 (CKD)
    if isinstance(shap_values, list):
        # Multi-class or binary list
        vals = shap_values[1][0] if len(shap_values) > 1 else shap_values[0][0]
    elif len(shap_values.shape) == 3:
        vals = shap_values[0, :, 1]
    elif len(shap_values.shape) == 2:
        vals = shap_values[0]
    else:
        vals = shap_values

    local_attributions = []
    for i, fname in enumerate(feature_names):
        shap_v = float(vals[i])
        feat_v = float(X_single_transformed[0][i])
        direction = "Increases CKD risk" if shap_v > 0 else "Decreases CKD risk"
        local_attributions.append({
            "feature": fname,
            "shap_value": round(shap_v, 4),
            "feature_value": round(feat_v, 4),
            "effect": direction
        })

    local_attributions = sorted(local_attributions, key=lambda x: abs(x["shap_value"]), reverse=True)

    return {
        "method": "SHAP (SHapley Additive exPlanations)",
        "local_explanations": local_attributions[:12]
    }

def compute_lime_explanations(model, X_train_transformed, X_single_transformed, feature_names):
    """
    Computes localized LIME explanations for individual patient prediction instances.
    """
    try:
        explainer = lime.lime_tabular.LimeTabularExplainer(
            training_data=np.array(X_train_transformed),
            feature_names=feature_names,
            class_names=['notckd', 'ckd'],
            mode='classification',
            random_state=42
        )

        exp = explainer.explain_instance(
            data_row=X_single_transformed[0],
            predict_fn=model.predict_proba,
            num_features=10
        )

        lime_list = []
        for feature_rule, weight in exp.as_list():
            lime_list.append({
                "rule": feature_rule,
                "weight": round(float(weight), 4),
                "effect": "Increases CKD risk" if weight > 0 else "Decreases CKD risk"
            })

        return {
            "method": "LIME (Local Interpretable Model-agnostic Explanations)",
            "local_explanations": lime_list
        }
    except Exception as e:
        print(f"LIME computation error: {e}")
        return {
            "method": "LIME",
            "error": str(e),
            "local_explanations": []
        }
