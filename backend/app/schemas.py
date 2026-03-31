from pydantic import BaseModel, Field


class IngestResponse(BaseModel):
    message: str
    total_documents: int


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000, description="User question")


class AskResponse(BaseModel):
    answer: str


class ErrorResponse(BaseModel):
    detail: str