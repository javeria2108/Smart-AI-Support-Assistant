from pydantic import BaseModel


class IngestResponse(BaseModel):
    message: str
    total_documents: int