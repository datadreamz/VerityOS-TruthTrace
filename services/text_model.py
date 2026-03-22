import os
import httpx

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
API_URL = "https://api-inference.huggingface.co/models/jy46604790/Fake-News-Bert-Detect"


def _call_huggingface(text: str) -> dict | None:
    """Call HuggingFace Inference API for fake news detection."""
    headers = {}
    if HUGGINGFACE_API_KEY and not HUGGINGFACE_API_KEY.startswith("hf_your"):
        headers["Authorization"] = f"Bearer {HUGGINGFACE_API_KEY}"

    try:
        resp = httpx.post(
            API_URL,
            headers=headers,
            json={"inputs": text[:512]},  # truncate to model limit
            timeout=30.0,
        )
        if resp.status_code == 200:
            data = resp.json()
            # API returns [[{label, score}, ...]] — pick top result
            if isinstance(data, list) and len(data) > 0:
                predictions = data[0] if isinstance(data[0], list) else data
                # Find the top prediction
                best = max(predictions, key=lambda x: x.get("score", 0))
                return best
        return None
    except Exception:
        return None


# ── Enhanced keyword / heuristic fallback ──
FAKE_INDICATORS = [
    "shocking", "breaking", "viral", "alert", "unbelievable", "you won't believe",
    "exposed", "conspiracy", "secret", "they don't want you to know",
    "miracle", "cure", "banned", "100%", "guaranteed", "share before deleted",
    "mainstream media won't", "wake up", "deep state", "cover-up",
]

CREDIBILITY_BOOSTERS = [
    "according to", "researchers found", "study published", "peer-reviewed",
    "data shows", "evidence suggests", "experts say", "university of",
    "journal of", "official statement",
]


def _heuristic_analysis(text: str) -> dict:
    """Enhanced keyword + heuristic analysis as fallback."""
    lower = text.lower()
    fake_score = 0
    real_score = 0
    reasons = []

    for kw in FAKE_INDICATORS:
        if kw in lower:
            fake_score += 1
            reasons.append(f"Contains sensationalist phrase: '{kw}'")

    for kw in CREDIBILITY_BOOSTERS:
        if kw in lower:
            real_score += 1
            reasons.append(f"Contains credibility marker: '{kw}'")

    # Word count check — very short texts are suspect
    word_count = len(text.split())
    if word_count < 15:
        fake_score += 0.5
        reasons.append("Text is unusually short for a news article")

    # Excessive caps
    caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)
    if caps_ratio > 0.3:
        fake_score += 1
        reasons.append("Excessive use of capital letters")

    # Excessive punctuation
    exclamation_count = text.count("!") + text.count("?")
    if exclamation_count > 3:
        fake_score += 0.5
        reasons.append("Excessive punctuation (! or ?)")

    total = fake_score + real_score + 1  # +1 to avoid div-by-zero
    confidence = round(max(fake_score, real_score) / total, 2)
    confidence = min(max(confidence, 0.35), 0.95)  # clamp

    if fake_score > real_score:
        label = "Fake"
        explanation = "Heuristic analysis detected misinformation indicators. " + "; ".join(reasons[:3])
    else:
        label = "Real"
        explanation = "Text appears credible based on heuristic analysis. " + "; ".join(reasons[:3])

    return {"label": label, "confidence": confidence, "explanation": explanation}


def predict_text(text: str) -> dict:
    """
    Predict whether text is fake or real news.
    Uses HuggingFace API when available, falls back to enhanced heuristics.
    """
    hf_result = _call_huggingface(text)

    if hf_result:
        raw_label = hf_result.get("label", "").upper()
        score = round(hf_result.get("score", 0.5), 4)

        # Map model labels to our labels
        if "FAKE" in raw_label or "LABEL_0" in raw_label:
            label = "Fake"
        elif "REAL" in raw_label or "LABEL_1" in raw_label:
            label = "Real"
        else:
            label = "Fake" if score > 0.5 else "Real"

        return {
            "label": label,
            "confidence": score,
            "explanation": f"AI model analysis (Fake-News-Bert-Detect) classified this text as {label} with {score:.1%} confidence.",
            "source": "huggingface_api",
        }

    # Fallback
    result = _heuristic_analysis(text)
    result["source"] = "heuristic_fallback"
    return result