import os
import pandas as pd
import numpy as np

NUMERIC_COLS = ['age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc']
CATEGORICAL_COLS = ['rbc', 'pc', 'pcc', 'ba', 'htn', 'dm', 'cad', 'appet', 'pe', 'ane']
TARGET_COL = 'classification'

def get_default_dataset_path():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_dir, 'data', 'kidney_disease.csv')

def load_and_clean_dataset(csv_path=None):
    if csv_path is None:
        csv_path = get_default_dataset_path()
        
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")

    # Read raw CSV
    df_raw = pd.read_csv(csv_path)

    # Clean column names
    df_raw.columns = df_raw.columns.str.strip().str.lower()
    
    # Drop id column if present
    if 'id' in df_raw.columns:
        df_raw = df_raw.drop(columns=['id'])

    df_clean = df_raw.copy()

    # Replace invalid / missing representation strings
    df_clean = df_clean.replace(r'^\s*\?\s*$', np.nan, regex=True)
    df_clean = df_clean.replace(r'^\s*$', np.nan, regex=True)

    # Clean string columns
    for col in df_clean.select_dtypes(include=['object']).columns:
        df_clean[col] = df_clean[col].astype(str).str.strip().str.lower()
        df_clean[col] = df_clean[col].replace(['nan', '?', 'none', 'null', ''], np.nan)

    # Standardize target 'classification'
    df_clean['classification'] = df_clean['classification'].replace({
        'ckd\t': 'ckd',
        'ckd': 'ckd',
        'notckd': 'notckd',
        'no': 'notckd'
    })
    
    # Clean specific categorical typos found in UCI dataset
    if 'dm' in df_clean.columns:
        df_clean['dm'] = df_clean['dm'].replace({'\tyes': 'yes', '\tno': 'no', ' yes': 'yes'})
    if 'cad' in df_clean.columns:
        df_clean['cad'] = df_clean['cad'].replace({'\tno': 'no'})

    # Convert numeric columns explicitly
    for col in NUMERIC_COLS:
        if col in df_clean.columns:
            # Handle hidden tab characters in pcv, wc, rc
            df_clean[col] = df_clean[col].astype(str).str.replace(r'\t', '', regex=True)
            df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')

    # Drop rows where target classification is NaN (if any)
    df_clean = df_clean.dropna(subset=['classification']).reset_index(drop=True)

    # Target binary encoding: ckd -> 1, notckd -> 0
    y = (df_clean['classification'] == 'ckd').astype(int)
    X = df_clean.drop(columns=['classification'])

    # Summary metadata for EDA
    missing_summary = X.isnull().sum().to_dict()
    missing_percentage = (X.isnull().sum() / len(X) * 100).round(2).to_dict()
    class_dist = {
        'ckd': int((y == 1).sum()),
        'notckd': int((y == 0).sum()),
        'total': len(y)
    }

    metadata = {
        'total_records': len(df_clean),
        'total_features': X.shape[1],
        'numeric_features': NUMERIC_COLS,
        'categorical_features': CATEGORICAL_COLS,
        'missing_summary': missing_summary,
        'missing_percentage': missing_percentage,
        'class_distribution': class_dist
    }

    return df_clean, X, y, metadata
