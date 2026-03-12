"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth-context";

export default function SignInPage() {
  const router = useRouter();
  const { user, isReady, signInWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (isReady && user) {
      router.replace("/assistant");
    }
  }, [isReady, user, router]);

  async function submit() {
    setPending(true);
    setStatus(null);
    try {
      if (mode === "signup") {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      router.push("/assistant");
    } catch (caughtError) {
      setStatus(caughtError instanceof Error ? caughtError.message : "Auth failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="onpoint-shell flex min-h-screen items-center justify-center px-4 py-8">
      <section className="onpoint-card w-full max-w-md border-gold/30 p-6 shadow-[0_0_0_1px_rgba(200,162,77,0.15),0_20px_60px_rgba(0,0,0,0.5)] md:p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">On Point</p>
        <h1 className="mt-2 text-3xl font-semibold">{mode === "signup" ? "Create account" : "Log in"}</h1>
        <p className="mt-2 text-sm text-zinc-300">
          Use your email to access your planner workspace.
        </p>

        <div className="mt-6 space-y-3 text-sm">
          <div>
            <label htmlFor="email" className="text-zinc-300">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-surface-border bg-surface px-3 py-2"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-zinc-300">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-surface-border bg-surface px-3 py-2"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={() => void submit()}
            className="w-full rounded-lg border border-gold bg-gold/15 px-4 py-2.5 font-medium text-gold-strong disabled:opacity-60"
          >
            {pending ? "Please wait..." : mode === "signup" ? "Sign up" : "Log in"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMode((prev) => (prev === "login" ? "signup" : "login"))}
          className="mt-3 text-xs text-zinc-300 underline-offset-4 hover:underline"
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>

        {status ? <p className="mt-2 text-xs text-red-300">{status}</p> : null}

        <p className="mt-3 text-xs text-zinc-400">MVP auth uses secure local session storage in-browser for now.</p>

        <div className="mt-5 flex items-center justify-end text-sm">
          <Link href="/assistant" className="text-gold-strong underline-offset-4 hover:underline">
            Continue to app
          </Link>
        </div>
      </section>
    </main>
  );
}
