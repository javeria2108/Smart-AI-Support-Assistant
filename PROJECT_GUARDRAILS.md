# Smart AI Support Assistant — Build Guardrails & Evaluation Checklist

This file captures the mandatory instructions and evaluation focus for this project.
Use it as the single source of truth during implementation, review, and demo prep.

## 1) Teaching & Collaboration Rules (Mandatory)

1. Never build the full project at once.
2. Break work into small, incremental steps.
3. After each step:
   - Explain the concept in simple terms.
   - Explain **why** the step matters.
   - Show only the code for that step.
   - Wait for implementation confirmation before moving on.
4. Assume beginner-level Python backend knowledge.
5. Use simple analogies for backend/AI concepts.
6. Highlight common beginner mistakes.
7. Keep code clean, minimal, and avoid overengineering.
8. If something is complex, provide the easier alternative first.
9. Occasionally include short quizzes to check understanding.
10. Encourage reasoning before giving direct answers.

## 2) Project Scope (Must-Have)

### Frontend

- Next.js + Tailwind CSS
- Page 1: Upload/Paste content
- Page 2: Chat UI
- Theme direction: neon dark green + gray (clean UX)

### Backend

- Python backend framework: **FastAPI** (chosen for learning + structure + docs)
- APIs:
  - `POST /ingest` → store/process content
  - `POST /ask` → answer questions from ingested content

### AI Logic

- Start with simple prompt-based constrained answering.
- Optional upgrade to basic RAG:
  - chunking
  - embeddings
  - retrieval
- Hard requirement:
  - Answer only from provided content.
  - If answer not found, return exactly:
    - `I don’t have enough information to answer that.`

## 3) Delivery Phases

### PHASE 1: Backend Basics

- Project setup
- First API
- Request/response understanding

### PHASE 2: Ingest API

- Accept text and file
- Store content (simple approach first)

### PHASE 3: AI Logic

- Prompt-based baseline first
- Optional RAG upgrade

### PHASE 4: Ask API

- Connect question → context → answer

### PHASE 5: Frontend

- Build input page
- Build chat page
- Integrate APIs

### PHASE 6: Improvements

- Error handling
- Better UX
- Edge cases

## 4) Evaluation Criteria (High Priority)

## Frontend

- UI/UX quality
- Responsiveness
- Component structure

## Backend

- API design
- Code clarity
- Error handling

## AI/ML Understanding (Most Important)

- Use of context-aware responses
- Prompt design or retrieval logic
- Handling of edge cases

## Code Quality

- Clean, readable, modular code
- Proper naming conventions

## Communication

- Clarity and confidence in Loom walkthrough

## Bonus Points (Optional)

- Deployment (Vercel, Render, etc.)
- Streaming responses (typing effect)
- Highlighting source/context used in answers
- Basic chat memory
- Use of tools like LangChain or LlamaIndex

## 5) Important Notes

- Keep solution simple but well-structured.
- Avoid unnecessary complexity.
- Make sure every line can be explained clearly.
- Submission without Loom video will not be considered.

## 6) Submission Checklist

- GitHub repository link
- Loom video link

## 7) Final Review Questions (Before Submission)

1. Can I explain every API endpoint and schema in simple language?
2. Can I justify why the assistant refused answers not in context?
3. Can I explain prompt design (or retrieval design) trade-offs?
4. Is the UI responsive and easy to use on smaller screens?
5. Are errors user-friendly on both frontend and backend?
6. Is the code modular, readable, and consistently named?

## 8) Development Principles for This Project

- Build smallest useful version first, then iterate.
- Prefer explicit logic over magic abstractions.
- Validate inputs early and fail with clear messages.
- Keep backend and frontend contracts explicit and typed.
- Add complexity only when the simpler path is working.
