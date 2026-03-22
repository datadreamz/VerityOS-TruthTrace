# VerityOS — Content Intelligence Platform

Multi-layer fake news and AI-generated content detection platform with real-world API integrations.

## ✨ Features

- **Text Analysis**: Uses HuggingFace `Fake-News-Bert-Detect` model with an intelligent heuristic fallback.
- **Image Analysis**: Uses HuggingFace `AI-image-detector` (ViT) to identify synthetic media.
- **Graph-based Scoring**: Simulated knowledge-graph engine that evaluates source credibility and misinformation patterns.
- **Combined Engine**: Weights text, image, and graph signals for a final verdict.
- **Insights & Reports**: Dynamic data visualization using Chart.js (Radar, Doughnut, Bar charts).
- **History**: Local storage of previous analyses with expandable reports.
- **Premium UI**: Modern glassmorphism design with Plus Jakarta Sans and smooth Framer Motion animations.

## 🛠️ Tech Stack

- **Backend**: FastAPI, Python 3.10+, HuggingFace Inference API, PIL
- **Frontend**: React (Vite), Framer Motion, Chart.js, Axios, React Icons

## 🚀 Getting Started

### Backend Setup

1. **Install dependencies**:
   ```bash
   pip3 install -r requirements.txt
   ```
2. **Configure API Keys (Optional but Recommended)**:
   - Copy `.env.example` to `.env`
   - Add your [HuggingFace API Key](https://huggingface.co/settings/tokens) for higher rate limits.
3. **Run the server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```
2. **Run the dev server**:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📄 Project Structure

- `/services`: Core analysis models (Text, Image, Graph).
- `/routes`: API endpoints for analysis and reporting.
- `/frontend/src/pages`: Main application views (Analyze, Reports, History, etc.).
- `/frontend/src/api`: Axios client for backend communication.

## 🔑 AI Models

- **Text**: `jy46604790/Fake-News-Bert-Detect`
- **Image**: `umm-maybe/AI-image-detector`
