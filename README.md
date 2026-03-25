# 🚜 FarmAI: Silicon Valley Tech for Bharat's Farmers (formerly Agro Nexus)

<div align="center">
  <img src="https://img.shields.io/badge/VibeCon-Top_Project-Emerald?style=for-the-badge&logo=ycombinator" alt="VibeCon" />
  <img src="https://img.shields.io/badge/Machine%20Learning-FastAPI-blue?style=for-the-badge&logo=python" alt="ML Backend" />
  <img src="https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js" alt="Next.js" />
</div>

<br/>

**The Problem:** Over 60% of India's population depends on agriculture, yet farmers lose ₹2,000+ Crores annually to preventable crop diseases, unpredictable weather, and market information asymmetry. 

**The Solution:** **FarmAI** is a production-ready, full-stack platform bringing enterprise-grade artificial intelligence directly to smartphones in rural India.

---

## ✨ Core Features (The "Magic")

1. **🌿 Deep Learning Disease Detection**
   - Upload a photo of a crop leaf directly from the field.
   - FarmAI’s CV endpoint (stubbed for ResNet50) instantly classifies the disease, provides a confidence score, and prescribes locally-available chemical treatments.
2. **📈 Market Intelligence (Time-Series Forecasting)**
   - Tracks 500+ local Mandis across India.
   - Uses Facebook Prophet-styled time-series forecasting to predict peak selling windows, ensuring farmers maximize profit margins rather than selling at panic-bottoms.
3. **🤖 Generative AI Agronomist RAG**
   - A 24/7 hyper-localized chatbot powered by **Google Gemini 1.5**.
   - Accessible via text or voice, capable of diagnosing niche crop symptoms or creating bespoke fertilizer schedules.

---

## 🏗️ Architecture

FarmAI uses a decoupled **Microservices Architecture** designed for massive horizontal scaling — ready for Seed/Series A loads.

```mermaid
graph TD;
    Client[📱 Mobile & Web App] -->|Next.js App Router| Auth[🔒 AuthContext]
    Auth -->|React Context| UI[⚛️ UI Components]
    
    UI -->|POST /api/predict| ML[🐍 Python FastAPI Backend]
    UI -->|GET /api/forecast| ML
    UI -->|POST /api/chat| ML

    subgraph "ML Inference Engine (FastAPI)"
        ML --> CV[📷 Computer Vision Model]
        ML --> TS[📊 Prophet Forecasting]
        ML --> LLM[🧠 Gemini 1.5 LLM]
    end
```

---

## 💼 Business Model (Monetization)

We are not building a charity; we are building a venture-scale business.

*   **Free Tier (The Hook):** Basic weather advisory and text-based AI chat. Drives massive rural user acquisition and virality.
*   **FarmAI Pro (₹299/mo):** Unlimited photo disease detection, 30-day market forecasting, and priority AI Agronomist responses.
*   **Enterprise / Cooperative:** API access for massive farming cooperatives to integrate FarmAI data into their supply chains.

---

## 🚀 How to Run Locally

Want to run the Magic yourself?

### 1. Start the Frontend
```bash
cd "farm-ai"
npm install
npm run dev
```
*(Runs on http://localhost:3000)*

### 2. Start the ML Backend
```bash
cd "farm-ai-backend"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Add your GEMINI_API_KEY to farm-ai-backend/.env
uvicorn main:app --reload
```
*(Runs on http://localhost:8000)*

---

### Built for Emerging Builders | YC Target 2026

---

## Legacy Documentation (Agro Nexus)

Agro Nexus is a hybrid agriculture project that combines a local web interface with machine learning notebooks for agricultural decision support. The repository contains a landing website, supporting marketing pages, notebook-based model development for crop and fertilizer recommendations, and references to remote Google Colab training artifacts.

### Repository Structure

```text
Agro-Nexus/
├── index.html
├── index copy.html
├── product.html
├── service.html
├── team.html
├── testimonial.html
├── livecount.html
├── Crop_Recommendation_2.ipynb
├── ferti.ipynb
├── regression.ipynb
├── yield.ipynb
├── farmAI
├── model-01
├── model-02
├── model-03
├── model-04
└── README.md
```

### Website Files

#### `index.html`
Primary landing page for Agro Nexus. It is now a self-contained local interface with modern styling, in-page forms for all prediction workflows, JavaScript calls to local API endpoints, and a diagnostics view that reports missing datasets and model artifacts.

#### `server.py`
Local HTTP server for the project. It serves the website, exposes JSON endpoints for crop recommendation, fertilizer suggestion, production estimation, and yield estimation, and reports whether the notebook datasets and serialized artifacts are present.

### Machine Learning Notebooks

#### `Crop_Recommendation_2.ipynb`
Crop recommendation notebook for a classification workflow. The notebook reads `crop_recommendation.csv`, performs exploratory analysis, uses `SMOTE` for class balancing, and evaluates several classification approaches.

#### `ferti.ipynb`
Fertilizer prediction notebook. It reads `Fertilizer Prediction-2.csv`, performs visual analysis, encodes categorical values, and trains classifiers.

#### `regression.ipynb`
Crop regression notebook for yield-related prediction work.

#### `yield.ipynb`
Yield prediction notebook that reads `yield_df.csv` and builds regression pipelines.

### External References

#### Live Website
The file `farmAI` contains the deployed Vercel URL:
`https://farm-ai-htl-2526.vercel.app/`

#### Remote Model Notebooks
The files `model-01` through `model-04` each contain a Google Colab link:
- `model-01`: `https://colab.research.google.com/drive/1y8XDfIwbaqxFb_kNbvb1j9RxtFj2h7fe`
- `model-02`: `https://colab.research.google.com/drive/1TQqxwGVgvMwSugHkJ3tvMhP60BKJ1uru`
- `model-03`: `https://colab.research.google.com/drive/1jAHcVJKqpaxCu4Agq5guw_Ml1dj4jtKS`
- `model-04`: `https://colab.research.google.com/drive/1y4kY4f-Aa6NBRQ2Fs8TtdaHQfpofwAFs`
