# Smart AI Support Assistant

A full-stack MVP that ingests support content (text/PDF/TXT) and answers user questions using context-aware retrieval + Gemini.

## Setup Instructions

### 1) Clone and open

```bash
git clone https://github.com/javeria2108/Smart-AI-Support-Assistant.git
cd Smart-AI-Support-Assistant
```

---

### 2) Backend setup (FastAPI)

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
# Optional
GEMINI_MODEL=gemini-3-flash-preview
# Optional CORS settings for deployed frontend
FRONTEND_URL=https://your-frontend-url.vercel.app
# OR comma-separated list
CORS_ALLOW_ORIGINS=https://your-frontend-url.vercel.app,https://www.your-custom-domain.com
```

Run backend:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend endpoints:
- `GET /health`
- `POST /ingest`
- `POST /ask`

---

### 3) Frontend setup (Next.js)

```bash
cd ../frontend
npm install
```

Create `frontend/.env.local`:

```env
# Local backend
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

# If backend is deployed (example)
# NEXT_PUBLIC_API_BASE_URL=https://smart-ai-support-assistant-897b.onrender.com
```

Run frontend:

```bash
npm run dev
```

Open: `http://localhost:3000`

---

### 4) Basic usage flow

1. Open Ingest page and upload/paste support content.
2. Open Chat page and ask a question.
3. The answer is generated only from ingested context.

## Tech Stack Used

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React icons

### Backend
- FastAPI
- Pydantic
- Uvicorn
- Python-dotenv
- PyPDF
- Google GenAI SDK (`google-genai`)

### Deployment
- Frontend: Vercel
- Backend: Render

## Assumptions Made

- This is an MVP focused on evaluation criteria, not full production hardening.
- Knowledge is stored in memory (no persistent database); restarting backend clears ingested documents.
- Single primary knowledge store is shared per running backend instance.
- Authentication/authorization is out of scope for this version.
- Retrieval is heuristic/token-overlap based (not vector embeddings).
- Gemini API key is provided via environment variables.
- CORS is configured for localhost by default and can be extended through env vars.

## Notes

- If deployed backend/frontend URLs change, update env vars and redeploy.
- For demo stability, ingest representative content before testing chat quality.
