import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# Load data
df = pd.read_csv("homie/public/flatmate_matches.csv")

# Use the actual match percentage as the target
df["Match_Percentage"] = df["Match_Percentage"].fillna(0).astype(float)

# One-hot encode all categorical columns except the target
X = pd.get_dummies(df.drop("Match_Percentage", axis=1))
y = df["Match_Percentage"]

# Split into train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train regression model
reg = RandomForestRegressor(n_estimators=100, random_state=42)
reg.fit(X_train, y_train)

# Evaluate
y_pred = reg.predict(X_test)
print("MAE:", mean_absolute_error(y_test, y_pred))
print("R2:", r2_score(y_test, y_pred))

# Save model and columns
joblib.dump(reg, "flatmate_match_model.pkl")
joblib.dump(X.columns.tolist(), "flatmate_model_columns.pkl")
print("Regression model and columns saved!")