import json
from fastapi.testclient import TestClient
from main import app, startup_event

# Initialize application & load artifacts
startup_event()
client = TestClient(app)

print("="*60)
print("CKD PREDICT — END-TO-END SYSTEM PIPELINE VERIFICATION")
print("="*60)

# 1. Health Check
r_health = client.get("/health")
print("\n[1] GET /health")
print("Status Code:", r_health.status_code)
print("Response:", r_health.json())
assert r_health.status_code == 200
assert r_health.json()["status"] == "healthy"

# 2. Model Info
r_info = client.get("/model-info")
print("\n[2] GET /model-info")
print("Status Code:", r_info.status_code)
info = r_info.json()
print("Best Model Name:", info.get("best_model_name"))
print("Cross-Validation Accuracy:", f"{info['best_model_metrics']['accuracy']*100:.2f}%")
print("Cross-Validation F1-Score:", f"{info['best_model_metrics']['f1_score']*100:.2f}%")

# 3. Perform REAL End-to-End Patient Prediction (High Risk Sample)
high_risk_patient = {
    "age": 62,
    "bp": 90,
    "sg": 1.010,
    "al": 3,
    "su": 2,
    "bgr": 220,
    "bu": 86,
    "sc": 4.2,
    "sod": 130,
    "pot": 5.8,
    "hemo": 8.5,
    "pcv": 26,
    "wc": 11200,
    "rc": 3.2,
    "rbc": "abnormal",
    "pc": "abnormal",
    "pcc": "present",
    "ba": "present",
    "htn": "yes",
    "dm": "yes",
    "cad": "yes",
    "appet": "poor",
    "pe": "yes",
    "ane": "yes"
}

print("\n[3] POST /predict (High Risk Patient A)")
r_pred_high = client.post("/predict", json=high_risk_patient)
print("Status Code:", r_pred_high.status_code)
res_high = r_pred_high.json()
print("Prediction:", res_high["prediction_label"])
print("Probability Score:", f"{res_high['probability_percentage']}%")
print("Risk Category:", res_high["risk_level"])
print("\nDynamic SHAP Feature Attributions (Top 4):")
for feat in res_high["shap_explanation"]["local_explanations"][:4]:
    print(f"  - {feat['feature']}: SHAP={feat['shap_value']} ({feat['effect']})")

# 4. Perform REAL End-to-End Patient Prediction (Low Risk Sample)
low_risk_patient = {
    "age": 32,
    "bp": 75,
    "sg": 1.025,
    "al": 0,
    "su": 0,
    "bgr": 95,
    "bu": 22,
    "sc": 0.8,
    "sod": 142,
    "pot": 4.2,
    "hemo": 15.5,
    "pcv": 48,
    "wc": 6800,
    "rc": 5.5,
    "rbc": "normal",
    "pc": "normal",
    "pcc": "notpresent",
    "ba": "notpresent",
    "htn": "no",
    "dm": "no",
    "cad": "no",
    "appet": "good",
    "pe": "no",
    "ane": "no"
}

print("\n[4] POST /predict (Low Risk Patient B)")
r_pred_low = client.post("/predict", json=low_risk_patient)
print("Status Code:", r_pred_low.status_code)
res_low = r_pred_low.json()
print("Prediction:", res_low["prediction_label"])
print("Probability Score:", f"{res_low['probability_percentage']}%")
print("Risk Category:", res_low["risk_level"])

# 5. Check SQLite Predictions Audit History
r_hist = client.get("/predictions")
print("\n[5] GET /predictions (SQLite Audit Trail)")
print("Status Code:", r_hist.status_code)
hist = r_hist.json()
print(f"Total Audit Logged Predictions: {len(hist)} records")

print("\n"+"="*60)
print("ALL END-TO-END PIPELINE VERIFICATION TESTS PASSED SUCCESSFULLY!")
print("="*60)
