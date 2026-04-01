<div align="center">

# 🌾 AgroNexus

**AI-Powered Agricultural Intelligence Platform for Indian Farmers**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Gemini 2.5](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

*Empowering 140M+ Indian farmers with real-time crop intelligence, disease detection, and market forecasting — all in their native language.*

[Live Demo](https://agronexus.vercel.app) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 🎯 The Problem

Indian farmers lose **₹92,000 crore annually** due to crop diseases, market timing, and weather unpredictability. Most agri-tech solutions are either too expensive, require technical literacy, or aren't available in regional languages.

## 💡 The Solution

AgroNexus is a **free, multilingual SaaS platform** that brings enterprise-grade agricultural AI to every farmer's phone. It combines:

- 🤖 **AI Crop Advisor** — Gemini 2.5 Flash-powered chat with personalized farming advice
- 🔬 **Disease Detection** — Upload a leaf photo, get instant AI diagnosis via Gemini Vision
- 📊 **Market Intelligence** — Real-time Mandi prices with ML price forecasting
- 🌦️ **Weather Advisory** — Live weather data with crop-specific farming impact analysis
- 🌍 **4 Languages** — English, Hindi, Marathi, Telugu

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend (Next.js 16)"]
        Landing[Landing Page]
        Dashboard[Dashboard Hub]
        Advisor[AI Advisor Chat]
        Disease[Disease Scanner]
        Market[Market Intelligence]
        Weather[Weather Advisory]
        Settings[Settings]
    end

    subgraph AI["AI Layer"]
        GeminiChat[Gemini 2.5 Flash<br/>NLP Chat]
        GeminiVision[Gemini Vision<br/>Disease Detection]
    end

    subgraph Data["Data Layer"]
        OpenMeteo[Open-Meteo API<br/>Live Weather]
        Supabase[(Supabase PostgreSQL)]
        Prisma[Prisma ORM]
    end

    subgraph Auth["Auth Layer"]
        NextAuth[NextAuth.js]
        Google[Google OAuth]
    end

    Advisor -->|Stream| GeminiChat
    Disease -->|Image Upload| GeminiVision
    Weather -->|Geolocation| OpenMeteo
    Dashboard --> Prisma --> Supabase
    Landing --> NextAuth --> Google
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A [Gemini API Key](https://aistudio.google.com/apikey) (free)

### Installation

```bash
# Clone the repository
git clone https://github.com/neel26parekh/farm-ai.git
cd farm-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# Initialize the database
npx prisma db push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🧠 AI Integration Details

| Feature | Model | Use Case |
|---|---|---|
| **Crop Advisor** | `gemini-2.5-flash` | Multi-turn farming Q&A with farm context injection |
| **Disease Detection** | `gemini-2.5-flash` (Vision) | Plant image analysis → structured JSON diagnosis |
| **Market Forecasting** | Prophet ML (simulated) | Time-series commodity price prediction |
| **Weather Impact** | Rule-based + Open-Meteo | Crop-specific weather advisories |

### What Makes the AI Real (Not a Wrapper)

1. **Context Injection** — User's farm settings (crop, location, acreage) are injected into the Gemini system prompt for personalized advice
2. **Structured Vision Output** — Disease detection returns machine-parseable JSON with confidence scores, severity, treatment plans
3. **Streaming Responses** — Chat uses Server-Sent Events for real-time token streaming
4. **Multi-turn Memory** — Full conversation history is sent with each request for contextual follow-ups

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2 (App Router, Turbopack) |
| **Language** | TypeScript 5.x |
| **AI** | Google Gemini 2.5 Flash via Vercel AI SDK |
| **Database** | Supabase PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js (Google OAuth + Credentials) |
| **Weather** | Open-Meteo API (free, no key needed) |
| **Charts** | Recharts |
| **Styling** | CSS Modules + Custom Design System |
| **Icons** | Lucide React |
| **Fonts** | Inter + Source Serif 4 |
| **Deploy** | Vercel |

---

## 📱 Mobile First

AgroNexus was built with Indian farmers in mind — farmers who primarily use **affordable Android phones** in the field. The platform features:

- Responsive sidebar → mobile bottom navigation
- Touch-friendly tap targets
- Voice input (Web Speech API) for the AI Advisor
- Offline-resilient fallback data for market prices

---

## 🌐 Multilingual Support

| Language | Code | Status |
|---|---|---|
| English | `en` | ✅ Full |
| Hindi (हिंदी) | `hi` | ✅ Full |
| Marathi (मराठी) | `mr` | ✅ Full |
| Telugu (తెలుగు) | `te` | ✅ Full |

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ for Indian farmers**

*AgroNexus — Because every farmer deserves AI-powered intelligence.*

</div>
