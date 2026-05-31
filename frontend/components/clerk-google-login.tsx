"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";

export function ClerkGoogleLoginButton({ configured }: { configured: boolean }) {
  if (!configured) {
    return (
      <button
        disabled
        className="inline-flex cursor-not-allowed items-center justify-center gap-3 rounded-lg bg-slate-700 px-5 py-3 text-sm font-bold text-slate-300"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded bg-white text-base font-black text-blue-700">
          G
        </span>
        Configure Clerk to sign in
      </button>
    );
  }

  return <ConfiguredClerkGoogleLoginButton />;
}

function ConfiguredClerkGoogleLoginButton() {
  const { signIn, fetchStatus } = useSignIn();
  const [isStarting, setIsStarting] = useState(false);

  const startGoogleSignIn = async () => {
    if (!signIn || fetchStatus === "fetching") return;
    setIsStarting(true);
    try {
      await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: "/settings?auth=clerk",
        redirectCallbackUrl: "/sso-callback",
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <button
      onClick={startGoogleSignIn}
      disabled={fetchStatus === "fetching" || isStarting}
      className="inline-flex items-center justify-center gap-3 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-70"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded bg-white text-base font-black text-blue-700">
        G
      </span>
      {isStarting ? "Opening Google..." : "Sign in with Google"}
    </button>
  );
}
