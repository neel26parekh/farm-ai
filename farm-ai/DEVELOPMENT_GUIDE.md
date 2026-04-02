# 🌾 FarmAI Development Guide (AgroNexus)

Welcome to the FarmAI (AgroNexus) project. This document serves as the primary technical context for both human developers and AI agents. It outlines our architecture, coding standards, and development workflows.

---

## 🎯 Project Overview
AgroNexus is an AI-powered agricultural intelligence platform designed for Indian farmers. It provides real-time crop intelligence, disease detection, and market forecasting in regional languages (English, Hindi, Marathi, Telugu).

---

## 🏗️ Architecture & Tech Stack

### Framework & UI
- **Next.js 16.2**: Utilizing the **App Router** for routing and server-side rendering.
- **React 19**: Modern React features, including Server Components by default.
- **CSS Modules**: Standard for styling to ensure scoped, modular CSS.
- **Framer Motion**: Smooth, high-performance animations for a premium feel.
- **Lucide React**: For a consistent and lightweight iconography system.

### Data & Auth
- **Prisma ORM**: Type-safe database access (Supabase PostgreSQL).
- **NextAuth.js (v5 Beta)**: Authentication layer with Google OAuth and Credentials support.
- **Open-Meteo**: External API for real-time, geolocation-based weather data.

### AI Intelligence
- **Vercel AI SDK**: For streaming AI responses and managing chat state.
- **Google Generative AI (Gemini 2.5 Flash)**:
  - **Advisor Chat**: Multi-turn conversation with contextual farm info injection.
  - **Disease Detection**: Gemini Vision for leaf analysis and structured JSON diagnosis.

---

## 🔄 Development Cycle: "Feature-First"

All contributors should follow this structured framework when adding or modifying features:

1.  **Discovery & Research**: Analyze the current directory structure (`src/app`, `src/components`) to understand existing implementation patterns.
2.  **Implementation Plan**: Before writing code, outline the files to be created/modified.
3.  **UI Construction**:
    - Build UI components in `src/components`.
    - Always use **CSS Modules** (`Component.module.css`).
    - Focus on **Mobile-First** responsiveness (farmers primarily use phones).
4.  **Logic & Data Flow**:
    - Implement API routes or Server Actions.
    - Update Prisma schema if data persistence changes are needed (`npx prisma db push`).
5.  **AI Integration**:
    - Use systemic context injection for Gemini.
    - Ensure streaming is handled gracefully on the frontend.
6.  **Verification**:
    - Run `npm run lint` for code quality.
    - Run `npm run build` to ensure production readiness.

---

## 🎨 Coding Standards

### Styling (CSS)
- **Scoped Styles**: Never use global CSS unless absolutely necessary. Use `.module.css` for every component.
- **Naming**: Use CamelCase for component names and kebab-case or CamelCase for CSS classes (standardize on one: currently using standard CSS classes).
- **Aesthetics**: Prioritize "Premium Dashboards" (glassmorphism, subtle gradients, and meaningful animations).

### TypeScript
- **Strict Typing**: Avoid `any`. Use Prisma's generated types for data models.
- **Component Patterns**: Use functional components with interface-defined props.

### Directory Structure
- `src/app/`: App router pages and layouts.
- `src/components/`: Reusable UI elements.
- `src/lib/`: Shared utilities (AI clients, Prisma client).
- `prisma/`: Database schema and migrations.

---

## 🤖 AI Agent Guidelines

If you are an AI assistant working on this project:
- **Heed `next.config.ts`**: We use modern Next.js conventions.
- **Check `package.json`**: Always verify installed dependencies before suggesting new ones.
- **CSS Modules**: Do not suggest Tailwind unless explicitly asked; stick to our existing CSS Modules pattern.
- **Vision Integration**: When implementing vision features, ensure the prompt requests machine-parseable JSON from Gemini.
- **Context Injection**: When helping with the Advisor chat, always look for how user settings (crop, location) can be injected into the system prompt.

---

## 🛠️ Common Commands

```bash
# Install dependencies
npm install

# Sync DB schema (Supabase)
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Development server
npm run dev

# Linting
npm run lint

# Production build
npm run build
```

---

## 🚀 CI/CD Pipeline
Every push and PR to `main` triggers a GitHub Action that:
- Installs dependencies.
- Generates the Prisma client.
- Runs `npm run lint`.
- Runs `npm run build`.

Ensure your local code passes these checks before pushing.
