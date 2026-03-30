from io import BytesIO
from fastapi import UploadFile
from pypdf import PdfReader


class FileExtractionError(ValueError):
    pass


async def extract_text_from_upload(file: UploadFile) -> str:
    content_type = (file.content_type or "").lower()
    filename = (file.filename or "").lower()

    raw_bytes = await file.read()
    if not raw_bytes:
        raise FileExtractionError("Uploaded file is empty.")

    if content_type == "text/plain" or filename.endswith(".txt"):
        return raw_bytes.decode("utf-8", errors="ignore").strip()

    if content_type == "application/pdf" or filename.endswith(".pdf"):
        reader = PdfReader(BytesIO(raw_bytes))
        pages_text = [page.extract_text() or "" for page in reader.pages]
        combined = "\n".join(pages_text).strip()
        if not combined:
            raise FileExtractionError("Could not extract text from PDF.")
        return combined

    raise FileExtractionError("Only .txt and .pdf files are supported.")