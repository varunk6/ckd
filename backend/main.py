import os
import sys
import json
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
ML_DIR = os.path.join(BASE_DIR, "ml")
if ML_DIR not in sys.path:
    sys.path.insert(0, ML_DIR)

from schemas.prediction import (
    CKDInputSchema, 
    CKDPredictionResponse, 
    ExperimentRequestSchema, 
    ExplainRequestSchema
)
from schemas.health import (
    BloodPressureInputSchema,
    LabResultInputSchema,
    WearableLogInputSchema
)
from database.db import (
    init_db, 
    save_prediction, 
    get_predictions, 
    delete_prediction, 
    clear_all_predictions,
    get_statistics,
    save_bp_reading,
    get_bp_readings,
    delete_bp_reading,
    save_lab_result,
    get_lab_results,
    delete_lab_result,
    save_wearable_log,
    get_wearable_logs,
    delete_wearable_log,
    get_health_summary
)
from ml.dataset import load_and_clean_dataset, NUMERIC_COLS, CATEGORICAL_COLS
from ml.preprocessing import get_transformed_feature_names
from ml.experiment_runner import run_experiment_pipeline
from ml.xai import compute_shap_explanations, compute_lime_explanations
from ml.report_generator import generate_research_report

app = FastAPI(
    title="CKD Predict — Research & Explainable AI Platform",
    description="Explainable Multi-Model Machine Learning Framework for Early Chronic Kidney Disease Prediction",
    version="2.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vercel Serverless Path Normalization Middleware
@app.middleware("http")
async def vercel_path_normalization_middleware(request: Request, call_next):
    path = request.scope.get("path", "")
    if path.startswith("/api/index.py"):
        request.scope["path"] = path[13:] if len(path) > 13 else "/"
    elif path.startswith("/api"):
        request.scope["path"] = path[4:] if len(path) > 4 else "/"
    response = await call_next(request)
    return response

# Paths for models and artifacts
MODEL_DIR = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "best_model.pkl")
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "preprocessing_pipeline.pkl")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")

# Fallback legacy paths
LEGACY_MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")
LEGACY_PREP_PATH = os.path.join(MODEL_DIR, "preprocessing.pkl")

best_model = None
preprocessor = None
model_metadata = {}

def load_artifacts():
    global best_model, preprocessor, model_metadata
    init_db()
    
    m_path = MODEL_PATH if os.path.exists(MODEL_PATH) else LEGACY_MODEL_PATH
    p_path = PREPROCESSOR_PATH if os.path.exists(PREPROCESSOR_PATH) else LEGACY_PREP_PATH
    
    if os.path.exists(m_path) and os.path.exists(p_path):
        try:
            best_model = joblib.load(m_path)
            preprocessor = joblib.load(p_path)
            print(f"Successfully loaded model from {m_path}")
        except Exception as e:
            print(f"Error loading model artifacts: {e}")
            
    if os.path.exists(METADATA_PATH):
        try:
            with open(METADATA_PATH, "r") as f:
                model_metadata = json.load(f)
        except Exception as e:
            print(f"Error loading metadata: {e}")
    else:
        # Run default experiment pipeline if no metadata exists
        print("No existing metadata found. Auto-executing initial research experiment pipeline...")
        try:
            exp_res = run_experiment_pipeline()
            model_metadata = exp_res.get("model_metadata", {})
            load_artifacts()
        except Exception as ex:
            print(f"Auto-experiment pipeline initialization failed: {ex}")

@app.on_event("startup")
def startup_event():
    load_artifacts()

# Eagerly load artifacts on import for serverless environments (e.g., Vercel)
try:
    load_artifacts()
except Exception as e:
    print(f"Eager load_artifacts exception: {e}")


@app.get("/")
def root():
    return {
        "message": "Explainable Multi-Model Machine Learning Framework for Early CKD Prediction API",
        "documentation": "/docs",
        "status": "online"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": best_model is not None,
        "preprocessor_loaded": preprocessor is not None,
        "database_online": True,
        "best_model_name": model_metadata.get("best_model_name", "N/A")
    }

@app.get("/dataset-info")
def dataset_info():
    try:
        _, X, y, metadata = load_and_clean_dataset()
        return metadata
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/eda/class-distribution")
def eda_class_distribution():
    try:
        _, _, y, metadata = load_and_clean_dataset()
        return metadata.get("class_distribution", {})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/eda/correlation")
