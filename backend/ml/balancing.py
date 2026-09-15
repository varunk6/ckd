from imblearn.over_sampling import SMOTE
from imblearn.combine import SMOTETomek

def apply_class_balancing(X_train, y_train, method='smote', random_state=42):
    """
    Applies class balancing strictly to the training fold.
    Supported methods: 'none', 'smote', 'smotetomek'
    """
    method = (method or 'none').lower().strip()
    
    if method == 'none' or method == 'original':
        return X_train, y_train, "Original Class Distribution (No Balancing)"
    elif method == 'smote':
        smote = SMOTE(random_state=random_state)
        X_res, y_res = smote.fit_resample(X_train, y_train)
        return X_res, y_res, "SMOTE (Synthetic Minority Over-sampling Technique)"
    elif method == 'smotetomek':
        st = SMOTETomek(random_state=random_state)
        X_res, y_res = st.fit_resample(X_train, y_train)
        return X_res, y_res, "SMOTETomek (Hybrid SMOTE + Tomek Links)"
    else:
        return X_train, y_train, f"Unknown method '{method}', fallback to original."
