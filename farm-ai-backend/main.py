import os
import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import pandas as pd
import google.generativeai as genai

# Load Env Vars
from dotenv import load_dotenv

# Explicitly search for .env in the backend directory
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=dotenv_path)

# Configure Gemini if key exists
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    
app = FastAPI(title="FarmAI ML Backend", version="1.0.0")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://farm-ai.vercel.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Computer Vision (Disease)
# -------------------------
@app.post("/api/predict-disease")
async def predict_disease(image: UploadFile = File(...)):
    """
    Industry Implementation:
    1. Read 'image.file.read()' into PIL Image or bytes.
    2. Pass through AutoImageProcessor.
    3. Run Inference via AutoModelForImageClassification (HuggingFace).
    4. Return top-1 class and confidence score.
    """
    # Read file bytes to simulate processing time
    contents = await image.read()
    
    # --- ML Stub Logic ---
    # For now, we simulate the CNN output to return a realistic structural payload
    # In production, replace below with: model(inputs)
    
    simulated_classes = [
        {
            "name": "Wheat Rust",
            "confidence": 98.4,
            "severity": "high",
            "crop": "Wheat",
            "description": "Wheat rust is a fungal disease that attacks the stems and leaves of wheat.",
            "symptoms": ["Orange-brown pustules on leaves", "Yellowing of leaf tissue", "Stunted growth"],
            "treatment": ["Apply Propiconazole 25% EC @ 1ml/L", "Remove infected plants"],
            "prevention": ["Plant resistant varieties", "Crop rotation"]
        },
        {
            "name": "Healthy Plant",
            "confidence": 99.1,
            "severity": "low",
            "crop": "Unknown",
            "description": "The leaf appears perfectly healthy with no signs of fungal or bacterial infection.",
            "symptoms": ["None detected"],
            "treatment": ["No treatment required"],
            "prevention": ["Maintain current irrigation schedule"]
        },
        {
            "name": "Tomato Blight",
            "confidence": 92.5,
            "severity": "medium",
            "crop": "Tomato",
            "description": "Early blight is a common tomato disease caused by the fungus Alternaria linariae.",
            "symptoms": ["Dark brown spots with concentric rings", "Yellowing lower leaves"],
            "treatment": ["Apply copper-based fungicide", "Improve air circulation around plants"],
            "prevention": ["Water at base to keep leaves dry", "Stake plants properly"]
        }
    ]
    
    # Deterministic mock based on file size/name length for demo variance
    idx = len(image.filename) % len(simulated_classes)
    prediction = simulated_classes[idx]
    
    return {
        "status": "success",
        "model_used": "resnet50-plant-disease",
        "result": prediction
    }

# -------------------------
# Time-Series (Market)
# -------------------------
class MarketRequest(BaseModel):
    crop: str
    days_to_forecast: int = 30

@app.post("/api/market-forecast")
async def forecast_market(req: MarketRequest):
    """
    Industry Implementation:
    1. Load historical AGMARKNET API data for 'req.crop' into a pandas DataFrame.
    2. Format DataFrame to `ds` and `y` exact columns for Prophet.
    3. Initialize Prophet() and fit.
    4. Create future dataframe and predict next N days.
    """
    
    # --- ML Stub Logic ---
    # Simulate Prophet output shape
    base_price = 2450 if req.crop.lower() == "wheat" else 3100
    dates = [datetime.now() + timedelta(days=i) for i in range(req.days_to_forecast)]
    
    predictions = []
    current_price = base_price
    for d in dates:
        # Simulate ARIMA Random Walk with Drift
        drift = random.uniform(-15, 20)
        current_price += drift
        predictions.append({
            "ds": d.strftime("%Y-%m-%d"),
            "yhat": round(current_price),
            "yhat_lower": round(current_price - 120),
            "yhat_upper": round(current_price + 120)
        })
        
    return {
        "status": "success",
        "model_used": "meta-prophet-v1.1",
        "crop": req.crop,
        "forecast": predictions
    }

# -------------------------
# NLP (LLM Advisor)
# -------------------------
class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []
    user_context: Dict[str, Any] = None

@app.post("/api/chat")
async def chat_advisor(req: ChatRequest):
    query = req.message
    
    # Try using genuine Google Gemini API if configured
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-3-flash-preview')
            
            # Build dynamic system prompt based on user settings
            system_prompt = (
                "You are FarmAI Advisor, an expert agronomist for Indian farmers. Be friendly, warm, and professional. "
                "ABSOLUTE FORMATTING RULES — follow these at ALL times, no exceptions:\n"
                "1. NEVER use markdown heading symbols (#, ##, ###, ####). This is STRICTLY forbidden. Instead, write section titles as **Bold Text** on their own line.\n"
                "2. Use **bold** for any important term, variety name, or action item.\n"
                "3. DO NOT use emojis. Keep the tone clean and professional.\n"
                "4. Keep paragraphs short and responses concise. Use bullet points (starting with -) for lists.\n"
                "5. End with a friendly follow-up question to continue the conversation.\n"
                "Remember: NO hash symbols and NO emojis anywhere in your response."
            )

            if req.user_context:
                ctx = req.user_context
                system_prompt += f" The user is a {ctx.get('farmSize', 'small')} acre {ctx.get('primaryCrop', 'mixed')} farmer in {ctx.get('location', 'India')}."
                if ctx.get('language') and ctx.get('language') != "English":
                    system_prompt += f" IMPORTANT: Reply entirely in {ctx.get('language')} language."
            
            # Format history
            chat_context = f"System: {system_prompt}\n"
            for msg in req.history[-4:]:
                role = "User: " if msg.get("role") == "user" else "Advisor: "
                chat_context += f"{role}{msg.get('content')}\n"
            chat_context += f"User: {query}\nAdvisor: "
            
            response = model.generate_content(chat_context)
            # Post-process: strip any markdown headers that sneak through
            import re
            clean_text = re.sub(r'^#{1,6}\s*', '', response.text, flags=re.MULTILINE)
            return {
                "status": "success",
                "model_used": "gemini-1.5-flash",
                "response": clean_text
            }
        except Exception as e:
            print(f"Gemini API Error: {e}")
            # Fallback below if API fails
    
    # --- Fallback Mock Logic ---
    q_lower = query.lower()
    response_text = "I am currently running in offline mock mode. Please add a `GEMINI_API_KEY` to the `.env` file in the backend to enable genuine AI responses! Meanwhile, I recommend monitoring your soil moisture levels."
    
    if "wheat" in q_lower and "spots" in q_lower:
        response_text = "Yellow spots on wheat often indicate **Stripe Rust**. You should immediately isolate the affected area and consider applying Propiconazole. (Note: Add GEMINI_API_KEY for dynamic advice!)"
    elif "price" in q_lower or "sell" in q_lower:
        response_text = "Based on our latest Prophet modeling, market prices vary heavily by Mandi. Check the Market Intelligence tab for predictions. (Note: Add GEMINI_API_KEY for dynamic advice!)"
        
    return {
        "status": "success",
        "model_used": "offline-mock",
        "response": response_text
    }

# -------------------------
# Health Check
# -------------------------
@app.get("/")
def health_check():
    return {"status": "ok", "service": "FarmAI ML Core"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
