const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export type IngestResponse = {
  message: string;
  total_documents: number;
};

export type AskResponse = {
  answer: string;
};

export async function ingestContent(input: {
  text?: string;
  file?: File | null;
}): Promise<IngestResponse> {
  const formData = new FormData();

  if (input.text?.trim()) {
    formData.append("text", input.text.trim());
  }

  if (input.file) {
    formData.append("file", input.file);
  }

  const response = await fetch(`${API_BASE_URL}/ingest`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = "Failed to ingest content.";
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.detail === "string") {
        message = errorBody.detail;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return (await response.json()) as IngestResponse;
}

export async function askQuestion(question: string): Promise<AskResponse> {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error("Failed to get answer.");
  }

  return (await response.json()) as AskResponse;
}
