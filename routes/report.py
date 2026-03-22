from fastapi import APIRouter
from services.report_service import generate_report

router = APIRouter()


@router.post("/")
def get_report(data: dict):
    text_res = data.get("text", {"label": "Unknown", "confidence": 0, "explanation": ""})
    image_res = data.get("image", {"label": "Unknown", "confidence": 0, "explanation": ""})
    graph_data = data.get("graph_score", data.get("graph", 0.5))

    return generate_report(text_res, image_res, graph_data)