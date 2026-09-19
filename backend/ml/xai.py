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

CLINICAL_ATTRIBUTE_LABELS = {
    "age": "Age",
    "bp": "Blood Pressure",
    "sg": "Specific Gravity",
    "al": "Albumin",
    "su": "Sugar",
    "rbc": "Red Blood Cells",
    "pc": "Pus Cell",
    "pcc": "Pus Cell Clumps",
    "ba": "Bacteria",
    "bgr": "Blood Glucose Random",
    "bu": "Blood Urea",
    "sc": "Serum Creatinine",
    "sod": "Sodium",
    "pot": "Potassium",
    "hemo": "Hemoglobin",
    "pcv": "Packed Cell Volume",
    "wc": "White Blood Cell Count",
    "rc": "Red Blood Cell Count",
    "htn": "Hypertension",
    "dm": "Diabetes Mellitus",
    "cad": "Coronary Artery Disease",
    "appet": "Appetite",
    "pe": "Pedal Edema",
    "ane": "Anemia"
}

def compute_global_shap_importance(model, X_train_transformed, feature_names, numeric_cols, categorical_cols):
    """
    Computes global SHAP feature importance across all 24 clinical attributes using the trained model.
    Maps transformed one-hot/scaled features back to the 24 clinical parameters,
    ranks them by mean absolute SHAP value, and dynamically identifies the 13 Selected Important Attributes.
    """
    model_type = type(model).__name__.lower()
    vals_matrix = None

    try:
        if 'forest' in model_type or 'tree' in model_type or 'xgb' in model_type or 'boost' in model_type:
            explainer = shap.TreeExplainer(model)
            shap_values = explainer.shap_values(X_train_transformed)
        elif 'logistic' in model_type or 'linear' in model_type or 'ridge' in model_type:
            explainer = shap.LinearExplainer(model, X_train_transformed[:50])
            shap_values = explainer.shap_values(X_train_transformed)
        else:
            background = shap.sample(X_train_transformed, min(20, X_train_transformed.shape[0]))
            explainer = shap.KernelExplainer(model.predict_proba, background)
            shap_values = explainer.shap_values(X_train_transformed[:50])

        if isinstance(shap_values, list):
            vals_matrix = shap_values[1] if len(shap_values) > 1 else shap_values[0]
        elif len(shap_values.shape) == 3:
            vals_matrix = shap_values[:, :, 1]
        else:
            vals_matrix = shap_values
    except Exception as e:
        print(f"Global SHAP computation fallback due to: {e}")
        if hasattr(model, 'feature_importances_'):
            imps = model.feature_importances_
        elif hasattr(model, 'coef_'):
            imps = np.abs(model.coef_[0])
        else:
            imps = np.ones(len(feature_names)) / len(feature_names)
        vals_matrix = np.tile(imps, (min(len(X_train_transformed), 50), 1))

    # Mean absolute SHAP value per transformed feature
    mean_abs_per_transformed = np.mean(np.abs(vals_matrix), axis=0)
    transformed_shap_map = {
        name: float(mean_abs_per_transformed[i])
        for i, name in enumerate(feature_names)
    }

    # Aggregate back to the 24 clinical attributes
    all_24_attributes = list(numeric_cols) + list(categorical_cols)
    attribute_importance = {}

    for attr in all_24_attributes:
        is_num = attr in numeric_cols
        total_shap = 0.0
        matched_cols = []
        for feat_name, shap_val in transformed_shap_map.items():
            if is_num:
                if feat_name == attr or feat_name == f"num__{attr}":
                    total_shap += shap_val
                    matched_cols.append(feat_name)
            else:
                # Categorical column match e.g. "cat__rbc_normal", "rbc_normal", "rbc"
                clean_feat = feat_name.replace("cat__", "")
                if clean_feat == attr or clean_feat.startswith(f"{attr}_") or clean_feat.startswith(f"{attr}="):
                    total_shap += shap_val
                    matched_cols.append(feat_name)

        if not matched_cols and attr in transformed_shap_map:
            total_shap = transformed_shap_map[attr]

        attribute_importance[attr] = {
            "attribute": attr,
            "label": CLINICAL_ATTRIBUTE_LABELS.get(attr, attr.upper()),
            "type": "Numerical" if is_num else "Categorical",
            "mean_abs_shap": round(float(total_shap), 4)
        }

    # Rank all 24 attributes descending by mean absolute SHAP
    ranked_attributes = sorted(
        attribute_importance.values(),
        key=lambda x: x["mean_abs_shap"],
        reverse=True
    )

    # Assign ranks and select the top 13
    for idx, item in enumerate(ranked_attributes, 1):
        item["rank"] = idx
        item["is_selected_top_13"] = (idx <= 13)

    top_13_attributes = [item["attribute"] for item in ranked_attributes if item["is_selected_top_13"]]
    top_13_labels = [item["label"] for item in ranked_attributes if item["is_selected_top_13"]]

    return {
        "ranked_attributes": ranked_attributes,
        "top_13_attributes": top_13_attributes,
        "top_13_labels": top_13_labels,
        "total_attributes": len(ranked_attributes),
        "selected_count": len(top_13_attributes),
        "transformed_features_shap": [
            {"feature": f, "mean_abs_shap": round(float(v), 4)}
            for f, v in sorted(transformed_shap_map.items(), key=lambda x: x[1], reverse=True)
        ]
    }
