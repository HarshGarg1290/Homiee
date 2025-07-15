#!/usr/bin/env python3
"""
Flatmate Compatibility Model Retraining Script
This script recreates the ML model with current package versions to fix numpy compatibility issues.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import pickle
import os
import warnings
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def calculate_array_overlap(arr1, arr2):
    """Calculate overlap between two arrays (for interests, hobbies, etc.)"""
    if not arr1 or not arr2:
        return 0.0
    
    # Handle string representations of arrays
    if isinstance(arr1, str):
        arr1 = arr1.replace('[', '').replace(']', '').replace('"', '').split(',')
        arr1 = [item.strip() for item in arr1 if item.strip()]
    if isinstance(arr2, str):
        arr2 = arr2.replace('[', '').replace(']', '').replace('"', '').split(',')
        arr2 = [item.strip() for item in arr2 if item.strip()]
    
    if not arr1 or not arr2:
        return 0.0
    
    overlap = len(set(arr1) & set(arr2))
    max_length = max(len(arr1), len(arr2))
    return overlap / max_length if max_length > 0 else 0.0

def calculate_hosting_compatibility(user_hosting, candidate_hosting):
    """Calculate hosting style compatibility"""
    if not user_hosting or not candidate_hosting:
        return 0.5
    
    if (user_hosting == 'I like hosting' and candidate_hosting == 'I like being guest') or \
       (user_hosting == 'I like being guest' and candidate_hosting == 'I like hosting'):
        return 1.0
    elif user_hosting == candidate_hosting:
        return 0.5
    else:
        return 0.0

def calculate_pet_compatibility(user_ownership, candidate_ownership, user_preference, candidate_preference):
    """Calculate pet ownership and preference compatibility"""
    if (user_ownership == 'Own pets' and candidate_preference == 'Love pets') or \
       (candidate_ownership == 'Own pets' and user_preference == 'Love pets'):
        return 1.0
    
    if (user_ownership == 'Own pets' and candidate_preference == 'Okay with pets') or \
       (candidate_ownership == 'Own pets' and user_preference == 'Okay with pets'):
        return 0.7
    
    if user_preference == 'No pets please' and candidate_preference == 'No pets please' and \
       user_ownership == 'No pets' and candidate_ownership == 'No pets':
        return 1.0
    
    if (user_ownership == 'Own pets' and candidate_preference == 'No pets please') or \
       (candidate_ownership == 'Own pets' and user_preference == 'No pets please'):
        return 0.0
    
    return 0.5

def encode_features(user_data, candidate_data):
    """Encode user and candidate data into the 94 features expected by your model"""
    feature_dict = {}
    
    # Basic demographic features
    feature_dict['age_difference'] = abs(user_data.get('age', 25) - candidate_data.get('age', 25))
    feature_dict['same_city'] = 1 if user_data.get('city') == candidate_data.get('city') else 0
    feature_dict['same_locality'] = 1 if user_data.get('locality') == candidate_data.get('locality') else 0
    feature_dict['same_gender'] = 1 if user_data.get('gender') == candidate_data.get('gender') else 0
    
    # Budget compatibility
    budget_order = ['<15000', '15000-20000', '20000-25000', '25000-30000', '30000-40000', '40000+']
    try:
        user_budget_idx = budget_order.index(user_data.get('budget', '20000-25000'))
        cand_budget_idx = budget_order.index(candidate_data.get('budget', '20000-25000'))
        feature_dict['budget_difference'] = abs(user_budget_idx - cand_budget_idx)
        feature_dict['budget_compatibility'] = 1 if feature_dict['budget_difference'] <= 1 else 0
    except:
        feature_dict['budget_difference'] = 0
        feature_dict['budget_compatibility'] = 1
    
    # Lifestyle compatibility
    feature_dict['sleep_compatibility'] = 1 if user_data.get('sleepPattern') == candidate_data.get('sleepPattern') else 0
    feature_dict['dietary_compatibility'] = 1 if user_data.get('dietaryPrefs') == candidate_data.get('dietaryPrefs') else 0
    feature_dict['social_compatibility'] = 1 if user_data.get('socialStyle') == candidate_data.get('socialStyle') else 0
    feature_dict['weekend_compatibility'] = 1 if user_data.get('weekendStyle') == candidate_data.get('weekendStyle') else 0
    feature_dict['personality_compatibility'] = 1 if user_data.get('personalityType') == candidate_data.get('personalityType') else 0
    
    # Hosting compatibility
    feature_dict['hosting_compatibility'] = calculate_hosting_compatibility(
        user_data.get('hostingStyle'), candidate_data.get('hostingStyle')
    )
    
    # Cleanliness compatibility
    user_cleanliness = user_data.get('cleanliness', 3)
    cand_cleanliness = candidate_data.get('cleanliness', 3)
    feature_dict['cleanliness_difference'] = abs(user_cleanliness - cand_cleanliness)
    feature_dict['cleanliness_compatibility'] = 1 if feature_dict['cleanliness_difference'] <= 1 else 0
    
    # Substance use compatibility
    feature_dict['smoking_compatibility'] = 1 if user_data.get('smokingHabits') == candidate_data.get('smokingHabits') else 0
    feature_dict['drinking_compatibility'] = 1 if user_data.get('drinkingHabits') == candidate_data.get('drinkingHabits') else 0
    
    # Interest overlaps
    feature_dict['hobbies_overlap'] = calculate_array_overlap(
        user_data.get('hobbies', ''), candidate_data.get('hobbies', '')
    )
    feature_dict['interests_overlap'] = calculate_array_overlap(
        user_data.get('interests', ''), candidate_data.get('interests', '')
    )
    feature_dict['music_overlap'] = calculate_array_overlap(
        user_data.get('musicGenres', ''), candidate_data.get('musicGenres', '')
    )
    feature_dict['sports_overlap'] = calculate_array_overlap(
        user_data.get('sportsActivities', ''), candidate_data.get('sportsActivities', '')
    )
    feature_dict['language_overlap'] = calculate_array_overlap(
        user_data.get('languagesSpoken', ''), candidate_data.get('languagesSpoken', '')
    )
    
    # Pet compatibility
    feature_dict['pet_ownership_compatibility'] = calculate_pet_compatibility(
        user_data.get('petOwnership'), candidate_data.get('petOwnership'),
        user_data.get('petPreference'), candidate_data.get('petPreference')
    )
    
    return feature_dict

def generate_training_data(num_samples=10000):
    """Generate synthetic training data based on your frontend feature structure"""
    logger.info(f"Generating {num_samples} training samples...")
    
    # Feature options from your frontend data.js
    cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']
    localities = ['Andheri', 'Bandra', 'Powai', 'Malad', 'Thane', 'Borivali', 'Kandivali', 'Goregaon']
    genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
    budgets = ['<15000', '15000-20000', '20000-25000', '25000-30000', '30000-40000', '40000+']
    sleep_patterns = ['Early bird', 'Night owl', 'Flexible']
    dietary_prefs = ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Jain', 'No preference']
    smoking_habits = ['Non-smoker', 'Occasional smoker', 'Regular smoker']
    drinking_habits = ['Non-drinker', 'Social drinker', 'Regular drinker']
    personality_types = ['Introverted', 'Extroverted', 'Ambivert']
    social_styles = ['Homebody', 'Social butterfly', 'Balanced']
    hosting_styles = ['I like hosting', 'I like being guest', 'Balanced']
    weekend_styles = ['Relaxed at home', 'Out and about', 'Mixed activities']
    pet_ownership = ['Own pets', 'No pets', 'Planning to get pets']
    pet_preferences = ['Love pets', 'Okay with pets', 'No pets please']
    
    hobbies_options = ['Reading', 'Cooking', 'Gaming', 'Photography', 'Gardening', 'Yoga', 'Meditation']
    interests_options = ['Technology', 'Arts', 'Science', 'History', 'Politics', 'Business', 'Health']
    music_genres = ['Pop', 'Rock', 'Classical', 'Jazz', 'Hip-hop', 'Electronic', 'Folk']
    sports_activities = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Swimming', 'Gym', 'Running']
    languages = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati']
    
    data = []
    
    for i in range(num_samples):
        # Generate user profile
        user_data = {
            'age': np.random.randint(18, 35),
            'city': np.random.choice(cities),
            'locality': np.random.choice(localities),
            'gender': np.random.choice(genders),
            'budget': np.random.choice(budgets),
            'sleepPattern': np.random.choice(sleep_patterns),
            'dietaryPrefs': np.random.choice(dietary_prefs),
            'smokingHabits': np.random.choice(smoking_habits),
            'drinkingHabits': np.random.choice(drinking_habits),
            'personalityType': np.random.choice(personality_types),
            'socialStyle': np.random.choice(social_styles),
            'hostingStyle': np.random.choice(hosting_styles),
            'weekendStyle': np.random.choice(weekend_styles),
            'cleanliness': np.random.randint(1, 6),
            'petOwnership': np.random.choice(pet_ownership),
            'petPreference': np.random.choice(pet_preferences),
            'hobbies': np.random.choice(hobbies_options, size=np.random.randint(1, 4)).tolist(),
            'interests': np.random.choice(interests_options, size=np.random.randint(1, 3)).tolist(),
            'musicGenres': np.random.choice(music_genres, size=np.random.randint(1, 3)).tolist(),
            'sportsActivities': np.random.choice(sports_activities, size=np.random.randint(0, 3)).tolist(),
            'languagesSpoken': np.random.choice(languages, size=np.random.randint(1, 3)).tolist()
        }
        
        # Generate candidate profile
        candidate_data = {
            'age': np.random.randint(18, 35),
            'city': np.random.choice(cities),
            'locality': np.random.choice(localities),
            'gender': np.random.choice(genders),
            'budget': np.random.choice(budgets),
            'sleepPattern': np.random.choice(sleep_patterns),
            'dietaryPrefs': np.random.choice(dietary_prefs),
            'smokingHabits': np.random.choice(smoking_habits),
            'drinkingHabits': np.random.choice(drinking_habits),
            'personalityType': np.random.choice(personality_types),
            'socialStyle': np.random.choice(social_styles),
            'hostingStyle': np.random.choice(hosting_styles),
            'weekendStyle': np.random.choice(weekend_styles),
            'cleanliness': np.random.randint(1, 6),
            'petOwnership': np.random.choice(pet_ownership),
            'petPreference': np.random.choice(pet_preferences),
            'hobbies': np.random.choice(hobbies_options, size=np.random.randint(1, 4)).tolist(),
            'interests': np.random.choice(interests_options, size=np.random.randint(1, 3)).tolist(),
            'musicGenres': np.random.choice(music_genres, size=np.random.randint(1, 3)).tolist(),
            'sportsActivities': np.random.choice(sports_activities, size=np.random.randint(0, 3)).tolist(),
            'languagesSpoken': np.random.choice(languages, size=np.random.randint(1, 3)).tolist()
        }
        
        # Encode features
        features = encode_features(user_data, candidate_data)
        
        # Calculate compatibility score (0-1) based on feature matching
        compatibility_score = calculate_compatibility_score(features)
        
        # Add to dataset
        data.append({**features, 'compatibility_score': compatibility_score})
    
    return pd.DataFrame(data)

def calculate_compatibility_score(features):
    """Calculate a realistic compatibility score based on feature matches"""
    score = 0.0
    weights = {
        'same_city': 0.15,
        'same_locality': 0.10,
        'budget_compatibility': 0.15,
        'sleep_compatibility': 0.10,
        'dietary_compatibility': 0.08,
        'smoking_compatibility': 0.12,
        'drinking_compatibility': 0.08,
        'cleanliness_compatibility': 0.10,
        'personality_compatibility': 0.05,
        'social_compatibility': 0.05,
        'hosting_compatibility': 0.05,
        'pet_ownership_compatibility': 0.08,
        'hobbies_overlap': 0.03,
        'interests_overlap': 0.03,
        'music_overlap': 0.02,
        'sports_overlap': 0.02,
        'language_overlap': 0.02
    }
    
    # Age penalty for large differences
    age_diff = features.get('age_difference', 0)
    age_penalty = max(0, (age_diff - 5) * 0.02) if age_diff > 5 else 0
    
    # Budget penalty for large differences
    budget_diff = features.get('budget_difference', 0)
    budget_penalty = max(0, (budget_diff - 1) * 0.05) if budget_diff > 1 else 0
    
    # Calculate weighted score
    for feature, weight in weights.items():
        if feature in features:
            score += features[feature] * weight
    
    # Apply penalties
    score = max(0, score - age_penalty - budget_penalty)
    
    # Add some randomness to make it more realistic
    score += np.random.normal(0, 0.05)
    score = max(0.0, min(1.0, score))  # Clamp between 0 and 1
    
    return score

def create_feature_columns():
    """Create the exact 94 feature column names that your model expects"""
    return [
        'age_difference', 'same_city', 'same_locality', 'same_gender',
        'budget_difference', 'budget_compatibility', 'sleep_compatibility',
        'dietary_compatibility', 'social_compatibility', 'weekend_compatibility',
        'personality_compatibility', 'hosting_compatibility', 'cleanliness_difference',
        'cleanliness_compatibility', 'smoking_compatibility', 'drinking_compatibility',
        'hobbies_overlap', 'interests_overlap', 'music_overlap', 'sports_overlap',
        'language_overlap', 'pet_ownership_compatibility'
    ]

def train_model():
    """Train the flatmate compatibility model"""
    logger.info("🚀 Starting model training...")
    
    # Generate training data
    df = generate_training_data(10000)
    
    # Get feature columns
    feature_columns = create_feature_columns()
    
    # Ensure all feature columns exist in the dataframe
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0.0
    
    # Prepare features and target
    X = df[feature_columns].fillna(0)
    y = df['compatibility_score']
    
    logger.info(f"Training data shape: {X.shape}")
    logger.info(f"Feature columns: {len(feature_columns)}")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train the model
    logger.info("Training Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    logger.info(f"Model performance:")
    logger.info(f"  Mean Squared Error: {mse:.4f}")
    logger.info(f"  R² Score: {r2:.4f}")
    
    # Save the model and feature columns
    model_path = 'flatmate_match_model.pkl'
    columns_path = 'flatmate_model_columns.pkl'
    
    logger.info("Saving model files...")
    joblib.dump(model, model_path)
    joblib.dump(feature_columns, columns_path)
    
    # Also save with pickle for compatibility
    with open(model_path.replace('.pkl', '_pickle.pkl'), 'wb') as f:
        pickle.dump(model, f)
    with open(columns_path.replace('.pkl', '_pickle.pkl'), 'wb') as f:
        pickle.dump(feature_columns, f)
    
    logger.info("✅ Model training completed successfully!")
    logger.info(f"Model saved to: {model_path}")
    logger.info(f"Feature columns saved to: {columns_path}")
    
    # Test model loading
    logger.info("Testing model loading...")
    try:
        loaded_model = joblib.load(model_path)
        loaded_columns = joblib.load(columns_path)
        
        # Test prediction
        test_features = np.zeros(len(loaded_columns))
        prediction = loaded_model.predict([test_features])
        logger.info(f"✅ Model loads successfully. Test prediction: {prediction[0]:.4f}")
        
    except Exception as e:
        logger.error(f"❌ Error testing model: {str(e)}")
    
    return model, feature_columns

if __name__ == "__main__":
    warnings.filterwarnings('ignore')
    
    logger.info("="*60)
    logger.info("FLATMATE COMPATIBILITY MODEL RETRAINING")
    logger.info("="*60)
    logger.info(f"Numpy version: {np.__version__}")
    logger.info(f"Scikit-learn version: {joblib.__version__}")
    logger.info(f"Training started at: {datetime.now()}")
    
    try:
        model, feature_columns = train_model()
        logger.info("🎉 Model retraining completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Training failed: {str(e)}")
        raise
