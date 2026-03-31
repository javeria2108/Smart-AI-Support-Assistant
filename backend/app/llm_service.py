import os
import logging
from google import genai

from app.qa_engine import FALLBACK_ANSWER

logger = logging.getLogger(__name__)


def generate_answer_with_prompt(question: str, context_snippet: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY missing | returning fallback answer")
        return FALLBACK_ANSWER

    client = genai.Client(api_key=api_key)
    model_name = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")

    system_prompt = (
        "You are a support assistant. Use ONLY the provided context.\n"
        "If the context contains relevant information, answer from it directly and clearly.\n"
        "Treat equivalent wording and synonyms as valid.\n"
        "If the answer is not present in context, reply exactly:\n"
        f"{FALLBACK_ANSWER}"
    )

    user_prompt = (
        f"{system_prompt}\n\n"
        f"Context:\n{context_snippet}\n\n"
        f"Question:\n{question}\n\n"
        "Answer briefly and clearly."
    )

    try:
        logger.info(
            "Calling Gemini | model=%s | context_chars=%d | question_chars=%d",
            model_name,
            len(context_snippet),
            len(question),
        )
        response = client.models.generate_content(
            model=model_name,
            contents=user_prompt,
            config={"temperature": 0},
        )
    except Exception:
        logger.exception("Gemini call failed | returning fallback answer")
        return FALLBACK_ANSWER

    answer = (response.text or "").strip()
    if not answer:
        logger.warning("Gemini returned empty text | returning fallback answer")
        return FALLBACK_ANSWER

    logger.info("Gemini returned text | answer_chars=%d", len(answer))
    return answer