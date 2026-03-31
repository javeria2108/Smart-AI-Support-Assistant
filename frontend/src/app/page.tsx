import Link from "next/link";
import { FileUp, MessageCircle, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-500/10 p-3">
              <Zap className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-green-400">
            Smart AI Support Assistant
          </h1>
          <p className="mx-auto max-w-2xl text-base text-zinc-400">
            Upload your documentation, policies, or FAQs. Then ask AI-powered
            questions and get instant answers grounded in your content.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
            <div className="mb-3 flex justify-center">
              <FileUp className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="mb-1 font-semibold text-zinc-100">1. Ingest Content</h3>
            <p className="text-xs text-zinc-400">
              Upload PDFs, TXT files, or paste text directly.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
            <div className="mb-3 flex justify-center">
              <Zap className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="mb-1 font-semibold text-zinc-100">2. Process with AI</h3>
            <p className="text-xs text-zinc-400">
              Content is indexed and ready for queries.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
            <div className="mb-3 flex justify-center">
              <MessageCircle className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="mb-1 font-semibold text-zinc-100">3. Ask Questions</h3>
            <p className="text-xs text-zinc-400">
              Get contextual answers from your documents.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/ingest"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-zinc-950 transition-all hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/20"
          >
            <FileUp className="h-5 w-5" />
            Start Ingesting
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 font-medium transition-all hover:border-green-500 hover:bg-zinc-900 hover:text-green-400"
          >
            <MessageCircle className="h-5 w-5" />
            Go to Chat
          </Link>
        </div>
      </div>
    </main>
  );
}
