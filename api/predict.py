import os
import joblib
import pandas as pd
import json
from http.server import BaseHTTPRequestHandler

# Load model files once when the serverless function initializes
model_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'flatmate_match_model.pkl')
columns_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'flatmate_model_columns.pkl')

try:
    clf = joblib.load(model_path)
    columns = joblib.load(columns_path)
except Exception as e:
    print(f"Error loading model: {e}")
    clf = None
    columns = None

def predict_matches(data):
    """Predict flatmate compatibility matches"""
    if clf is None or columns is None:
        raise Exception("Model not loaded properly")
    
    df = pd.DataFrame(data)
    df_encoded = pd.get_dummies(df)
    df_encoded = df_encoded.reindex(columns=columns, fill_value=0)
    percentages = clf.predict(df_encoded).round().astype(int).tolist()
    return percentages

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8'))
            
            # Validate input
            if not isinstance(body, list):
                raise ValueError("Request body must be an array")
            
            # Get predictions
            percentages = predict_matches(body)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = json.dumps({"match_percentages": percentages})
            self.wfile.write(response.encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = json.dumps({
                "error": "Prediction failed", 
                "details": str(e)
            })
            self.wfile.write(error_response.encode('utf-8'))

    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
