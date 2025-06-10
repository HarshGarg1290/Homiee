"""
Enhanced ML Model with Better Feature Engineering
This version creates more realistic compatibility scores and better features
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os
import time
from datetime import datetime

def print_progress(message):
    """Print timestamped progress messages"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")

def calculate_advanced_compatibility(person1, person2):
    """Calculate compatibility with advanced logic"""
    compatibility_factors = []
    
    # 1. Location compatibility (40% weight)
    location_score = 0
    if person1['City'] == person2['City']:
        location_score += 30
        if person1['Locality'] == person2['Locality']:
            location_score += 10  # Extra for same locality
        else:
            location_score += 5   # Still good if same city
    
    # 2. Budget compatibility (25% weight)
    budget_score = 0
    budget_order = ['<15000', '15000-20000', '20000-25000', '25000-30000', '30000-40000', '40000+']
    try:
        b1_idx = budget_order.index(person1['Budget'])
        b2_idx = budget_order.index(person2['Budget'])
        budget_diff = abs(b1_idx - b2_idx)
        if budget_diff == 0:
            budget_score = 25
        elif budget_diff == 1:
            budget_score = 20
        elif budget_diff == 2:
            budget_score = 10
        else:
            budget_score = 0
    except:
        budget_score = 0
    
    # 3. Lifestyle compatibility (20% weight)
    lifestyle_score = 0
    
    # Eating preferences
    eating_compat = {
        'Vegetarian': {'Vegetarian': 10, 'Veg + Eggs': 5},
        'Vegan': {'Vegan': 10, 'Vegetarian': 8},
        'Non Vegetarian': {'Non Vegetarian': 10, 'Pescetarian': 8, 'Veg + Eggs': 6},
        'Pescetarian': {'Pescetarian': 10, 'Non Vegetarian': 8, 'Veg + Eggs': 7},
        'Veg + Eggs': {'Veg + Eggs': 10, 'Non Vegetarian': 6, 'Pescetarian': 7, 'Vegetarian': 5}
    }
    
    eating_score = eating_compat.get(person1['Eating Preference'], {}).get(person2['Eating Preference'], 0)
    lifestyle_score += eating_score
    
    # Smoke/Drink compatibility
    smoke_drink_compat = {
        'Neither': {'Neither': 10, 'Smoke': 2, 'Drink': 4, 'Both': 1},
        'Smoke': {'Smoke': 10, 'Both': 8, 'Neither': 2, 'Drink': 6},
        'Drink': {'Drink': 10, 'Both': 8, 'Neither': 4, 'Smoke': 6},
        'Both': {'Both': 10, 'Smoke': 8, 'Drink': 8, 'Neither': 1}
    }
    
    smoke_score = smoke_drink_compat.get(person1['Smoke/Drink'], {}).get(person2['Smoke/Drink'], 0)
    lifestyle_score += smoke_score
    
    # 4. Personality compatibility (15% weight)
    personality_score = 0
    
    # Cleanliness compatibility
    clean_order = ['Chaotic', 'Let the dust rot', 'Messy but not unhygienic', 'Organised', 'OCD']
    try:
        c1_idx = clean_order.index(person1['Cleanliness Spook'])
        c2_idx = clean_order.index(person2['Cleanliness Spook'])
        clean_diff = abs(c1_idx - c2_idx)
        if clean_diff == 0:
            personality_score += 8
        elif clean_diff == 1:
            personality_score += 6
        elif clean_diff == 2:
            personality_score += 3
        else:
            personality_score += 0
    except:
        personality_score += 0
    
    # Social preferences
    social_compat = {
        'House Party Scenes': {'House Party Scenes': 7, 'Clubbing/Going Out': 5, 'Based on my vibe': 4},
        'Clubbing/Going Out': {'Clubbing/Going Out': 7, 'House Party Scenes': 5, 'Based on my vibe': 4},
        'Chill stay at home': {'Chill stay at home': 7, 'Based on my vibe': 5},
        'Based on my vibe': {'Based on my vibe': 7, 'House Party Scenes': 4, 'Clubbing/Going Out': 4, 'Chill stay at home': 5}
    }
    
    social_score = social_compat.get(person1['Saturday Twin'], {}).get(person2['Saturday Twin'], 2)
    personality_score += social_score
    
    # Guest/Host balance (complementary is good)
    if person1['Guest/Host'] != person2['Guest/Host']:
        personality_score += 5  # Complementary is good
    else:
        personality_score += 3  # Same is okay
    
    # Calculate final score
    total_score = location_score + budget_score + lifestyle_score + personality_score
    
    # Add some controlled randomness (±5%)
    randomness = np.random.normal(0, total_score * 0.05)
    total_score += randomness
    
    # Ensure score is between 15-95 for more realistic range
    total_score = max(15, min(95, total_score))
    
    return total_score

