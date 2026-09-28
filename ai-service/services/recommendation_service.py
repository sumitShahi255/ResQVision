import os
import json
from groq import Groq

# Initialize Groq client (it automatically picks up GROQ_API_KEY from environment)
try:
    client = Groq()
except Exception:
    client = None

def get_recommendations(disaster_type: str, severity: str) -> list:
    """
    Intelligent Recommendation Engine using Groq LLM.
    Returns a dynamic list of recommended emergency resources based on disaster type and severity.
    """
    # Base fallback resources in case Groq API fails or is not configured
    fallback_resources = ["Medical Team", "Food", "Water", "Shelter Tents", "Ambulance"]
    
    if not client or not os.environ.get("GROQ_API_KEY") or os.environ.get("GROQ_API_KEY") == "your_groq_key_here":
        return fallback_resources[:3]

    prompt = f"""
    You are an AI emergency response coordinator.
    A disaster of type '{disaster_type}' has been reported with '{severity}' severity.
    Provide a list of up to 5 critical emergency resources or teams that should be dispatched immediately.
    Return ONLY a valid JSON array of strings. No markdown formatting, no explanations.
    Example: ["Ambulance", "Fire Truck", "Search & Rescue Dogs"]
    """
    
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            max_tokens=100
        )
        
        result_text = response.choices[0].message.content.strip()
        # Parse the JSON array
        resources = json.loads(result_text)
        
        if isinstance(resources, list) and len(resources) > 0:
            return resources
        return fallback_resources
    except Exception as e:
        print(f"Groq API Error in recommendations: {e}")
        return fallback_resources
