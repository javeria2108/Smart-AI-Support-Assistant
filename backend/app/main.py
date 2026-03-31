from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from typing import Optional
from pathlib import Path
import logging
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import IngestResponse, AskRequest, AskResponse
from app.store import store
from app.file_extractors import extract_text_from_upload, FileExtractionError
from app.qa_engine import (
    FALLBACK_ANSWER,
    build_context_for_llm,
    get_top_context_chunks,
    is_fallback_like,
    fallback_answer_from_chunks,
)
from app.llm_service import generate_answer_with_prompt

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

env_path = Path(__file__).resolve().parents[1] / ".env.local"
load_dotenv(env_path)


def _normalize_origin(origin: str) -> str:
    return origin.strip().rstrip("/")


def _build_allowed_origins() -> list[str]:
    origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    cors_allow_origins = os.getenv("CORS_ALLOW_ORIGINS", "")
    if cors_allow_origins.strip():
        origins.extend(
            _normalize_origin(item)
            for item in cors_allow_origins.split(",")
            if item.strip()
        )

    frontend_url = os.getenv("FRONTEND_URL", "")
    if frontend_url.strip():
        origins.append(_normalize_origin(frontend_url))

    vercel_url = os.getenv("VERCEL_URL", "")
    if vercel_url.strip():
        cleaned_vercel = vercel_url.strip().replace("https://", "").replace("http://", "")
        origins.append(f"https://{cleaned_vercel.rstrip('/')}")

    unique_origins: list[str] = []
    for origin in origins:
        normalized = _normalize_origin(origin)
        if normalized and normalized not in unique_origins:
            unique_origins.append(normalized)

    return unique_origins


CORS_ALLOWED_ORIGINS = _build_allowed_origins()

app = FastAPI(title="Smart AI Support Assistant API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ingest", response_model=IngestResponse)
async def ingest_content(
    text: Optional[str] = Form(default=None),
    file: Optional[UploadFile] = File(default=None),
):
    """Ingest support content from pasted text or a .txt/.pdf file into the in-memory knowledge store."""
    collected_parts: list[str] = []

    if text and text.strip():
        collected_parts.append(text.strip())

    if file is not None:
        try:
            extracted_text = await extract_text_from_upload(file)
            if extracted_text:
                collected_parts.append(extracted_text)
        except FileExtractionError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

    if not collected_parts:
        raise HTTPException(status_code=400, detail="Provide non-empty text or a non-empty file.")

    merged_content = "\n\n".join(collected_parts)
    total = store.add_text(merged_content)

    return IngestResponse(
        message="Content ingested successfully.",
        total_documents=total,
    )


@app.post("/ask", response_model=AskResponse)
def ask_question(payload: AskRequest):
    """Answer user questions using only ingested context."""
    logger.info("/ask received | question_chars=%d", len(payload.question))
    context = store.get_all_text()

    top_chunks = get_top_context_chunks(payload.question, context, top_k=12)
    if not top_chunks:
        logger.info("/ask retrieval_result=fallback")
        return AskResponse(answer=FALLBACK_ANSWER)

    llm_context = build_context_for_llm(payload.question, context, top_k=12, max_chars=12000)
    logger.info("/ask retrieval_result=hit | context_chars=%d", len(llm_context))
    final_answer = generate_answer_with_prompt(payload.question, llm_context)
    if is_fallback_like(final_answer):
        logger.warning("/ask llm_returned_fallback_like_despite_retrieval_hit | using_chunk_based_fallback")
        return AskResponse(answer=fallback_answer_from_chunks(payload.question, top_chunks))

    logger.info("/ask final_answer_chars=%d", len(final_answer))
    return AskResponse(answer=final_answer)


@app.get("/health")
def health_check():
    """Return a simple health status to confirm the API is running."""
    return {"status": "ok"}