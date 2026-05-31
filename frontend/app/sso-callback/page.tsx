"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SsoCallbackPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
        <p className="mt-4 text-sm font-semibold">
          {configured ? "Finishing Google sign-in..." : "Clerk keys are required for Google sign-in."}
        </p>
      </div>
      {configured && (
        <AuthenticateWithRedirectCallback
          signInForceRedirectUrl="/settings?auth=clerk"
          signUpForceRedirectUrl="/settings?auth=clerk"
        />
      )}
    </div>
  );
}
