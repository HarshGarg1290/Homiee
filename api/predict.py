import os
import joblib
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
    """Predict flatmate compatibility matches without pandas"""
    if clf is None or columns is None:
        raise Exception("Model not loaded properly")
    
    # Convert data to feature matrix manually (avoiding pandas)
    import numpy as np
    
    # Create feature matrix
    feature_matrix = []
    for row in data:
        # Create one-hot encoded features
        feature_row = [0] * len(columns)
        
        # Fill in the features based on the column names
        for key, value in row.items():
            # Look for exact matches and categorical combinations
            for i, col in enumerate(columns):
                if f"{key}_{value}" == col or key == col:
                    feature_row[i] = 1
        
        feature_matrix.append(feature_row)
    
    # Convert to numpy array
    X = np.array(feature_matrix)
    
    # Get predictions
    percentages = clf.predict(X).round().astype(int).tolist()
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
