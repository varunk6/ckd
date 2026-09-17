import os
import json
import sys
from fastapi.testclient import TestClient

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from main import app, startup_event

client = TestClient(app)

def setup_module(module):
    startup_event()

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["preprocessor_loaded"] is True

def test_dataset_info_endpoint():
    response = client.get("/dataset-info")
    assert response.status_code == 200
    data = response.json()
    assert data["total_records"] > 0
    assert "numeric_features" in data

def test_eda_endpoints():
    r1 = client.get("/eda/class-distribution")
    assert r1.status_code == 200
    r2 = client.get("/eda/correlation")
    assert r2.status_code == 200
    r3 = client.get("/eda/features")
    assert r3.status_code == 200

def test_feature_selection_endpoint():
    response = client.get("/feature-selection")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data or "selected_features" in data

def test_models_comparison_endpoint():
    response = client.get("/models/comparison")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert len(data["models"]) >= 1

def test_predict_and_explain_endpoint():
    sample_payload = {
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
    response = client.post("/predict", json=sample_payload)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "shap_explanation" in data
    assert "lime_explanation" in data

def test_report_generate_endpoint():
    response = client.get("/report/generate")
    assert response.status_code == 200
    data = response.json()
    assert "report_markdown" in data
    assert len(data["report_markdown"]) > 100

def test_health_modules_endpoints():
    # Test Blood Pressure
    bp_resp = client.post("/blood-pressure", json={"systolic": 120, "diastolic": 80, "pulse": 72, "date": "2026-09-17", "time": "09:00"})
    assert bp_resp.status_code == 200
    bp_id = bp_resp.json()["id"]
    
    get_bp = client.get("/blood-pressure")
    assert get_bp.status_code == 200
    assert len(get_bp.json()) >= 1

    # Test Lab Results
    lab_resp = client.post("/lab-results", json={"test_date": "2026-09-17", "sc": 1.2, "bu": 40, "egfr": 75.0, "hemo": 13.5})
    assert lab_resp.status_code == 200
    lab_id = lab_resp.json()["id"]

    get_lab = client.get("/lab-results")
    assert get_lab.status_code == 200
    assert len(get_lab.json()) >= 1

    # Test Wearable Logs
    wear_resp = client.post("/wearable-logs", json={"log_date": "2026-09-17", "steps": 8500, "heart_rate": 68, "sleep_duration": 7.5})
    assert wear_resp.status_code == 200
    wear_id = wear_resp.json()["id"]

    get_wear = client.get("/wearable-logs")
    assert get_wear.status_code == 200
    assert len(get_wear.json()) >= 1

    # Test Health Summary
    sum_resp = client.get("/health-summary")
    assert sum_resp.status_code == 200
    assert "latest_bp" in sum_resp.json()

    # Clean up created test items
    client.delete(f"/blood-pressure/{bp_id}")
    client.delete(f"/lab-results/{lab_id}")
    client.delete(f"/wearable-logs/{wear_id}")

if __name__ == "__main__":
    setup_module(None)
    test_health_endpoint()
    test_dataset_info_endpoint()
    test_eda_endpoints()
    test_feature_selection_endpoint()
    test_models_comparison_endpoint()
    test_predict_and_explain_endpoint()
    test_report_generate_endpoint()
    test_health_modules_endpoints()
    print("ALL BACKEND RESEARCH & HEALTH API TESTS PASSED SUCCESSFULLY!")

