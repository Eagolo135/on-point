"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/assistant");
  }, [router]);

  return (
    <main className="onpoint-shell flex min-h-screen items-center justify-center px-4 py-8 text-center">
      <div className="onpoint-card max-w-md p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">On Point</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading workspace...</h1>
        <p className="mt-2 text-sm text-zinc-300">If redirect takes too long, open the assistant directly.</p>
        <Link href="/assistant" className="mt-4 inline-block text-sm text-gold-strong underline-offset-4 hover:underline">
          Go to assistant
        </Link>
      </div>
    </main>
  );
}
