#!/usr/bin/env python3
"""
Generate a compatible flatmate matching model for the current scikit-learn version
This script creates a model that's compatible with scikit-learn 1.4.0
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

def create_compatible_model():
    """Create a model compatible with current scikit-learn version"""
    print("🤖 Creating compatible ML model...")
    
    # Generate synthetic training data that matches our feature structure
    np.random.seed(42)
    n_samples = 1000
    
    # Define the feature columns that our app expects
    feature_columns = [
        # User features
        'User_City_Mumbai', 'User_City_Delhi', 'User_City_Bangalore', 'User_City_Noida', 'User_City_Gurgaon',
        'User_Gender_Male', 'User_Gender_Female',
        'User_Budget_<15000', 'User_Budget_15000-20000', 'User_Budget_20000-25000', 'User_Budget_25000-30000', 'User_Budget_30000-40000', 'User_Budget_40000+',
        'User_Eating_Vegetarian', 'User_Eating_Non Vegetarian', 'User_Eating_Veg + Eggs', 'User_Eating_Pescetarian', 'User_Eating_Vegan',
        'User_Cleanliness_Organised', 'User_Cleanliness_Messy but not unhygienic', 'User_Cleanliness_Chaotic', 'User_Cleanliness_OCD',
        'User_SmokeDrink_Neither', 'User_SmokeDrink_Drink', 'User_SmokeDrink_Both', 'User_SmokeDrink_Smoke',
        'User_Saturday_Clubbing/Going Out', 'User_Saturday_House Party Scenes', 'User_Saturday_Chill stay at home', 'User_Saturday_Based on my vibe',
        'User_GuestHost_I like hosting', 'User_GuestHost_I like being the guest',
        
        # Candidate features  
        'Cand_City_Mumbai', 'Cand_City_Delhi', 'Cand_City_Bangalore', 'Cand_City_Noida', 'Cand_City_Gurgaon',
        'Cand_Gender_Male', 'Cand_Gender_Female',
        'Cand_Budget_<15000', 'Cand_Budget_15000-20000', 'Cand_Budget_20000-25000', 'Cand_Budget_25000-30000', 'Cand_Budget_30000-40000', 'Cand_Budget_40000+',
        'Cand_Eating_Vegetarian', 'Cand_Eating_Non Vegetarian', 'Cand_Eating_Veg + Eggs', 'Cand_Eating_Pescetarian', 'Cand_Eating_Vegan',
        'Cand_Cleanliness_Organised', 'Cand_Cleanliness_Messy but not unhygienic', 'Cand_Cleanliness_Chaotic', 'Cand_Cleanliness_OCD',
        'Cand_SmokeDrink_Neither', 'Cand_SmokeDrink_Drink', 'Cand_SmokeDrink_Both', 'Cand_SmokeDrink_Smoke',
        'Cand_Saturday_Clubbing/Going Out', 'Cand_Saturday_House Party Scenes', 'Cand_Saturday_Chill stay at home', 'Cand_Saturday_Based on my vibe',
        'Cand_GuestHost_I like hosting', 'Cand_GuestHost_I like being the guest',
        
        # Interaction features
        'SameCity', 'SameGender', 'SameBudget', 'SameEating', 'SameCleanliness', 'SameSmokeDrink', 'SameSaturday', 'SameGuestHost'
    ]
    
    # Generate synthetic data
    X = np.random.randint(0, 2, size=(n_samples, len(feature_columns)))
    
    # Create more realistic compatibility scores based on feature matches
    y = []
    for row in X:
        base_score = 40
        
        # Add bonus for matching features
        same_city = row[feature_columns.index('SameCity')] if 'SameCity' in feature_columns else 0
        same_eating = row[feature_columns.index('SameEating')] if 'SameEating' in feature_columns else 0
        same_cleanliness = row[feature_columns.index('SameCleanliness')] if 'SameCleanliness' in feature_columns else 0
        
        if same_city:
            base_score += 25
        if same_eating:
            base_score += 15
        if same_cleanliness:
            base_score += 10
        
        # Add some noise
        noise = np.random.normal(0, 5)
        final_score = max(25, min(95, base_score + noise))
        y.append(final_score)
    
    y = np.array(y)
    
    # Convert to DataFrame for easier handling
    df = pd.DataFrame(X, columns=feature_columns)
    
    print(f"📊 Generated {len(df)} training samples with {len(feature_columns)} features")
    
    # Train the model
    X_train, X_test, y_train, y_test = train_test_split(df, y, test_size=0.2, random_state=42)
    
    # Use GradientBoostingRegressor with conservative parameters for stability
    model = GradientBoostingRegressor(
        n_estimators=50,  # Fewer estimators for faster training and compatibility
        max_depth=3,      # Shallow trees for stability
        learning_rate=0.1,
        random_state=42
    )
    
    print("🔧 Training model...")
    model.fit(X_train, y_train)
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"✅ Model trained successfully!")
    print(f"📈 Training R² score: {train_score:.3f}")
    print(f"📈 Test R² score: {test_score:.3f}")
    
    # Save the model and feature columns
    model_path = os.path.join(os.path.dirname(__file__), 'flatmate_match_model.pkl')
    columns_path = os.path.join(os.path.dirname(__file__), 'flatmate_model_columns.pkl')
    
    joblib.dump(model, model_path)
    joblib.dump(feature_columns, columns_path)
    
    print(f"💾 Model saved to: {model_path}")
    print(f"💾 Columns saved to: {columns_path}")
    
    # Test loading
    try:
        loaded_model = joblib.load(model_path)
        loaded_columns = joblib.load(columns_path)
        
        # Test prediction
        test_input = np.zeros((1, len(feature_columns)))
        test_input[0, feature_columns.index('SameCity')] = 1
        test_prediction = loaded_model.predict(test_input)[0]
        
        print(f"🧪 Test prediction: {test_prediction:.1f}% compatibility")
        print("✅ Model loading and prediction test successful!")
        
        return True
    except Exception as e:
        print(f"❌ Error testing model: {e}")
        return False

if __name__ == "__main__":
    create_compatible_model()
