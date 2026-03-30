"use client";

import { FormEvent, useState } from "react";
import { ingestContent } from "@/lib/api";
import Link from "next/link";

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
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-semibold text-green-400">
          Upload / Paste Content
        </h1>

        <div className="mb-4 flex gap-2">
          <Link
            href="/"
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-900"
          >
            Home
          </Link>
          <Link
            href="/chat"
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-900"
          >
            Chat
          </Link>
        </div>
        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-zinc-800 bg-zinc-900 p-5"
        >
          <label
            htmlFor="content-text"
            className="mb-2 block text-sm text-zinc-300"
          >
            Paste support content
          </label>
          <textarea
            id="content-text"
            rows={10}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste policy, FAQ, assignment brief, etc."
            className="mb-4 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-green-500"
          />

          <label
            htmlFor="content-file"
            className="mb-2 block text-sm text-zinc-300"
          >
            Or upload .txt / .pdf
          </label>
          <input
            id="content-file"
            type="file"
            accept=".txt,.pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="mb-4 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-zinc-950 disabled:opacity-60"
          >
            {isSubmitting ? "Ingesting..." : "Ingest Content"}
          </button>
        </form>

        {result && (
          <p className="mt-4 rounded-md border border-green-700 bg-green-950/40 px-4 py-3 text-sm text-green-300">
            {result}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-md border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
