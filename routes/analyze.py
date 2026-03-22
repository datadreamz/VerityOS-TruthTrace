from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from models.schemas import TextRequest
from services.text_model import predict_text
from services.image_model import analyze_image
from services.graph_service import get_graph_score
from services.report_service import generate_report
import sys

router = APIRouter()


def _get_history() -> list:
    """Get reference to the in-memory history list from main app."""
    import main
    return main.analysis_history


# ✅ TEXT
@router.post("/text")
def analyze_text(request: TextRequest):
    result = predict_text(request.text)
    graph_data = get_graph_score(request.text)

    entry = {
        "type": "text",
        "input_preview": request.text[:100],
        "result": result,
        "graph": graph_data,
    }
    _get_history().insert(0, entry)

    return {**result, "graph": graph_data}


# ✅ IMAGE
@router.post("/image")
async def analyze_image_api(file: UploadFile = File(...)):
    result = analyze_image(file.file)

    entry = {
        "type": "image",
        "input_preview": file.filename or "uploaded_image",
        "result": result,
        "graph": {"graph_score": 0.5, "factors": {}},
    }
    _get_history().insert(0, entry)

    return result


# ✅ COMBINED
@router.post("/combined")
async def combined_analysis(
    text: str = Form(""),
    file: Optional[UploadFile] = File(None),
):
    text_res = predict_text(text) if text else {
        "label": "Unknown",
        "confidence": 0.0,
        "explanation": "No text provided",
    }

    if file and file.filename:
        image_res = analyze_image(file.file)
    else:
        image_res = {
            "label": "Unknown",
            "confidence": 0.0,
            "explanation": "No image provided",
        }

    graph_data = get_graph_score(text)
    report = generate_report(text_res, image_res, graph_data)

    entry = {
        "type": "combined",
        "input_preview": (text[:80] if text else "image: " + (file.filename if file else "none")),
        "result": report,
        "graph": graph_data,
    }
    _get_history().insert(0, entry)

    return report