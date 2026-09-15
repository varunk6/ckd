from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from dataset import NUMERIC_COLS, CATEGORICAL_COLS

def create_preprocessing_pipeline(numeric_cols=None, categorical_cols=None):
    if numeric_cols is None:
        numeric_cols = NUMERIC_COLS
    if categorical_cols is None:
        categorical_cols = CATEGORICAL_COLS

    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_cols),
            ('cat', categorical_transformer, categorical_cols)
        ]
    )

    return preprocessor

def get_transformed_feature_names(preprocessor, numeric_cols, categorical_cols):
    """
    Retrieves exact feature names after One-Hot Encoding and Scaling.
    """
    feature_names = list(numeric_cols)
    if 'cat' in preprocessor.named_transformers_:
        cat_encoder = preprocessor.named_transformers_['cat'].named_steps['encoder']
        encoded_cat_names = cat_encoder.get_feature_names_out(categorical_cols)
        feature_names.extend(list(encoded_cat_names))
    return feature_names
