import os
import base64
from groq import Groq

# Initialize Groq client
try:
    client = Groq()
except Exception:
    client = None

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def predict_severity(image_path: str, disaster_type: str) -> dict:
    """
    Severity Predictor using Groq Vision API.
    """
    if not client or not os.environ.get("GROQ_API_KEY") or os.environ.get("GROQ_API_KEY") == "your_groq_key_here":
        return {"severity": "Moderate"}

    try:
        base64_image = encode_image(image_path)
        
        prompt = f"""
        Analyze this image of a '{disaster_type}'.
        Based on the visible damage or situation, classify the severity into exactly ONE of these categories: Low, Moderate, High, Critical.
        Respond with ONLY the exact category name. No other text.
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
            max_tokens=10
        )
        
        result_text = response.choices[0].message.content.strip()
        
        valid_severities = ["Low", "Moderate", "High", "Critical"]
        # Handle cases where model might output "High." instead of "High"
        for s in valid_severities:
            if s.lower() in result_text.lower():
                return {"severity": s}
                
        return {"severity": "Moderate"}
    except Exception as e:
        print(f"Groq API Error in severity prediction: {e}")
        return {"severity": "Moderate"}