def create_enhanced_training_data(df):
    """Create enhanced training data with better compatibility logic"""
    print_progress("🎯 Generating enhanced compatibility targets...")
    
    compatibility_data = []
    n_samples = 2000  # More samples for better training
    
    np.random.seed(42)
    
    for i in range(n_samples):
        # Create both random pairs and strategic pairs
        if i < n_samples * 0.7:  # 70% random pairs
            idx1, idx2 = np.random.choice(len(df), 2, replace=False)
        else:  # 30% strategic pairs (same city/locality for better matches)
            # Try to find pairs from same city for some high-scoring examples
            cities = df['City'].unique()
            city = np.random.choice(cities)
            city_candidates = df[df['City'] == city].index.tolist()
            if len(city_candidates) >= 2:
                idx1, idx2 = np.random.choice(city_candidates, 2, replace=False)
            else:
                idx1, idx2 = np.random.choice(len(df), 2, replace=False)
        
        person1, person2 = df.iloc[idx1], df.iloc[idx2]
        
        # Calculate compatibility score
        score = calculate_advanced_compatibility(person1, person2)
        
        # Create feature row
        compatibility_data.append({
            'User_City': person1['City'],
            'User_Locality': person1['Locality'],
            'User_Budget': person1['Budget'],
            'User_Eating': person1['Eating Preference'],
            'User_Cleanliness': person1['Cleanliness Spook'],
            'User_SmokeDrink': person1['Smoke/Drink'],
            'User_Saturday': person1['Saturday Twin'],
            'User_GuestHost': person1['Guest/Host'],
            'User_Gender': person1['Gender'],
            'Cand_City': person2['City'],
            'Cand_Locality': person2['Locality'],
            'Cand_Budget': person2['Budget'],
            'Cand_Eating': person2['Eating Preference'],
            'Cand_Cleanliness': person2['Cleanliness Spook'],
            'Cand_SmokeDrink': person2['Smoke/Drink'],
            'Cand_Saturday': person2['Saturday Twin'],
            'Cand_GuestHost': person2['Guest/Host'],
            'Cand_Gender': person2['Gender'],
            'compatibility_score': score
        })
        
        if (i + 1) % 500 == 0:
            print_progress(f"Generated {i + 1}/{n_samples} enhanced compatibility pairs")
    
    training_df = pd.DataFrame(compatibility_data)
    
    # Show score distribution
    scores = training_df['compatibility_score']
    print_progress(f"Score distribution: Min={scores.min():.1f}, Max={scores.max():.1f}, Mean={scores.mean():.1f}")
    
    return training_df

def create_advanced_features(df):
    """Create advanced features with better encoding"""
    print_progress("🔧 Creating advanced features...")
    
    feature_cols = [col for col in df.columns if col != 'compatibility_score']
    X = df[feature_cols].copy()
    y = df['compatibility_score'].copy()
    
    # One-hot encode all categorical features
    X_encoded = pd.get_dummies(X, columns=feature_cols)
    
    # Add interaction features for better predictions
    print_progress("🔗 Adding interaction features...")
    
    # City-City interaction (important for location matching)
    for city in ['Delhi', 'Mumbai', 'Bangalore', 'Gurgaon', 'Noida']:
        user_city_col = f'User_City_{city}'
        cand_city_col = f'Cand_City_{city}'
        if user_city_col in X_encoded.columns and cand_city_col in X_encoded.columns:
            X_encoded[f'SameCity_{city}'] = X_encoded[user_city_col] * X_encoded[cand_city_col]
    
    # Budget similarity feature
    budget_order = ['<15000', '15000-20000', '20000-25000', '25000-30000', '30000-40000', '40000+']
    for i, budget in enumerate(budget_order):
        user_budget_col = f'User_Budget_{budget}'
        cand_budget_col = f'Cand_Budget_{budget}'
        if user_budget_col in X_encoded.columns and cand_budget_col in X_encoded.columns:
            X_encoded[f'SameBudget_{budget}'] = X_encoded[user_budget_col] * X_encoded[cand_budget_col]
    
    print_progress(f"Final feature count: {len(X_encoded.columns)}")
    
    return X_encoded, y, list(X_encoded.columns)