def eda_correlation():
    try:
        df_clean, X, y, _ = load_and_clean_dataset()
        # Compute correlation among numerical columns + target
        num_df = df_clean[NUMERIC_COLS].copy()
        num_df['ckd'] = y
        corr = num_df.corr().round(3)
        return {
            "columns": list(corr.columns),
            "correlation_matrix": corr.to_dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/eda/features")
def eda_features():
    try:
        df_clean, X, y, metadata = load_and_clean_dataset()
        summary = {}
        for col in NUMERIC_COLS:
            if col in df_clean.columns:
                summary[col] = {
                    "min": float(df_clean[col].min()),
                    "max": float(df_clean[col].max()),
                    "mean": float(round(df_clean[col].mean(), 2)),
                    "median": float(round(df_clean[col].median(), 2)),
                    "missing": int(df_clean[col].isnull().sum())
                }
        return {
            "numerical_summary": summary,
            "categorical_features": CATEGORICAL_COLS
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/feature-selection")
def get_feature_selection_data():
    if "feature_selection_summary" in model_metadata:
        return {
            "top_features": model_metadata.get("top_features", []),
            "summary": model_metadata.get("feature_selection_summary", [])
        }
    try:
        df_clean, X, y, _ = load_and_clean_dataset()
        prep = create_preprocessing_pipeline(NUMERIC_COLS, CATEGORICAL_COLS)
        X_trans = prep.fit_transform(X)
        feat_names = get_transformed_feature_names(prep, NUMERIC_COLS, CATEGORICAL_COLS)
        fs_res = evaluate_feature_selection(X_trans, y, feat_names)
        return fs_res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models/comparison")
def models_comparison():
    if "all_models_comparison" in model_metadata:
        return {
            "best_model": model_metadata.get("best_model_name"),
            "models": model_metadata.get("all_models_comparison")
        }
    raise HTTPException(status_code=404, detail="No model comparison metadata available. Run experiment first.")

@app.get("/model-info")
def model_info():
    if not model_metadata:
        raise HTTPException(status_code=404, detail="Model metadata not found.")
    return model_metadata

@app.get("/metrics")
def metrics():
    if "best_model_metrics" in model_metadata:
        return model_metadata["best_model_metrics"]
    raise HTTPException(status_code=404, detail="Metrics not found.")

@app.post("/experiment/run")
def run_experiment(req: ExperimentRequestSchema):
    try:
        res = run_experiment_pipeline(
            cv_folds=req.cv_folds,
            balancing_method=req.balancing_method,
            top_k_features=req.top_k_features,
            selected_model_name=req.selected_model_name
        )
        load_artifacts()
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Experiment execution failed: {str(e)}")

def transform_single_input(payload: CKDInputSchema):
    input_dict = {
        "age": [payload.age],
        "bp": [payload.bp],
        "sg": [payload.sg],
        "al": [payload.al],
        "su": [payload.su],
        "bgr": [payload.bgr],
        "bu": [payload.bu],
        "sc": [payload.sc],
        "sod": [payload.sod],
        "pot": [payload.pot],
        "hemo": [payload.hemo],
        "pcv": [payload.pcv],
        "wc": [payload.wc],
        "rc": [payload.rc],
        "rbc": [payload.rbc.lower().strip()],
        "pc": [payload.pc.lower().strip()],
        "pcc": [payload.pcc.lower().strip()],
        "ba": [payload.ba.lower().strip()],
        "htn": [payload.htn.lower().strip()],
        "dm": [payload.dm.lower().strip()],
        "cad": [payload.cad.lower().strip()],
        "appet": [payload.appet.lower().strip()],
        "pe": [payload.pe.lower().strip()],
        "ane": [payload.ane.lower().strip()]
    }
    input_df = pd.DataFrame(input_dict)
    X_single_trans = preprocessor.transform(input_df)
    return input_df, X_single_trans

@app.post("/predict", response_model=CKDPredictionResponse)
def predict_ckd(payload: CKDInputSchema):
    if best_model is None or preprocessor is None:
        raise HTTPException(status_code=503, detail="ML model or preprocessor is not loaded.")

    try:
        input_df, X_single_trans = transform_single_input(payload)
        
        pred_class = best_model.predict(X_single_trans)[0]
        
        if hasattr(best_model, "predict_proba"):
            probabilities = best_model.predict_proba(X_single_trans)[0]
            prob_ckd = float(probabilities[1])
            prob_notckd = float(probabilities[0])
        else:
            prob_ckd = 1.0 if pred_class == 1 else 0.0
            prob_notckd = 1.0 - prob_ckd

        if pred_class == 1:
            prediction_code = "ckd"
            label = "Chronic Kidney Disease Detected"
            probability_val = prob_ckd
            risk_level = "High" if prob_ckd >= 0.70 else "Moderate"
            msg = "The machine learning model predicts a higher likelihood of Chronic Kidney Disease based on the submitted health parameters."
        else:
            prediction_code = "notckd"
            label = "No Chronic Kidney Disease Detected"
            probability_val = prob_notckd
            risk_level = "Low"
            msg = "The machine learning model predicts a lower likelihood of Chronic Kidney Disease based on the submitted health parameters."

        disclaimer = "Educational screening tool only. This prediction is not a medical diagnosis. Please consult a qualified healthcare professional for medical advice."

        # Compute dynamic SHAP attributions for this prediction instance
        _, X_full, y_full, _ = load_and_clean_dataset()
        X_bg_trans = preprocessor.transform(X_full)
        feat_names = get_transformed_feature_names(preprocessor, NUMERIC_COLS, CATEGORICAL_COLS)
        
        shap_exp = compute_shap_explanations(best_model, X_bg_trans, X_single_trans, feat_names)
        lime_exp = compute_lime_explanations(best_model, X_bg_trans, X_single_trans, feat_names)

        # Log prediction to SQLite DB
        record_id = save_prediction(
            age=payload.age,
            bp=payload.bp,
            prediction=prediction_code,
            probability=probability_val,
            risk_level=risk_level,
            features=payload.dict()
        )

        return CKDPredictionResponse(
            id=record_id,
            prediction=prediction_code,
            prediction_label=label,
            probability=round(probability_val, 4),
            probability_percentage=round(probability_val * 100, 1),
            risk_level=risk_level,
            message=msg,
            disclaimer=disclaimer,
            shap_explanation=shap_exp,
            lime_explanation=lime_exp
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction processing error: {str(e)}")

@app.post("/explain")
def explain_prediction(req: ExplainRequestSchema):
    if best_model is None or preprocessor is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")
        
    try:
        input_df, X_single_trans = transform_single_input(req.input_data)
        _, X_full, _, _ = load_and_clean_dataset()
        X_bg_trans = preprocessor.transform(X_full)
        feat_names = get_transformed_feature_names(preprocessor, NUMERIC_COLS, CATEGORICAL_COLS)
        
        res = {}
        if req.method in ["shap", "both"]:
            res["shap"] = compute_shap_explanations(best_model, X_bg_trans, X_single_trans, feat_names)
        if req.method in ["lime", "both"]:
            res["lime"] = compute_lime_explanations(best_model, X_bg_trans, X_single_trans, feat_names)
            
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predictions")
def list_predictions(limit: int = 100):
    return get_predictions(limit=limit)

@app.delete("/predictions")
def clear_predictions():
    count = clear_all_predictions()
    return {"message": f"Cleared {count} prediction records successfully."}

@app.delete("/predictions/{prediction_id}")
def remove_prediction(prediction_id: int):
    success = delete_prediction(prediction_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Prediction ID {prediction_id} not found.")
    return {"message": f"Prediction {prediction_id} deleted successfully."}

@app.get("/report/generate")
def get_report():
    if not model_metadata:
        raise HTTPException(status_code=404, detail="No metadata found to generate report.")
    report_md = generate_research_report(model_metadata)
    return {
        "report_markdown": report_md,
        "generated_on": model_metadata.get("timestamp"),
        "best_model": model_metadata.get("best_model_name")
    }

# Blood Pressure Endpoints
@app.get("/blood-pressure")
def list_blood_pressure(limit: int = 100):
    return get_bp_readings(limit=limit)

@app.post("/blood-pressure")
def add_blood_pressure(payload: BloodPressureInputSchema):
    record_id = save_bp_reading(
        systolic=payload.systolic,
        diastolic=payload.diastolic,
        pulse=payload.pulse,
        date=payload.date,
        time=payload.time
    )
    return {"id": record_id, "message": "Blood pressure reading saved successfully."}

@app.delete("/blood-pressure/{bp_id}")
def remove_blood_pressure(bp_id: int):
    success = delete_bp_reading(bp_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"BP record ID {bp_id} not found.")
    return {"message": f"BP record {bp_id} deleted successfully."}

# Lab Results Endpoints
@app.get("/lab-results")
def list_lab_results(limit: int = 100):
    return get_lab_results(limit=limit)

@app.post("/lab-results")
def add_lab_result(payload: LabResultInputSchema):
    record_id = save_lab_result(
        test_date=payload.test_date,
        sc=payload.sc,
        bu=payload.bu,
        egfr=payload.egfr,
        hemo=payload.hemo,
        sod=payload.sod,
        pot=payload.pot,
        bgr=payload.bgr,
        al=payload.al,
        protein=payload.protein,
        rbc=payload.rbc,
        wbc=payload.wbc
    )
    return {"id": record_id, "message": "Lab result saved successfully."}

@app.delete("/lab-results/{lab_id}")
def remove_lab_result(lab_id: int):
    success = delete_lab_result(lab_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Lab result ID {lab_id} not found.")
    return {"message": f"Lab result {lab_id} deleted successfully."}

# Wearable Logs Endpoints
@app.get("/wearable-logs")
def list_wearable_logs(limit: int = 100):
    return get_wearable_logs(limit=limit)

@app.post("/wearable-logs")
def add_wearable_log(payload: WearableLogInputSchema):
    record_id = save_wearable_log(
        log_date=payload.log_date,
        steps=payload.steps,
        active_minutes=payload.active_minutes,
        calories=payload.calories,
        sedentary_alerts=payload.sedentary_alerts,
        heart_rate=payload.heart_rate,
        min_hr=payload.min_hr,
        max_hr=payload.max_hr,
        hrv=payload.hrv,
        sleep_duration=payload.sleep_duration,
        awake_duration=payload.awake_duration,
        sleep_score=payload.sleep_score,
        stress_level=payload.stress_level
    )
    return {"id": record_id, "message": "Wearable log saved successfully."}

@app.delete("/wearable-logs/{log_id}")
def remove_wearable_log(log_id: int):
    success = delete_wearable_log(log_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Wearable log ID {log_id} not found.")
    return {"message": f"Wearable log {log_id} deleted successfully."}

# Health Summary Endpoint
@app.get("/health-summary")
def health_summary():
    return get_health_summary()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
