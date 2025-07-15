#!/usr/bin/env python3
"""
Script to fix numpy compatibility issues by reloading and resaving model files
This runs during deployment to ensure model files are compatible with the target environment
"""
import joblib
import numpy as np
import pickle
import logging
import warnings

# Suppress warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fix_model_compatibility():
    """Fix model compatibility by reloading with current numpy version"""
    try:
        logger.info(f"🔧 Fixing model compatibility with numpy {np.__version__}")
        
        # Try to load existing model files
        try:
            logger.info("Loading existing model...")
            model = joblib.load('flatmate_match_model.pkl')
        except Exception as e:
            logger.info(f"Joblib loading failed: {e}, trying pickle...")
            with open('flatmate_match_model.pkl', 'rb') as f:
                model = pickle.load(f)
        
        try:
            logger.info("Loading existing model columns...")
            model_columns = joblib.load('flatmate_model_columns.pkl')
        except Exception as e:
            logger.info(f"Joblib column loading failed: {e}, trying pickle...")
            with open('flatmate_model_columns.pkl', 'rb') as f:
                model_columns = pickle.load(f)
        
        # Test the model
        test_features = np.zeros(len(model_columns))
        prediction = model.predict([test_features])
        logger.info(f"✅ Model test successful: {prediction[0]:.2f}")
        
        # Resave with current environment for compatibility
        logger.info("Resaving model files for compatibility...")
        joblib.dump(model, 'flatmate_match_model.pkl')
        joblib.dump(model_columns, 'flatmate_model_columns.pkl')
        
        logger.info(f"✅ Model compatibility fix complete!")
        logger.info(f"   Model features: {len(model_columns)}")
        logger.info(f"   Numpy version: {np.__version__}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Model compatibility fix failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = fix_model_compatibility()
    if not success:
        exit(1)
