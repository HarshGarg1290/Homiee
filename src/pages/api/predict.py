import joblib
import pandas as pd
import os
import json

# Get the project root (homie folder)
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
model_dir = os.path.join(project_root, 'model')

# Load models
clf = joblib.load(os.path.join(model_dir, "flatmate_match_model.pkl"))
columns = joblib.load(os.path.join(model_dir, "flatmate_model_columns.pkl"))

def handler(request, response):
    # Set CORS headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    
    if request.method == 'OPTIONS':
        return response.status(200).end()
    
    if request.method == 'POST':
        try:
            # Parse JSON body
            body = request.get_json()
            df = pd.DataFrame(body)
            df_encoded = pd.get_dummies(df)
            df_encoded = df_encoded.reindex(columns=columns, fill_value=0)
            percentages = clf.predict(df_encoded).round().astype(int).tolist()
            
            return response.json({
                "match_percentages": percentages
            })
        except Exception as e:
            return response.status(500).json({
                "error": str(e)
            })
    
    return response.status(405).json({
        "error": "Method not allowed"
    })