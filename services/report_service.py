import uuid
from datetime import datetime, timezone


def generate_report(text_res: dict, image_res: dict, graph_data: dict) -> dict:
    """
    Generate a structured analysis report combining all analysis results.

    Args:
        text_res: Result from text analysis { label, confidence, explanation }
        image_res: Result from image analysis { label, confidence, explanation }
        graph_data: Result from graph scoring { graph_score, factors }
    """
    # Handle both old format (just a float) and new format (dict with factors)
    if isinstance(graph_data, (int, float)):
        graph_score = float(graph_data)
        graph_factors = {
            "source_credibility": 0.5,
            "pattern_similarity": 0.5,
            "network_trust": 0.5,
        }
    else:
        graph_score = graph_data.get("graph_score", 0.5)
        graph_factors = graph_data.get("factors", {})

    text_confidence = text_res.get("confidence", 0.5)
    image_confidence = image_res.get("confidence", 0.5)

    # Adjust confidence direction based on label
    text_credibility = text_confidence if text_res.get("label") == "Real" else (1 - text_confidence)
    image_credibility = image_confidence if image_res.get("label") == "Real" else (1 - image_confidence)

    # Weighted final score (credibility: 0 = fake, 1 = real)
    final_score = round(
        0.40 * text_credibility +
        0.30 * image_credibility +
        0.30 * graph_score,
        2
    )

    # Determine verdict
    if final_score >= 0.7:
        verdict = "Real"
        verdict_detail = "Content appears to be credible and authentic."
    elif final_score >= 0.4:
        verdict = "Uncertain"
        verdict_detail = "Content shows mixed signals. Manual review recommended."
    else:
        verdict = "Fake"
        verdict_detail = "Content shows significant indicators of misinformation or AI generation."

    report_id = str(uuid.uuid4())[:8]

    return {
        "report_id": report_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "verdict": verdict,
            "verdict_detail": verdict_detail,
            "final_score": final_score,
        },
        "text_analysis": {
            "label": text_res.get("label", "Unknown"),
            "confidence": text_confidence,
            "credibility_score": round(text_credibility, 2),
            "explanation": text_res.get("explanation", ""),
            "source": text_res.get("source", "unknown"),
        },
        "image_analysis": {
            "label": image_res.get("label", "Unknown"),
            "confidence": image_confidence,
            "credibility_score": round(image_credibility, 2),
            "explanation": image_res.get("explanation", ""),
            "source": image_res.get("source", "unknown"),
        },
        "graph_insights": {
            "graph_score": graph_score,
            "factors": graph_factors,
        },
        "scores": {
            "text": round(text_credibility, 2),
            "image": round(image_credibility, 2),
            "graph": graph_score,
            "final": final_score,
        },
    }