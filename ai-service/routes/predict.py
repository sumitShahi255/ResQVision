from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.image_classifier import classify_image
from services.severity_predictor import predict_severity
from services.recommendation_service import get_recommendations
import shutil
import os
import time
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Ensure upload directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/predict")
async def predict_disaster(
    file: UploadFile = File(...),
    reported_type: str = Form(...)
):
    try:
        start_time = time.time()
        
        # Save image temporarily
        file_location = f"{UPLOAD_DIR}/{int(time.time())}_{file.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
            
        # 1. AI Image Classification (Verify if it's a real disaster)
        classification_result = classify_image(file_location, reported_type)
        
        # 2. AI Severity Prediction
        severity_result = predict_severity(file_location, classification_result['disaster_type'])
        
        # 3. AI Recommendation Engine
        recommended_resources = get_recommendations(
            classification_result['disaster_type'], 
            severity_result['severity']
        )
        
        # 4. Aggregate response
        response = {
            "verified": classification_result['verified'],
            "disasterType": classification_result['disaster_type'],
            "severity": severity_result['severity'],
            "confidence": classification_result['confidence'],
            "predictedResources": recommended_resources
        }
        
        # Cleanup
        os.remove(file_location)
        
        end_time = time.time()
        logger.info(f"Processed /predict in {end_time - start_time:.2f}s | Result: {response}")
        
        return response
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during AI processing")
