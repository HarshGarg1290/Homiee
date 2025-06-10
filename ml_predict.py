import sys
import json
import os
import joblib
import pandas as pd

def load_model():
    """Load the trained model and columns"""
    try:
        model_path = os.path.join('model', 'flatmate_match_model.pkl')
        columns_path = os.path.join('model', 'flatmate_model_columns.pkl')
        
        clf = joblib.load(model_path)
        columns = joblib.load(columns_path)
        
        return clf, columns
    except Exception as e:
        print(f"Error loading model: {e}", file=sys.stderr)
        return None, None

def predict_matches(data, clf, columns):
    """Predict flatmate compatibility matches"""
    try:
        df = pd.DataFrame(data)
        df_encoded = pd.get_dummies(df)
        df_encoded = df_encoded.reindex(columns=columns, fill_value=0)
        percentages = clf.predict(df_encoded).round().astype(int).tolist()
        return percentages
    except Exception as e:
        print(f"Error in prediction: {e}", file=sys.stderr)
        return None

def main():
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        pairs = json.loads(input_data)
        
        # Load model
        clf, columns = load_model()
        if clf is None or columns is None:
            print("Failed to load model", file=sys.stderr)
            sys.exit(1)
        
        # Get predictions
        predictions = predict_matches(pairs, clf, columns)
        if predictions is None:
            print("Failed to generate predictions", file=sys.stderr)
            sys.exit(1)
        
        # Output results
        result = {"match_percentages": predictions}
        print(json.dumps(result))
        
    except Exception as e:
        print(f"Script error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