def train_enhanced_models(X, y):
    """Train enhanced models with better hyperparameters"""
    print_progress("🤖 Training enhanced ML models...")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {}
    
    # 1. Enhanced Random Forest
    print_progress("Training Enhanced Random Forest...")
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        max_features='sqrt',
        random_state=42,
        n_jobs=-1
    )
    
    start_time = time.time()
    rf_model.fit(X_train, y_train)
    rf_time = time.time() - start_time
    
    rf_pred = rf_model.predict(X_test)
    rf_mse = mean_squared_error(y_test, rf_pred)
    rf_r2 = r2_score(y_test, rf_pred)
    
    models['enhanced_random_forest'] = {
        'model': rf_model,
        'mse': rf_mse,
        'r2': rf_r2,
        'training_time': rf_time,
        'predictions': rf_pred
    }
    
    print_progress(f"✅ Enhanced Random Forest trained in {rf_time:.2f}s - R²: {rf_r2:.3f}, MSE: {rf_mse:.3f}")
    
    # 2. Gradient Boosting (often better for tabular data)
    print_progress("Training Gradient Boosting...")
    gb_model = GradientBoostingRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=8,
        random_state=42
    )
    
    start_time = time.time()
    gb_model.fit(X_train, y_train)
    gb_time = time.time() - start_time
    
    gb_pred = gb_model.predict(X_test)
    gb_mse = mean_squared_error(y_test, gb_pred)
    gb_r2 = r2_score(y_test, gb_pred)
    
    models['gradient_boosting'] = {
        'model': gb_model,
        'mse': gb_mse,
        'r2': gb_r2,
        'training_time': gb_time,
        'predictions': gb_pred
    }
    
    print_progress(f"✅ Gradient Boosting trained in {gb_time:.2f}s - R²: {gb_r2:.3f}, MSE: {gb_mse:.3f}")
    
    return models, X_test, y_test

def save_best_model(models, feature_columns):
    """Save the best performing model"""
    print_progress("💾 Saving best model...")
    
    # Select best model based on R² score
    best_model_name = max(models.keys(), key=lambda k: models[k]['r2'])
    best_model = models[best_model_name]['model']
    best_r2 = models[best_model_name]['r2']
    
    print_progress(f"🏆 Best model: {best_model_name} (R²: {best_r2:.3f})")
    
    # Save model and columns
    joblib.dump(best_model, 'flatmate_match_model.pkl')
    joblib.dump(feature_columns, 'flatmate_model_columns.pkl')
    
    print_progress("✅ Enhanced model saved successfully!")
    
    return best_model_name, best_r2

