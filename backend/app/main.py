from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from typing import Optional

from app.schemas import IngestResponse, AskRequest, AskResponse
from app.store import store
from app.file_extractors import extract_text_from_upload, FileExtractionError
from app.qa_engine import answer_from_context

app = FastAPI(title="Smart AI Support Assistant API")


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
    context = store.get_all_text()
    answer = answer_from_context(payload.question, context)
    return AskResponse(answer=answer)


@app.get("/health")
def health_check():
    """Return a simple health status to confirm the API is running."""
    return {"status": "ok"}