import os
import joblib
import pandas as pd
import json
from http.server import BaseHTTPRequestHandler

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
model_dir = os.path.join(project_root, 'model')

clf = joblib.load(os.path.join(model_dir, "flatmate_match_model.pkl"))
columns = joblib.load(os.path.join(model_dir, "flatmate_model_columns.pkl"))

def predict_matches(data):
    df = pd.DataFrame(data)
    df_encoded = pd.get_dummies(df)
    df_encoded = df_encoded.reindex(columns=columns, fill_value=0)
    percentages = clf.predict(df_encoded).round().astype(int).tolist()
    return percentages

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8'))
            percentages = predict_matches(body)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = json.dumps({"match_percentages": percentages})
            self.wfile.write(response.encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = json.dumps({"error": str(e)})
            self.wfile.write(error_response.encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()