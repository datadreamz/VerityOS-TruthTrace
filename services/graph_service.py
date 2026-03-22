"""
Graph-based credibility scoring engine.

Simulates a knowledge-graph approach to evaluating content credibility
by checking against known misinformation patterns, source reputation
databases, and content relationship networks.
"""

import hashlib
import re

# ── Simulated Knowledge Graph Data ──

# Known unreliable source domains / patterns
UNRELIABLE_SOURCES = {
    "infowars", "naturalnews", "beforeitsnews", "worldnewsdailyreport",
    "theonion", "babylonbee", "clickhole", "waterfordwhispers",
    "newsthump", "dailymash", "huzlers", "empirenews",
}

# Known misinformation narrative patterns
MISINFO_PATTERNS = [
    r"5g\s*(causes?|spreads?|creates?)\s*(covid|corona|virus|cancer)",
    r"vaccine[s]?\s*(cause|contain|inject)\s*(autism|microchip|5g|dna)",
    r"flat\s*earth\s*(proof|confirmed|evidence)",
    r"chemtrail[s]?\s*(proof|confirmed|spraying|poison)",
    r"(illuminati|deep\s*state|new\s*world\s*order)\s*(confirmed|exposed|controls)",
    r"(covid|corona)\s*(hoax|fake|planned|plandemic)",
    r"(election|vote)\s*(stolen|rigged|fraud)\s*(proof|confirmed|evidence)",
    r"(miracle|secret)\s*cure\s*(they|government|big\s*pharma)",
    r"(area\s*51|aliens?)\s*(confirmed|leaked|exposed)",
]

# Credibility-boosting source patterns
RELIABLE_INDICATORS = [
    "reuters", "associated press", "ap news", "bbc", "nature.com",
    "pubmed", "arxiv", "ieee", "springer", "wiley",
    "nytimes", "washingtonpost", "theguardian", "npr",
    ".gov", ".edu", "who.int", "cdc.gov",
]


def _compute_source_credibility(text: str) -> float:
    """Check text for source references and score credibility."""
    lower = text.lower()
    unreliable_hits = sum(1 for src in UNRELIABLE_SOURCES if src in lower)
    reliable_hits = sum(1 for src in RELIABLE_INDICATORS if src in lower)

    if unreliable_hits > 0 and reliable_hits == 0:
        return max(0.1, 0.5 - (unreliable_hits * 0.15))
    elif reliable_hits > 0 and unreliable_hits == 0:
        return min(0.95, 0.5 + (reliable_hits * 0.15))
    elif reliable_hits > 0 and unreliable_hits > 0:
        return 0.5  # mixed signals
    else:
        return 0.5  # neutral


def _compute_pattern_similarity(text: str) -> float:
    """Check text against known misinformation narrative patterns."""
    lower = text.lower()
    pattern_hits = 0
    for pattern in MISINFO_PATTERNS:
        if re.search(pattern, lower):
            pattern_hits += 1

    if pattern_hits == 0:
        return 0.85  # no known misinfo patterns → higher credibility
    elif pattern_hits == 1:
        return 0.35
    else:
        return max(0.05, 0.35 - (pattern_hits * 0.1))


def _compute_network_trust(text: str) -> float:
    """
    Simulate network-based trust score.
    Uses content fingerprinting to check against a simulated
    graph of known content relationships.
    """
    # Create a deterministic but varied score based on content hash
    content_hash = hashlib.sha256(text.encode()).hexdigest()
    hash_value = int(content_hash[:8], 16)

    # Base trust from content fingerprint
    base_trust = (hash_value % 100) / 100

    # Adjust based on text characteristics
    word_count = len(text.split())
    if word_count > 100:
        base_trust = min(base_trust + 0.1, 1.0)  # longer = slightly more trustworthy
    if word_count < 20:
        base_trust = max(base_trust - 0.1, 0.0)  # very short = less trustworthy

    # Check for citation-like patterns
    citation_patterns = [
        r"\(\d{4}\)",           # (2024)
        r"et\s+al\.?",         # et al.
        r"doi:",               # DOI references
        r"https?://",          # URLs
        r"\[\d+\]",            # [1], [2] style references
    ]
    citation_count = sum(1 for p in citation_patterns if re.search(p, text.lower()))
    base_trust = min(base_trust + (citation_count * 0.05), 1.0)

    return round(base_trust, 2)


def get_graph_score(text: str = "") -> dict:
    """
    Compute graph-based credibility score with factor breakdown.

    Returns:
        dict: { graph_score, factors: { source_credibility, pattern_similarity, network_trust } }
    """
    if not text:
        return {
            "graph_score": 0.5,
            "factors": {
                "source_credibility": 0.5,
                "pattern_similarity": 0.5,
                "network_trust": 0.5,
            },
        }

    source_cred = _compute_source_credibility(text)
    pattern_sim = _compute_pattern_similarity(text)
    network_trust = _compute_network_trust(text)

    # Weighted combination
    graph_score = round(
        0.35 * source_cred + 0.40 * pattern_sim + 0.25 * network_trust, 2
    )

    return {
        "graph_score": graph_score,
        "factors": {
            "source_credibility": round(source_cred, 2),
            "pattern_similarity": round(pattern_sim, 2),
            "network_trust": round(network_trust, 2),
        },
    }