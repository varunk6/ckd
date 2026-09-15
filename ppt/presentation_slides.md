# CKD Predict — College Project First Review Presentation

**Project Title:** Explainable Multi-Model Machine Learning Framework for Early Chronic Kidney Disease Prediction  
**Theme:** Healthcare + AI | White (#FFFFFF) + Orange (#FF6B00) + Dark Gray (#111827)  

---

## SLIDE 1 — PROJECT INTRODUCTION

**Title:** Explainable Multi-Model Machine Learning Framework for Early CKD Prediction  
**Subtitle:** "An ML-based system for predicting the likelihood of Chronic Kidney Disease from patient health parameters"  

### Project Overview:
- **Project Name:** CKD Predict  
- **Domain:** Healthcare Analytics + Machine Learning + Explainable AI (XAI)  
- **Technology Stack:** React 19 + Vite + FastAPI + Python 3.14 + scikit-learn + SHAP + SQLite  

### High-Level Workflow Diagram:
`Patient Data` ➔ `Data Preprocessing & Scaling` ➔ `Multi-Model Evaluation` ➔ `CKD Prediction` ➔ `Explainable Result (SHAP/LIME)`

> **Disclaimer:** Educational and research screening prototype — not a medical diagnosis tool.

---

## SLIDE 2 — PROBLEM & OBJECTIVE

**Title:** Problem & Objective  
**Subtitle:** Addressing early detection challenges in renal healthcare through machine learning decision support  

### Clinical Problem:
- Chronic Kidney Disease progresses gradually and subtle early symptoms make early detection difficult.
- Manual clinical evaluation across 24+ lab parameters is time-intensive for clinicians.
- Black-box ML models lack interpretability, causing clinician skepticism.

### Prototype Objective:
- Develop a machine learning prototype that accepts 24 patient clinical blood & urine parameters.
- Automate data scrubbing, median imputation, and StandardScaler normalization.
- Evaluate 8 machine learning algorithms using 5-Fold Stratified Cross-Validation.
- Automatically select the best-performing classifier model.
- Predict CKD / Not CKD risk level and model-estimated likelihood percentage.
- Explain key contributing clinical factors using SHAP and LIME Explainable AI.

### Pipeline Diagram:
`Patient Parameters` ➔ `Data Preprocessing` ➔ `8 ML Classifiers` ➔ `Best Model Selection` ➔ `CKD Prediction` ➔ `SHAP Explanation`

---

## SLIDE 3 — DATASET & PATIENT PARAMETERS

**Title:** Dataset & Patient Parameters  
**Subtitle:** Benchmark dataset statistics from the UCI Chronic Kidney Disease repository  

### Benchmark Dataset Statistics:
- **Total Records:** 400 Clinical Patient Instances  
- **Total Features:** 24 Clinical Parameters (14 Numerical, 10 Categorical)  
- **Target Distribution:** 250 CKD Instances (62.5%) | 150 Non-CKD Instances (37.5%)  

### 24 Clinical Input Categories:

1. **Patient Information & Demographics:**
   - Age (years), Blood Pressure (mmHg)
2. **Kidney & Blood Parameters:**
   - Specific Gravity (1.005–1.025), Albumin (0–5), Sugar (0–5)
   - Blood Glucose Random, Blood Urea, Serum Creatinine, Sodium, Potassium
   - Hemoglobin, Packed Cell Volume (PCV), White Blood Cell Count, Red Blood Cell Count
3. **Medical History & Symptoms:**
   - Hypertension (yes/no), Diabetes Mellitus (yes/no), Coronary Artery Disease (yes/no)
   - Appetite (good/poor), Pedal Edema (yes/no), Anemia (yes/no)

### Data Preparation Pipeline:
`Raw UCI Dataset` ➔ `Cleaning & Scrubbing` ➔ `Median/Mode Imputation` ➔ `One-Hot Encoding & Scaling` ➔ `ML Matrix`

---

## SLIDE 4 — PROPOSED ML METHODOLOGY

**Title:** Proposed Methodology  
**Subtitle:** Multi-stage pipeline strictly fitted on training folds to prevent data leakage  

### Flowchart:
`DATASET` ➔ `DATA PREPROCESSING` ➔ `FEATURE SELECTION` ➔ `CLASS BALANCING` ➔ `MODEL TRAINING` ➔ `MODEL COMPARISON` ➔ `BEST MODEL` ➔ `PREDICTION` ➔ `EXPLAINABLE AI`

### Component Status:

1. **Data Preprocessing [IMPLEMENTED]**:
   - `SimpleImputer` (median for numerical, mode for nominal)
   - `StandardScaler` zero-mean normalization
   - `OneHotEncoder` categorical expansion

2. **Feature Selection [IMPLEMENTED]**:
   - 6 Algorithms: Pearson Correlation, Chi-Square ($\chi^2$), Variance Threshold, RFE, LASSO $L_1$, Mutual Information Classifier

3. **Class Balancing [IMPLEMENTED]**:
   - **SMOTE** (Synthetic Minority Over-sampling Technique) strictly applied to training folds
   - **SMOTETomek** hybrid oversampling

4. **Validation Setup [IMPLEMENTED]**:
   - **Stratified 5-Fold Cross-Validation** (`random_state=42`)

5. **Evaluated Classifiers (8 Models) [IMPLEMENTED]**:
   - Gaussian Naive Bayes **(Best Model - 100% Accuracy)**
   - Random Forest Classifier
   - XGBoost Classifier
   - Logistic Regression
   - Decision Tree Classifier
   - Support Vector Machine (SVM)
   - K-Nearest Neighbors (KNN)
   - Neural Network (MLP Classifier)

---

## SLIDE 5 — PROTOTYPE WORKFLOW & UI MODULES

**Title:** Prototype Workflow & UI Modules  
**Subtitle:** Architecture of the live React 19 + Vite + FastAPI web prototype  

### Patient Workflow:
`OPEN SYSTEM` ➔ `DASHBOARD` ➔ `CKD PREDICTION FORM` ➔ `INPUT VALIDATION` ➔ `FASTAPI /PREDICT` ➔ `RESULT & SHAP WATERFALL` ➔ `RESEARCH REPORT`

### 4 Main Screen Modules [ALL IMPLEMENTED & LIVE]:

1. **Dashboard Page (`/`)**:
   - Live API Backend & Model Telemetry indicators.
   - Quick Action CTAs & recent SQLite prediction audit table.

2. **CKD Prediction Form (`/predict`)**:
   - 3 Parameter Sections (Demographics, Urine Analysis, Medical History).
   - High-Risk (Patient A) & Low-Risk (Patient B) sample preset buttons.

3. **Prediction Result Page (`/result`)**:
   - Risk Tier badge (`High Risk` vs `Low Risk`).
   - Model-estimated probability percentage score.
   - Dynamic SHAP feature attribution waterfall chart ("Why did the model make this prediction?").

4. **Explainable AI Explorer (`/explain`)**:
   - Global SHAP summary chart.
   - LIME local rule weights table detailing individual feature rules.

---

## SLIDE 6 — EXPECTED OUTPUT & FUTURE WORK

**Title:** Expected Output & Future Work  
**Subtitle:** Deliverables completed in prototype vs planned future enhancements  

### Implemented Deliverables Checklist:
- **✓ CKD / Not CKD Prediction:** Real-time prediction via FastAPI endpoint
- **✓ Model-Estimated Probability:** Exact confidence likelihood percentage
- **✓ Multi-Model Comparison:** Evaluates 8 classifiers with 5-Fold Stratified CV
- **✓ Best Model Identification:** Automatic champion model selection & persistence
- **✓ Confusion Matrix & Metrics:** Empirical Accuracy, Precision, Recall, F1-Score, ROC-AUC
- **✓ SHAP & LIME XAI:** Dynamic feature attribution waterfall & rule weights
- **✓ Prediction History:** Persistent SQLite audit log with deletion support
- **✓ Academic Research Report:** Auto-generates 15-section paper with PDF export

### Future Research Roadmap [PLANNED]:
- ⏳ Multi-center clinical dataset expansion
- ⏳ External prospective cohort validation
- ⏳ Deep Learning transformer integration for unstructured EHR notes
- ⏳ FHIR / HL7 secure healthcare system integration
- ⏳ Clinical prospective trial in outpatient settings

### Final Pipeline:
`Patient Data` ➔ `Preprocessing` ➔ `8 ML Models` ➔ `Best Model` ➔ `CKD Risk %` ➔ `SHAP Explanation` ➔ `15-Sec Paper`

**Bottom Line:** *CKD Predict — Machine Learning Based CKD Screening Prototype*  
> **Disclaimer:** Not a substitute for professional medical diagnosis.
