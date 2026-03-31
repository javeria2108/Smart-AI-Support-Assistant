import re

FALLBACK_ANSWER = "I don’t have enough information to answer that."

STOPWORDS = {
    "the",
    "is",
    "are",
    "for",
    "and",
    "with",
    "what",
    "when",
    "where",
    "how",
    "this",
    "that",
    "from",
    "your",
    "you",
    "have",
    "has",
    "will",
    "about",
    "into",
    "than",
}



def _tokenize(text: str) -> set[str]:
    raw_tokens = re.findall(r"[a-zA-Z0-9]+", text.lower())
    tokens = {token.lower() for token in raw_tokens if len(token) > 2}
    cleaned = {token for token in tokens if token and token not in STOPWORDS}
    return cleaned


def _split_candidates(context: str) -> list[str]:
    normalized = context.replace("\r\n", "\n")
    blocks = [block.strip() for block in re.split(r"\n\s*\n+", normalized) if block.strip()]

    candidates: list[str] = []
    for block in blocks:
        compact = re.sub(r"\s+", " ", block).strip()
        if len(compact) <= 900:
            candidates.append(compact)
            continue

        sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", compact) if s.strip()]
        if not sentences:
            continue

        window_size = 3
        for i in range(len(sentences)):
            window = " ".join(sentences[i : i + window_size]).strip()
            if window:
                candidates.append(window)

    if candidates:
        return candidates

    parts = re.split(r"(?<=[.!?])\s+|\n+", normalized)
    return [part.strip() for part in parts if part.strip()]


def get_top_context_chunks(question: str, context: str, top_k: int = 3) -> list[str]:
    """Rank context chunks by lightweight lexical heuristics and return the top matches.

    Scoring rules:
    - Token overlap: primary relevance signal.
    - Coverage ratio: favors chunks covering more of the query terms.
    - Length bonus: prefers concise, answer-like chunks.
    - Submission-intent bonus: boosts assignment/submission related chunks.
    """
    if not context.strip():
        return []

    question_tokens = _tokenize(question)
    if not question_tokens:
        return []

    question_lower = question.lower()
    asks_submission = any(word in question_lower for word in ["submission", "submit", "requirement"])

    scored: list[tuple[float, str]] = []
    for candidate in _split_candidates(context):
        candidate_lower = candidate.lower()
        candidate_tokens = _tokenize(candidate)
        overlap_count = len(question_tokens.intersection(candidate_tokens))
        if overlap_count == 0:
            continue

        # Rule 1: token overlap is the strongest retrieval signal.
        coverage = overlap_count / max(len(question_tokens), 1)
        score = (overlap_count * 2.0) + coverage

        # Rule 2: small-to-medium chunks are often cleaner direct answers.
        if 40 <= len(candidate) <= 260:
            score += 0.5

        # Rule 3: intent-aware boost for assignment/submission style questions.
        if asks_submission and any(
            keyword in candidate_lower
            for keyword in ["submission", "submit", "requirement", "github", "loom", "repository", "video"]
        ):
            score += 2.0

        scored.append((score, candidate))

    scored.sort(key=lambda item: item[0], reverse=True)
    return [candidate for _, candidate in scored[:top_k]]


def build_context_for_llm(question: str, context: str, top_k: int = 3, max_chars: int = 12000) -> str:
    clean_context = context.strip()
    if not clean_context:
        return ""

    if len(clean_context) <= max_chars:
        return clean_context

    top_chunks = get_top_context_chunks(question, clean_context, top_k=max(top_k, 20))
    if not top_chunks:
        return ""

    selected: list[str] = []
    total_chars = 0
    for chunk in top_chunks:
        entry = f"- {chunk}"
        entry_len = len(entry) + 1

        if selected and total_chars + entry_len > max_chars:
            break

        if not selected and entry_len > max_chars:
            selected.append(entry[:max_chars])
            break

        selected.append(entry)
        total_chars += entry_len

    return "\n".join(selected)


def is_fallback_like(answer: str) -> bool:
    normalized = re.sub(r"[^a-z0-9\s]", "", answer.lower()).strip()
    checks = [
        "i dont have enough information to answer that",
        "i do not have enough information to answer that",
        "dont have enough information",
        "do not have enough information",
        "not enough information",
    ]
    return any(phrase in normalized for phrase in checks)


def fallback_answer_from_chunks(question: str, top_chunks: list[str]) -> str:
    if not top_chunks:
        return FALLBACK_ANSWER

    question_lower = question.lower()
    asks_submission = any(word in question_lower for word in ["submission", "submit", "requirement"])

    if asks_submission:
        selected = top_chunks[:3]
        return "Based on the provided content, submission requirements include: " + "; ".join(selected)

    selected = top_chunks[:2]
    return "Based on the provided content: " + " ".join(selected)