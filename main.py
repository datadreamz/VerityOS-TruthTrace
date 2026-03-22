import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import analyze, report

load_dotenv()

app = FastAPI(title="VerityOS API")

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/analyze")
app.include_router(report.router, prefix="/report")

# ── In-memory history store ──
analysis_history: list[dict] = []

@app.get("/")
def home():
    return {"message": "VerityOS API is running 🚀"}

@app.get("/history")
def get_history():
    return analysis_history

@app.delete("/history")
def clear_history():
    analysis_history.clear()
    return {"message": "History cleared"}