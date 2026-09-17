from typing import Optional
from pydantic import BaseModel

class BloodPressureInputSchema(BaseModel):
    systolic: int
    diastolic: int
    pulse: Optional[int] = None
    date: Optional[str] = None
    time: Optional[str] = None

class LabResultInputSchema(BaseModel):
    test_date: str
    sc: Optional[float] = None
    bu: Optional[float] = None
    egfr: Optional[float] = None
    hemo: Optional[float] = None
    sod: Optional[float] = None
    pot: Optional[float] = None
    bgr: Optional[float] = None
    al: Optional[int] = None
    protein: Optional[str] = None
    rbc: Optional[str] = None
    wbc: Optional[float] = None

class WearableLogInputSchema(BaseModel):
    log_date: str
    steps: Optional[int] = None
    active_minutes: Optional[int] = None
    calories: Optional[int] = None
    sedentary_alerts: Optional[int] = None
    heart_rate: Optional[int] = None
    min_hr: Optional[int] = None
    max_hr: Optional[int] = None
    hrv: Optional[int] = None
    sleep_duration: Optional[float] = None
    awake_duration: Optional[float] = None
    sleep_score: Optional[int] = None
    stress_level: Optional[int] = None
