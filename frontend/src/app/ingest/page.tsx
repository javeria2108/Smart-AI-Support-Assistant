"use client";

import { FormEvent, useState } from "react";
import { ingestContent } from "@/lib/api";
import Link from "next/link";
import { FileUp, MessageCircle, Home, Send, FileText } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function IngestPage() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);
    setError(null);

    if (!text.trim() && !file) {
      setError("Please provide text or choose a file.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await ingestContent({ text, file });
      setResult(`${data.message} Total documents: ${data.total_documents}`);
      setText("");
      setFile(null);

      const fileInput = document.getElementById(
        "content-file",
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Something went wrong while ingesting content.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-green-400">
            Upload / Paste Content
          </h1>
          <FileUp className="h-6 w-6 text-green-400/60" />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm transition-colors hover:border-green-500 hover:bg-zinc-900 hover:text-green-400"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm transition-colors hover:border-green-500 hover:bg-zinc-900 hover:text-green-400"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </Link>
        </div>
        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6"
        >
          <label
            htmlFor="content-text"
            className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300"
          >
            <FileText className="h-4 w-4 text-green-400/60" />
            Paste support content
          </label>
          <textarea
            id="content-text"
            rows={10}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste policy, FAQ, assignment brief, etc."
            className="mb-6 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition-colors focus:border-green-500 focus:bg-zinc-950/80"
          />

          <label
            htmlFor="content-file"
            className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300"
          >
            <FileUp className="h-4 w-4 text-green-400/60" />
            Or upload .txt / .pdf
          </label>
          <input
            id="content-file"
            type="file"
            accept=".txt,.pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="mb-6 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm file:mr-4 file:rounded file:border-0 file:bg-green-500/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-green-400"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 text-sm font-medium text-zinc-950 transition-all hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/20 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="h-4 w-4" />
                Ingesting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Ingest Content
              </>
            )}
          </button>
        </form>

        {result && (
          <p className="mt-6 rounded-lg border border-green-700/50 bg-green-950/30 px-4 py-3 text-sm text-green-300">
            {result}
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-lg border border-red-700/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
