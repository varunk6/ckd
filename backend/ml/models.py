from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.neural_network import MLPClassifier
from xgboost import XGBClassifier

def get_model_dictionary(random_state=42):
    """
    Returns configured model instances for all 8 classifiers.
    """
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=random_state),
        "Decision Tree": DecisionTreeClassifier(max_depth=6, random_state=random_state),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=8, random_state=random_state),
        "SVM": SVC(kernel='rbf', C=1.0, probability=True, random_state=random_state),
        "KNN": KNeighborsClassifier(n_neighbors=5),
        "Naive Bayes": GaussianNB(),
        "XGBoost": XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.05, eval_metric='logloss', random_state=random_state),
        "Neural Network": MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=500, random_state=random_state)
    }
    return models

def get_hyperparameter_grids():
    """
    Returns parameter grid dictionaries for optional GridSearchCV optimization.
    """
    return {
        "Logistic Regression": {
            "C": [0.1, 1.0, 10.0],
            "solver": ["liblinear", "lbfgs"]
        },
        "Decision Tree": {
            "max_depth": [4, 6, 8, 10],
            "min_samples_split": [2, 5, 10]
        },
        "Random Forest": {
            "n_estimators": [50, 100, 200],
            "max_depth": [5, 8, 12],
            "min_samples_split": [2, 5]
        },
        "SVM": {
            "C": [0.1, 1.0, 10.0],
            "kernel": ["linear", "rbf"]
        },
        "KNN": {
            "n_neighbors": [3, 5, 7, 9],
            "weights": ["uniform", "distance"]
        },
        "XGBoost": {
            "n_estimators": [50, 100],
            "max_depth": [3, 5, 7],
            "learning_rate": [0.01, 0.05, 0.1]
        }
    }
