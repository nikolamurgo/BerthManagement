import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
from sklearn.utils.class_weight import compute_class_weight
from datetime import datetime
import json
import matplotlib.pyplot as plt
import joblib

# === Prepare berth data ===
berth_data = [
    {
        "berth": "7",
        "length_m": 150,
        "depth_m": "10.10 - 11.60",
        "cargo": "Containers, Ro-Ro",
        "bollards_mt": "60 - 100",
        "berth_level_m": 2.88,
    },
    {
        "berth": "7a",
        "length_m": 200,
        "depth_m": "11.10 - 15.10",
        "cargo": "Containers",
        "bollards_mt": 100,
        "berth_level_m": 2.93,
    },
    {
        "berth": "7b",
        "length_m": 100,
        "depth_m": "14.70 - 15.10",
        "cargo": "Containers",
        "bollards_mt": 100,
        "berth_level_m": 2.93,
    },
    {
        "berth": "7c",
        "length_m": 146,
        "depth_m": "14.70 - 15.10",
        "cargo": "Containers",
        "bollards_mt": 150,
        "berth_level_m": 2.98,
    },
    {
        "berth": "7d",
        "length_m": 98,
        "depth_m": "14.80 - 15.10",
        "cargo": "Containers",
        "bollards_mt": "150",
        "berth_level_m": 2.98,
    },
    {
        "berth": "7d",
        "length_m": 98,
        "depth_m": "14.80 - 15.10",
        "cargo": "Containers",
        "bollards_mt": "200",
        "berth_level_m": 2.98,
    },
]

berths_df = pd.DataFrame(berth_data)

# Filter only rows with 'Containers' cargo
berths_df = berths_df[berths_df["cargo"].str.contains("Containers")].copy()


def parse_range(s):
    if isinstance(s, str) and "-" in s:
        parts = s.split("-")
        return float(parts[0].strip()), float(parts[1].strip())
    else:
        val = float(s)
        return val, val


# Parse depth and bollards into min and max columns
berths_df["depth_min"], berths_df["depth_max"] = zip(
    *berths_df["depth_m"].map(parse_range)
)
berths_df["bollards_min"], berths_df["bollards_max"] = zip(
    *berths_df["bollards_mt"].map(parse_range)
)

for col in [
    "length_m",
    "berth_level_m",
    "depth_min",
    "depth_max",
    "bollards_min",
    "bollards_max",
]:
    berths_df[col] = berths_df[col].astype(float)

berths_df.drop(columns=["depth_m", "bollards_mt", "cargo"], inplace=True)

# === Load new vessel data from JSON ===
with open("data.json", "r", encoding="utf-8") as f:
    vessels_data = json.load(f)["data"]

vessels_df = pd.DataFrame(vessels_data)


def convert_comma_number(x):
    if pd.isnull(x):
        return np.nan
    if isinstance(x, (float, int)):
        return float(x)
    return float(str(x).replace(",", ".").strip())


for col in ["Vessel Length", "Draft", "Cargo Weight", "Total Vessel Weight"]:
    vessels_df[col] = vessels_df[col].apply(convert_comma_number)


def parse_datetime(dt_str):
    try:
        return datetime.strptime(dt_str.strip(), "%d. %m. %Y %H:%M:%S")
    except Exception:
        return pd.NaT


vessels_df["arrival_dt"] = vessels_df["Arrival Date and Time ETA"].combine_first(
    vessels_df["Date and Time of Action"]
)
vessels_df["arrival_dt"] = vessels_df["arrival_dt"].apply(parse_datetime)

vessels_df["Arrival_Hour"] = vessels_df["arrival_dt"].dt.hour.fillna(0).astype(int)
vessels_df["Arrival_Day"] = vessels_df["arrival_dt"].dt.day.fillna(0).astype(int)

# Normalize berth labels to lowercase and strip spaces
vessels_df["Berth Code/Label"] = vessels_df["Berth Code/Label"].str.strip().str.lower()

# Prepare features and target
X = vessels_df[
    [
        "Vessel Length",
        "Draft",
        "Cargo Weight",
        "Total Vessel Weight",
        "Arrival_Hour",
        "Arrival_Day",
    ]
]
y = vessels_df["Berth Code/Label"]

# Split train-test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42
)

# Calculate class weights
class_weights = dict(
    zip(
        y_train.unique(),
        compute_class_weight("balanced", classes=y_train.unique(), y=y_train),
    )
)

# Preprocessing and pipeline
numerical_features = X.columns.tolist()
preprocessor = ColumnTransformer(
    transformers=[("num", StandardScaler(), numerical_features)]
)

model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "classifier",
            RandomForestClassifier(random_state=42, class_weight=class_weights),
        ),
    ]
)

param_grid = {
    "classifier__n_estimators": [
        100,
        300,
        500,
        800,
    ],  # More trees can improve performance (at cost of speed)
    "classifier__max_depth": [None, 10, 20, 30, 50],  # Add deeper trees
    "classifier__min_samples_split": [
        2,
        5,
        10,
    ],  # Test more values to avoid overfitting
    "classifier__min_samples_leaf": [
        1,
        2,
        4,
    ],  # Larger leaf size can reduce overfitting
    "classifier__max_features": [
        "auto",
        "sqrt",
        "log2",
        0.5,
    ],  # Try more options, including fractions of features
    "classifier__bootstrap": [True, False],  # Try with and without bootstrapping
    "classifier__criterion": ["gini", "entropy"],  # Different splitting criteria
}
grid_search = GridSearchCV(
    model, param_grid, cv=5, n_jobs=-1, verbose=2, scoring="accuracy"
)
grid_search.fit(X_train, y_train)

print("Best parameters:", grid_search.best_params_)
print(f"Best CV accuracy: {grid_search.best_score_:.3f}")

best_rf = grid_search.best_estimator_

# Evaluate on test set
y_pred = best_rf.predict(X_test)
test_acc = accuracy_score(y_test, y_pred)
print(f"Test accuracy: {test_acc:.3f}")

# Feature importance plot
rf_clf = best_rf.named_steps["classifier"]
importances = rf_clf.feature_importances_
indices = np.argsort(importances)[::-1]

plt.figure(figsize=(8, 5))
plt.title("Feature Importances")
plt.bar(range(len(importances)), importances[indices], align="center")
plt.xticks(
    range(len(importances)), [numerical_features[i] for i in indices], rotation=45
)
plt.tight_layout()
plt.show()

# Predict berth for a new vessel
new_vessel_data = {
    "Vessel Length": "145,00",
    "Draft": "11,00",
    "Cargo Weight": "7200",
    "Total Vessel Weight": "24000",
    "Arrival_Hour": 15,
    "Arrival_Day": 3,
}

new_vessel_df = pd.DataFrame(
    [
        {
            k: convert_comma_number(v)
            if k in ["Vessel Length", "Draft", "Cargo Weight", "Total Vessel Weight"]
            else v
            for k, v in new_vessel_data.items()
        }
    ]
)

predicted_berth = best_rf.predict(new_vessel_df)
print(f"Predicted berth for new vessel: {predicted_berth[0]}")

# === Save model ===
joblib.dump(best_rf, "model2_2.pkl")
print("Model saved as vessel_berth_classifier.pkl")
