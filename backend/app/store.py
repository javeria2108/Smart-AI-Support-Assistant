from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List

@dataclass
class KnowledgeStore:
    documents: List[str] = field(default_factory=list)
    last_updated: datetime | None = None

    def add_text(self, text: str) -> int:
        cleaned = text.strip()
        if not cleaned:
            raise ValueError("Empty text is not allowed")
        self.documents.append(cleaned)
        self.last_updated = datetime.now(timezone.utc)
        return len(self.documents)
    
    def get_all_text(self) -> str:
        return "\n\n".join(self.documents)

store = KnowledgeStore()    
