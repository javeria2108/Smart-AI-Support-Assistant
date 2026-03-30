import re

FALLBACK_ANSWER = "I don’t have enough information to answer that."


def _tokenize(text: str) -> set[str]:
    tokens = re.findall(r"[a-zA-Z0-9]+", text.lower())
    return {token for token in tokens if len(token) > 2}


def _split_candidates(context: str) -> list[str]:
    parts = re.split(r"[.\n!?]+", context)
    return [part.strip() for part in parts if part.strip()]


def answer_from_context(question: str, context: str) -> str:
    if not context.strip():
        return FALLBACK_ANSWER

    question_tokens = _tokenize(question)
    if not question_tokens:
        return FALLBACK_ANSWER

    best_score = 0
    best_candidate = ""

    for candidate in _split_candidates(context):
        candidate_tokens = _tokenize(candidate)
        score = len(question_tokens.intersection(candidate_tokens))
        if score > best_score:
            best_score = score
            best_candidate = candidate

    if best_score == 0:
        return FALLBACK_ANSWER

    return best_candidate