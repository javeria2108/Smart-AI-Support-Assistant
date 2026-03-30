import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-3 text-3xl font-semibold text-green-400">
          Smart AI Support Assistant
        </h1>
        <p className="mb-8 text-sm text-zinc-400">
          Ingest content first, then ask questions from that context.
        </p>

        <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
          <Link
            href="/ingest"
            className="flex-1 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-zinc-950"
          >
            Go to Ingest
          </Link>
          <Link
            href="/chat"
            className="flex-1 rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
          >
            Go to Chat
          </Link>
        </div>
      </div>
    </main>
  );
}