def test_enhanced_predictions():
    """Test the enhanced model with realistic scenarios"""
    print_progress("🧪 Testing enhanced predictions...")
    
    model = joblib.load('flatmate_match_model.pkl')
    columns = joblib.load('flatmate_model_columns.pkl')
    
    test_cases = [
        {
            'name': 'Perfect Match (Same city, budget, preferences)',
            'data': {
                'User_City': 'Delhi', 'User_Locality': 'South Delhi', 'User_Budget': '25000-30000',
                'User_Eating': 'Vegetarian', 'User_Cleanliness': 'Organised', 'User_SmokeDrink': 'Neither',
                'User_Saturday': 'Chill stay at home', 'User_GuestHost': 'I like hosting', 'User_Gender': 'Male',
                'Cand_City': 'Delhi', 'Cand_Locality': 'South Delhi', 'Cand_Budget': '25000-30000',
                'Cand_Eating': 'Vegetarian', 'Cand_Cleanliness': 'Organised', 'Cand_SmokeDrink': 'Neither',
                'Cand_Saturday': 'Chill stay at home', 'Cand_GuestHost': 'I like being the guest', 'Cand_Gender': 'Female'
            }
        },
        {
            'name': 'Good Match (Same city, compatible preferences)',
            'data': {
                'User_City': 'Mumbai', 'User_Locality': 'Bandra', 'User_Budget': '30000-40000',
                'User_Eating': 'Non Vegetarian', 'User_Cleanliness': 'Organised', 'User_SmokeDrink': 'Drink',
                'User_Saturday': 'Clubbing/Going Out', 'User_GuestHost': 'I like being the guest', 'User_Gender': 'Female',
                'Cand_City': 'Mumbai', 'Cand_Locality': 'Andheri W', 'Cand_Budget': '30000-40000',
                'Cand_Eating': 'Pescetarian', 'Cand_Cleanliness': 'Messy but not unhygienic', 'Cand_SmokeDrink': 'Both',
                'Cand_Saturday': 'House Party Scenes', 'Cand_GuestHost': 'I like hosting', 'Cand_Gender': 'Male'
            }
        },
        {
            'name': 'Poor Match (Different cities, incompatible)',
            'data': {
                'User_City': 'Delhi', 'User_Locality': 'North Delhi', 'User_Budget': '<15000',
                'User_Eating': 'Vegan', 'User_Cleanliness': 'OCD', 'User_SmokeDrink': 'Neither',
                'User_Saturday': 'Chill stay at home', 'User_GuestHost': 'I like hosting', 'User_Gender': 'Male',
                'Cand_City': 'Bangalore', 'Cand_Locality': 'Whitefield', 'Cand_Budget': '40000+',
                'Cand_Eating': 'Non Vegetarian', 'Cand_Cleanliness': 'Chaotic', 'Cand_SmokeDrink': 'Both',
                'Cand_Saturday': 'Clubbing/Going Out', 'Cand_GuestHost': 'I like being the guest', 'Cand_Gender': 'Female'
            }
        }
    ]
    
    for test_case in test_cases:
        # Create feature vector
        features = pd.DataFrame([test_case['data']])
        features_encoded = pd.get_dummies(features)
        
        # Align with model columns
        aligned_features = pd.DataFrame(0, index=[0], columns=columns)
        for col in features_encoded.columns:
            if col in aligned_features.columns:
                aligned_features[col] = features_encoded[col].values[0]
        
        prediction = model.predict(aligned_features)[0]
        print_progress(f"{test_case['name']}: {prediction:.1f}% compatibility")
    
    print_progress("✅ Enhanced testing complete!")

def main():
    """Main enhanced training pipeline"""
    print_progress("🚀 Starting enhanced ML model training...")
    
    try:
        # Load dataset
        print_progress("📂 Loading dataset...")
        csv_path = '../public/fake_flatmate_dataset_600_with_gender.csv'
        
        if not os.path.exists(csv_path):
            print_progress("❌ Dataset not found!")
            return
        
        df = pd.read_csv(csv_path)
        print_progress(f"✅ Loaded {len(df)} records")
        
        # Create enhanced training data
        training_data = create_enhanced_training_data(df)
        
        # Create advanced features
        X, y, feature_columns = create_advanced_features(training_data)
        
        # Train enhanced models
        models, X_test, y_test = train_enhanced_models(X, y)
        
        # Save best model
        best_model_name, best_r2 = save_best_model(models, feature_columns)
        
        # Test enhanced predictions
        test_enhanced_predictions()
        
        print_progress("🎉 Enhanced model training completed!")
        print_progress(f"📊 Best model: {best_model_name} with R² score: {best_r2:.3f}")
        
        # Show improved prediction ranges
        best_predictions = models[best_model_name]['predictions']
        print_progress(f"📈 Prediction range: {best_predictions.min():.1f}% - {best_predictions.max():.1f}%")
        print_progress(f"📊 Average prediction: {best_predictions.mean():.1f}%")
        
    except Exception as e:
        print_progress(f"❌ Error during enhanced training: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
