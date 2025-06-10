import os
import joblib
import json
import numpy as np
from http.server import BaseHTTPRequestHandler

# Load model files once when the serverless function initializes
model_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'flatmate_match_model.pkl')
columns_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'flatmate_model_columns.pkl')

try:
    clf = joblib.load(model_path)
    columns = joblib.load(columns_path)
    print(f"Model loaded successfully. Features: {len(columns)}")
except Exception as e:
    print(f"Error loading model: {e}")
    clf = None
    columns = None

def create_feature_vector(data_row, feature_columns):
    """Create feature vector without pandas"""
    feature_vector = [0] * len(feature_columns)
    
    # Map data_row keys to feature columns
    for key, value in data_row.items():
        # Handle categorical features (one-hot encoded)
        feature_name = f"{key}_{value}"
        if feature_name in feature_columns:
            idx = feature_columns.index(feature_name)
            feature_vector[idx] = 1
        # Handle direct numeric features
        elif key in feature_columns:
            idx = feature_columns.index(key)
            try:
                feature_vector[idx] = float(value)
            except:
                feature_vector[idx] = 1
    
    return feature_vector

def predict_matches(data):
    """Predict flatmate compatibility matches using the trained model"""
    if clf is None or columns is None:
        raise Exception("Model not loaded properly")
    
    # Convert columns to list for easier indexing
    feature_columns = list(columns)
    
    # Create feature matrix
    feature_matrix = []
    for data_row in data:
        feature_vector = create_feature_vector(data_row, feature_columns)
        feature_matrix.append(feature_vector)
    
    # Convert to numpy array
    X = np.array(feature_matrix)
    
    # Get predictions from your trained model
    predictions = clf.predict(X)
    
    # Convert to percentages and ensure they're in reasonable range
    percentages = []
    for pred in predictions:
        # Ensure prediction is between 1-100
        percentage = max(1, min(100, int(round(pred))))
        percentages.append(percentage)
    
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
