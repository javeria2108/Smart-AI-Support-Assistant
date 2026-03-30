"use client";

import { FormEvent, useState } from "react";
import { askQuestion } from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanQuestion = question.trim();
    if (!cleanQuestion || isLoading) return;

    setError(null);
    setMessages((current) => [
      ...current,
      { role: "user", text: cleanQuestion },
    ]);
    setQuestion("");
    setIsLoading(true);

    try {
      const data = await askQuestion(cleanQuestion);
      setMessages((current) => [
        ...current,
        { role: "assistant", text: data.answer },
      ]);
    } catch {
      setError("Could not get answer from backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="mb-4 text-2xl font-semibold text-green-400">
          Chat Assistant
        </h1>

        <section className="mb-4 flex min-h-[420px] flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-zinc-400">
              Ask a question based on your ingested content.
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[80%] rounded-md bg-green-500 px-3 py-2 text-sm text-zinc-950"
                    : "mr-auto max-w-[80%] rounded-md bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
                }
              >
                {message.text}
              </div>
            ))
          )}
          {isLoading && <p className="text-sm text-zinc-400">Thinking...</p>}
        </section>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask your question..."
            className="h-11 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm outline-none focus:border-green-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 rounded-md bg-green-500 px-5 text-sm font-medium text-zinc-950 disabled:opacity-60"
          >
            Send
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-md border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
