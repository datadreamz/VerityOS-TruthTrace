import os
import io
import httpx
from PIL import Image

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
API_URL = "https://api-inference.huggingface.co/models/umm-maybe/AI-image-detector"


def _call_huggingface_image(image_bytes: bytes) -> dict | None:
    """Call HuggingFace AI-image-detector model."""
    headers = {}
    if HUGGINGFACE_API_KEY and not HUGGINGFACE_API_KEY.startswith("hf_your"):
        headers["Authorization"] = f"Bearer {HUGGINGFACE_API_KEY}"

    try:
        resp = httpx.post(
            API_URL,
            headers=headers,
            content=image_bytes,
            timeout=60.0,
        )
        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, list) and len(data) > 0:
                best = max(data, key=lambda x: x.get("score", 0))
                return best
        return None
    except Exception:
        return None


def _enhanced_heuristic(image: Image.Image) -> dict:
    """
    Enhanced heuristic analysis for AI-generated image detection.
    Analyzes: EXIF metadata, resolution patterns, color statistics, noise patterns.
    """
    width, height = image.size
    reasons = []
    ai_score = 0

    # 1. Resolution analysis — AI images often have specific resolutions
    common_ai_sizes = [(512, 512), (768, 768), (1024, 1024), (256, 256),
                       (512, 768), (768, 512), (1024, 768), (768, 1024)]
    if (width, height) in common_ai_sizes:
        ai_score += 0.2
        reasons.append(f"Resolution {width}x{height} matches common AI-generation sizes")

    # Perfect square
    if width == height:
        ai_score += 0.1
        reasons.append("Image has perfect square aspect ratio")

    # 2. EXIF metadata — real photos usually have EXIF data
    exif = image.getexif()
    if not exif:
        ai_score += 0.15
        reasons.append("No EXIF metadata found (common in AI-generated images)")
    else:
        ai_score -= 0.15
        reasons.append("EXIF metadata present (common in real photographs)")

    # 3. Color channel statistics
    if image.mode in ("RGB", "RGBA"):
        import statistics
        pixels = list(image.getdata())
        if len(pixels) > 100:
            sample = pixels[:5000]  # sample for performance
            r_vals = [p[0] for p in sample]
            g_vals = [p[1] for p in sample]
            b_vals = [p[2] for p in sample]

            r_std = statistics.stdev(r_vals) if len(r_vals) > 1 else 0
            g_std = statistics.stdev(g_vals) if len(g_vals) > 1 else 0
            b_std = statistics.stdev(b_vals) if len(b_vals) > 1 else 0

            avg_std = (r_std + g_std + b_std) / 3

            # AI images tend to have very smooth transitions (lower noise)
            if avg_std < 30:
                ai_score += 0.15
                reasons.append("Low color variance suggests synthetic generation")
            elif avg_std > 80:
                ai_score -= 0.1
                reasons.append("High color variance suggests real photograph")

    # 4. File size heuristic (if we had it — working with PIL object)
    # AI images tend to compress differently
    buf = io.BytesIO()
    image.save(buf, format="JPEG", quality=95)
    compressed_size = buf.tell()
    pixels_count = width * height
    if pixels_count > 0:
        compression_ratio = compressed_size / pixels_count
        if compression_ratio < 0.5:
            ai_score += 0.1
            reasons.append("Compression ratio suggests synthetic content")

    # Clamp score
    ai_score = min(max(ai_score, 0.1), 0.9)

    if ai_score > 0.4:
        label = "AI-generated"
        explanation = "Heuristic analysis indicates likely AI-generated content. " + "; ".join(reasons[:3])
    else:
        label = "Real"
        explanation = "Heuristic analysis indicates likely real photograph. " + "; ".join(reasons[:3])

    return {
        "label": label,
        "confidence": round(ai_score, 2),
        "explanation": explanation,
    }


def analyze_image(file) -> dict:
    """
    Analyze an image to detect if it's AI-generated.
    Uses HuggingFace AI-image-detector when available, falls back to enhanced heuristics.
    """
    # Read bytes for API call
    image_bytes = file.read()
    file.seek(0)  # reset for PIL

    image = Image.open(io.BytesIO(image_bytes))

    # Try HuggingFace API first
    hf_result = _call_huggingface_image(image_bytes)

    if hf_result:
        raw_label = hf_result.get("label", "").lower()
        score = round(hf_result.get("score", 0.5), 4)

        if "artificial" in raw_label or "ai" in raw_label:
            label = "AI-generated"
        elif "human" in raw_label or "real" in raw_label:
            label = "Real"
        else:
            label = "AI-generated" if score > 0.5 else "Real"

        return {
            "label": label,
            "confidence": score,
            "explanation": f"AI model (AI-image-detector) classified this image as {label} with {score:.1%} confidence.",
            "source": "huggingface_api",
        }

    # Fallback to enhanced heuristic
    result = _enhanced_heuristic(image)
    result["source"] = "heuristic_fallback"
    return result