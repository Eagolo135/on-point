import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="onpoint-shell flex min-h-screen items-center justify-center px-4 py-8">
      <section className="onpoint-card w-full max-w-md p-6 md:p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">On Point</p>
        <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-zinc-300">
          Start focused planning with a realistic daily schedule.
        </p>

        <button
          type="button"
          className="mt-6 w-full rounded-lg border border-gold bg-gold/15 px-4 py-2.5 text-sm font-medium text-gold-strong"
        >
          Continue with Google (Mock)
        </button>

        <p className="mt-3 text-xs text-zinc-400">
          MVP note: Google OAuth is a placeholder for now. Backend auth is not connected yet.
        </p>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/onboarding" className="text-zinc-300 underline-offset-4 hover:underline">
            New here? Start onboarding
          </Link>
          <Link href="/dashboard" className="text-gold-strong underline-offset-4 hover:underline">
            Skip for demo
          </Link>
        </div>
      </section>
    </main>
  );
}
