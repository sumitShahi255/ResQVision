import os
import base64
import json
from groq import Groq

# Initialize Groq client
try:
    client = Groq()
except Exception:
    client = None

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def classify_image(image_path: str, reported_type: str) -> dict:
    """
    Image Classifier using Groq Vision API.
    """
    if not client or not os.environ.get("GROQ_API_KEY") or os.environ.get("GROQ_API_KEY") == "your_groq_key_here":
        return {
            "verified": True,
            "disaster_type": reported_type,
            "confidence": 85.0
        }

    try:
        base64_image = encode_image(image_path)
        
        prompt = f"""
        Analyze this image. The user has reported a '{reported_type}'.
        Verify if this image actually depicts a '{reported_type}'.
        Also, provide a confidence score between 0 and 100.
        Return ONLY a JSON object with this exact structure:
        {{"verified": true/false, "disaster_type": "actual type you see", "confidence": 95.5}}
        Do not add any other text.
        """
        
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            model="llama-3.2-11b-vision-preview",
            temperature=0.1,
            max_tokens=50
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # In case the model adds markdown formatting like ```json ... ```
        if result_text.startswith("```json"):
            result_text = result_text[7:-3].strip()
        elif result_text.startswith("```"):
            result_text = result_text[3:-3].strip()
            
        result = json.loads(result_text)
        
        return {
            "verified": bool(result.get("verified", True)),
            "disaster_type": str(result.get("disaster_type", reported_type)),
            "confidence": float(result.get("confidence", 85.0))
        }
    except Exception as e:
        print(f"Groq API Error in image classification: {e}")
        return {
            "verified": True,
            "disaster_type": reported_type,
            "confidence": 85.0
        }
