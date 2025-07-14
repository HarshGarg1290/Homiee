"""
Enhanced Flask API for New Optimized Flatmate Matching ML Model
Uses the new model trained on optimized registration fields directly
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "enhanced-ml-service"}), 200

# Global variables for model and columns
model = None
model_columns = None

def load_enhanced_model():
    """Load the enhanced trained model and feature columns"""
    global model, model_columns
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'flatmate_match_model.pkl')
        columns_path = os.path.join(os.path.dirname(__file__), 'flatmate_model_columns.pkl')
        
  
        import warnings
        warnings.filterwarnings('ignore', category=UserWarning)
        
        model = joblib.load(model_path)
        model_columns = joblib.load(columns_path)
        logger.info(f"✅ Enhanced model loaded successfully with {len(model_columns)} features")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error loading enhanced model: {str(e)}")
        return create_fallback_model()

def create_fallback_model():
    """Create a simple fallback model for the enhanced features"""
    global model, model_columns
    try:
        logger.info("🔧 Creating enhanced fallback model...")
        
        class EnhancedFallbackModel:
            def predict(self, X):
                """Enhanced fallback prediction based on feature analysis"""
                predictions = []
                
                for features in X:
                    score = 50  # Base compatibility
                    
                    # Look for key compatibility indicators in feature names
                    feature_dict = dict(zip(model_columns, features))
                    
                    # Location compatibility (very important)
                    if feature_dict.get('same_city', 0) == 1:
                        score += 15
                    if feature_dict.get('same_locality', 0) == 1:
                        score += 10
                    
                    # Budget compatibility
                    if feature_dict.get('budget_compatibility', 0) == 1:
                        score += 10
                    
                    # Lifestyle compatibility bonuses
                    score += feature_dict.get('sleep_compatibility', 0) * 8
                    score += feature_dict.get('dietary_compatibility', 0) * 8
                    score += feature_dict.get('social_compatibility', 0) * 6
                    score += feature_dict.get('cleanliness_compatibility', 0) * 8
                    
                    # Interest overlaps
                    score += feature_dict.get('hobbies_overlap', 0) * 10
                    score += feature_dict.get('interests_overlap', 0) * 8
                    score += feature_dict.get('music_overlap', 0) * 5
                    
                    # Pet compatibility
                    score += feature_dict.get('pet_ownership_compatibility', 0) * 6
                    
                    # Add some realistic variance
                    import random
                    score += random.uniform(-5, 5)
                    
                    # Ensure score is within bounds
                    score = max(15, min(95, score))
                    predictions.append(score)
                
                return np.array(predictions)
        
        # Create enhanced feature columns list
        model_columns = [
            # Basic compatibility features
            'age_difference', 'same_city', 'same_locality', 'same_gender',
            'budget_compatibility', 'budget_difference',
            
            # Lifestyle compatibility
            'sleep_compatibility', 'dietary_compatibility', 'social_compatibility',
            'hosting_compatibility', 'weekend_compatibility',
            'cleanliness_difference', 'cleanliness_compatibility',
            'smoking_compatibility', 'drinking_compatibility',
            'personality_compatibility',
            
            # Interest overlaps
            'hobbies_overlap', 'interests_overlap', 'music_overlap',
            'sports_overlap', 'language_overlap',
            
            # Pet compatibility
            'pet_ownership_compatibility'
        ]
        
        model = EnhancedFallbackModel()
        logger.info(f"✅ Enhanced fallback model created with {len(model_columns)} base features")
        return True
        
    except Exception as e:
        logger.error(f"❌ Enhanced fallback model creation failed: {str(e)}")
        return False

# Load model on import
load_enhanced_model()

def calculate_array_overlap(user_array, candidate_array):
    """Calculate overlap percentage between two arrays"""
    try:
        if not user_array or not candidate_array:
            return 0
        
        user_items = set(str(user_array).split(';')) if isinstance(user_array, str) else set(user_array)
        candidate_items = set(str(candidate_array).split(';')) if isinstance(candidate_array, str) else set(candidate_array)
        
        if len(user_items) == 0 or len(candidate_items) == 0:
            return 0
        
        overlap = len(user_items.intersection(candidate_items))
        total_unique = len(user_items.union(candidate_items))
        
        return overlap / total_unique if total_unique > 0 else 0
    except:
        return 0

def calculate_hosting_compatibility(user_hosting, candidate_hosting):
    """Calculate hosting compatibility score"""
    if user_hosting == 'Either' or candidate_hosting == 'Either':
        return 1.0
    elif (user_hosting == 'I like hosting' and candidate_hosting == 'I like being guest') or \
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

def encode_enhanced_features(user_data, candidate_data):
    """Encode user and candidate data into enhanced model features"""
    try:
        logger.info(f"🔧 Encoding enhanced features for user-candidate pair")
        
        # Initialize feature vector
        features = np.zeros(len(model_columns))
        feature_dict = {}
        
        # Basic demographic features
        feature_dict['age_difference'] = abs(user_data.get('age', 25) - candidate_data.get('Age', 25))
        feature_dict['same_city'] = 1 if user_data.get('city') == candidate_data.get('City') else 0
        feature_dict['same_locality'] = 1 if user_data.get('locality') == candidate_data.get('Locality') else 0
        feature_dict['same_gender'] = 1 if user_data.get('gender') == candidate_data.get('Gender') else 0
        
        # Budget compatibility
        budget_order = ['<15000', '15000-20000', '20000-25000', '25000-30000', '30000-40000', '40000+']
        try:
            user_budget_idx = budget_order.index(user_data.get('budget', '20000-25000'))
            cand_budget_idx = budget_order.index(candidate_data.get('Budget', '20000-25000'))
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
        
        # Map feature dictionary to feature vector
        for i, feature_name in enumerate(model_columns):
            if feature_name in feature_dict:
                features[i] = feature_dict[feature_name]
        
        logger.info(f"✅ Successfully encoded {len([f for f in feature_dict.values() if f != 0])} non-zero features")
        return features.reshape(1, -1)
        
    except Exception as e:
        logger.error(f"❌ Error encoding enhanced features: {str(e)}")
        # Return basic feature vector
        return np.zeros((1, len(model_columns)))

@app.route('/predict-enhanced', methods=['POST'])
def predict_enhanced():
    """Enhanced prediction endpoint using new optimized fields"""
    try:
        data = request.json
        logger.info(f"🎯 Enhanced prediction request received")
        
        if not isinstance(data, list):
            return jsonify({"error": "Expected list of user-candidate pairs"}), 400
        
        predictions = []
        
        for pair in data:
            user_data = pair.get('user', {})
            candidate_data = pair.get('candidate', {})
            
            # Encode features using enhanced feature engineering
            features = encode_enhanced_features(user_data, candidate_data)
            
            # Get prediction
            prediction = model.predict(features)[0]
            predictions.append(max(10, min(95, int(prediction))))
        
        logger.info(f"✅ Generated {len(predictions)} enhanced predictions")
        return jsonify({"match_percentages": predictions})
        
    except Exception as e:
        logger.error(f"❌ Enhanced prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the enhanced model"""
    try:
        return jsonify({
            "model_type": "Enhanced Flatmate Matching Model",
            "features_count": len(model_columns),
            "key_features": [
                "Direct optimized registration fields",
                "Rich feature engineering",
                "Interest overlap calculations",
                "Compatibility scoring",
                "No profile mapping needed"
            ],
            "supported_fields": [
                "sleepPattern", "dietaryPrefs", "smokingHabits", "drinkingHabits",
                "socialStyle", "hostingStyle", "weekendStyle", "personalityType",
                "hobbies", "interests", "musicGenres", "sportsActivities",
                "petOwnership", "petPreference", "languagesSpoken"
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))  # Use port 5001 for ML service
    app.run(host='0.0.0.0', port=port, debug=False)
