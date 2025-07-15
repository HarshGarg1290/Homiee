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
        
        # Set environment variables for numpy compatibility
        import os
        os.environ['NUMPY_EXPERIMENTAL_ARRAY_FUNCTION'] = '0'
        os.environ['NPY_DISABLE_SVML'] = '1'
        
        # Try to load existing model files with multiple strategies
        model = None
        model_columns = None
        
        # Try different loading approaches
        for attempt in range(3):
            try:
                logger.info(f"Loading attempt {attempt + 1}...")
                
                if attempt == 0:
                    # Standard joblib
                    model = joblib.load('flatmate_match_model.pkl')
                    model_columns = joblib.load('flatmate_model_columns.pkl')
                elif attempt == 1:
                    # Joblib with mmap_mode=None
                    model = joblib.load('flatmate_match_model.pkl', mmap_mode=None)
                    model_columns = joblib.load('flatmate_model_columns.pkl', mmap_mode=None)
                else:
                    # Pure pickle fallback
                    with open('flatmate_match_model.pkl', 'rb') as f:
                        model = pickle.load(f)
                    with open('flatmate_model_columns.pkl', 'rb') as f:
                        model_columns = pickle.load(f)
                
                break  # Success, exit loop
                
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed: {e}")
                if attempt == 2:  # Last attempt
                    raise e
        
        # Test the model
        test_features = np.zeros(len(model_columns))
        prediction = model.predict([test_features])
        logger.info(f"✅ Model test successful: {prediction[0]:.2f}")
        
        # Resave with current environment for compatibility
        logger.info("Resaving model files for compatibility...")
        joblib.dump(model, 'flatmate_match_model.pkl', compress=0)
        joblib.dump(model_columns, 'flatmate_model_columns.pkl', compress=0)
        
        logger.info(f"✅ Model compatibility fix complete!")
        logger.info(f"   Model features: {len(model_columns)}")
        logger.info(f"   Numpy version: {np.__version__}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Model compatibility fix failed: {str(e)}")
        logger.error("Continuing with original model files...")
        return False

if __name__ == "__main__":
    try:
        success = fix_model_compatibility()
        if success:
            logger.info("✅ Model compatibility fix completed successfully")
        else:
            logger.warning("⚠️ Model compatibility fix failed, but continuing with original files")
    except Exception as e:
        logger.error(f"❌ Compatibility fix script error: {e}")
        logger.warning("⚠️ Continuing with original model files")
    
    # Always exit successfully to not block deployment
    exit(0)
