"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="onpoint-shell flex min-h-screen items-center justify-center px-4 py-8 text-foreground">
      <div className="onpoint-card w-full max-w-md p-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">On Point</p>
        <h1 className="mt-2 text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-zinc-300">
          The app hit an unexpected client error. Try again, or reload this page.
        </p>
        {error?.message ? <p className="mt-2 text-xs text-zinc-400">{error.message}</p> : null}
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={reset}
            className="rounded-md border border-gold bg-gold/15 px-3 py-2 text-xs text-gold-strong"
          >
            Try again
          </button>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="rounded-md border border-surface-border px-3 py-2 text-xs text-zinc-200"
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}
