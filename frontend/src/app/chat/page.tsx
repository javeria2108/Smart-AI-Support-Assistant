"use client";

import { FormEvent, useState } from "react";
import { askQuestion } from "@/lib/api";
import { Home, Upload, Send, MessageCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import PageHeader from "@/components/ui/page-header";
import StatusBanner from "@/components/ui/status-banner";

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
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Could not get answer from backend.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        <PageHeader
          title="Chat Assistant"
          TitleIcon={MessageCircle}
          navItems={[
            { href: "/", label: "Home", icon: Home },
            { href: "/ingest", label: "Ingest", icon: Upload },
          ]}
        />
        <section className="mb-6 flex h-[55vh] min-h-[380px] flex-col gap-3 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 sm:min-h-[440px]">
          {messages.length === 0 ? (
            <p className="inline-flex items-center gap-2 text-sm text-zinc-400">
              <MessageCircle className="h-4 w-4" />
              Ask a question based on your ingested content.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[80%] rounded-lg bg-green-500 px-4 py-3 text-sm text-zinc-950 shadow-lg"
                        : "max-w-[80%] rounded-lg bg-zinc-800 px-4 py-3 text-sm text-zinc-100 shadow-lg"
                    }
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          )}
          {isLoading && <p className="text-sm text-zinc-400">Thinking...</p>}
        </section>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask your question..."
            className="h-11 flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none transition-colors focus:border-green-500 focus:bg-zinc-900/80"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green-500 px-6 font-medium text-zinc-950 transition-all hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/20 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="h-4 w-4" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send
              </>
            )}
          </button>
        </form>

        {error && (
          <StatusBanner type="error" message={error} />
        )}
      </div>
    </main>
  );
}
