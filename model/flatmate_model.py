from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)


clf = joblib.load("flatmate_match_model.pkl")
columns = joblib.load("flatmate_model_columns.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    df = pd.DataFrame(data)
    df_encoded = pd.get_dummies(df)
    df_encoded = df_encoded.reindex(columns=columns, fill_value=0)
    percentages = clf.predict(df_encoded).round().astype(int).tolist()
    return jsonify({"match_percentages": percentages})

if __name__ == "__main__":
    app.run(port=5000)