import joblib
import pandas as pd
import os

# Load models at module level
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
model_dir = os.path.join(project_root, 'model')

clf = joblib.load(os.path.join(model_dir, "flatmate_match_model.pkl"))
columns = joblib.load(os.path.join(model_dir, "flatmate_model_columns.pkl"))

def predict(data):
    """Predict match percentages for given data"""
    df = pd.DataFrame(data)
    df_encoded = pd.get_dummies(df)
    df_encoded = df_encoded.reindex(columns=columns, fill_value=0)
    percentages = clf.predict(df_encoded).round().astype(int).tolist()
    return percentages

# Vercel serverless function handler
def handler(request, response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    
    if request.method == 'OPTIONS':
        return response.status(200).end()
    
    if request.method == 'POST':
        try:
            body = request.get_json()
            percentages = predict(body)
            return response.json({"match_percentages": percentages})
        except Exception as e:
            return response.status(500).json({"error": str(e)})
    
    return response.status(405).json({"error": "Method not allowed"})