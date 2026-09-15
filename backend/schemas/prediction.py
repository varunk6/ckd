from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class CKDInputSchema(BaseModel):
    age: float = Field(..., ge=1, le=120, description="Patient age in years")
    bp: float = Field(..., ge=40, le=200, description="Blood pressure in mm/Hg")
    sg: float = Field(1.020, ge=1.000, le=1.035, description="Specific Gravity")
    al: float = Field(0, ge=0, le=5, description="Albumin level")
    su: float = Field(0, ge=0, le=5, description="Sugar level")
    rbc: str = Field("normal", description="Red Blood Cells: normal / abnormal")
    pc: str = Field("normal", description="Pus Cell: normal / abnormal")
    pcc: str = Field("notpresent", description="Pus Cell Clumps: present / notpresent")
    ba: str = Field("notpresent", description="Bacteria: present / notpresent")
    bgr: float = Field(120.0, ge=50, le=600, description="Blood Glucose Random in mg/dl")
    bu: float = Field(30.0, ge=5, le=400, description="Blood Urea in mg/dl")
    sc: float = Field(1.2, ge=0.1, le=30.0, description="Serum Creatinine in mg/dl")
    sod: float = Field(138.0, ge=100, le=180, description="Sodium in mEq/L")
    pot: float = Field(4.5, ge=2.0, le=10.0, description="Potassium in mEq/L")
    hemo: float = Field(14.0, ge=3.0, le=20.0, description="Hemoglobin in gms")
    pcv: float = Field(44.0, ge=10, le=60, description="Packed Cell Volume")
    wc: float = Field(7800.0, ge=1000, le=30000, description="White Blood Cell Count")
    rc: float = Field(5.2, ge=1.0, le=10.0, description="Red Blood Cell Count")
    htn: str = Field("no", description="Hypertension: yes / no")
    dm: str = Field("no", description="Diabetes Mellitus: yes / no")
    cad: str = Field("no", description="Coronary Artery Disease: yes / no")
    appet: str = Field("good", description="Appetite: good / poor")
    pe: str = Field("no", description="Pedal Edema: yes / no")
    ane: str = Field("no", description="Anemia: yes / no")

class CKDPredictionResponse(BaseModel):
    id: int
    prediction: str # 'ckd' or 'notckd'
    prediction_label: str # 'Chronic Kidney Disease Detected' or 'No Chronic Kidney Disease Detected'
    probability: float # e.g. 0.87
    probability_percentage: float # e.g. 87.0
    risk_level: str # 'Low', 'Moderate', 'High'
    message: str
    disclaimer: str
    shap_explanation: Optional[Dict[str, Any]] = None
    lime_explanation: Optional[Dict[str, Any]] = None

class ExperimentRequestSchema(BaseModel):
    cv_folds: int = Field(5, ge=2, le=10, description="Number of cross-validation folds")
    balancing_method: str = Field("smote", description="Class balancing method: none / smote / smotetomek")
    top_k_features: int = Field(15, ge=5, le=24, description="Top feature subset size")
    selected_model_name: Optional[str] = Field(None, description="Optional target model override")

class ExplainRequestSchema(BaseModel):
    input_data: CKDInputSchema
    method: str = Field("both", description="xai method: shap / lime / both")
