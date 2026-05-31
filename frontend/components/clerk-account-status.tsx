"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";

import { ClerkGoogleLoginButton } from "@/components/clerk-google-login";

export function ClerkAccountStatus({ onEmail }: { onEmail?: (email: string) => void }) {
  const configured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!configured) {
    return (
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
        <p className="text-sm font-bold text-orange-950">Clerk not configured</p>
        <p className="mt-1 text-sm text-orange-800">
          Add your Clerk publishable and secret keys to enable real Google/Gmail authentication.
        </p>
      </div>
    );
  }

  return <ConfiguredClerkAccountStatus onEmail={onEmail} />;
}

function ConfiguredClerkAccountStatus({ onEmail }: { onEmail?: (email: string) => void }) {
  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (email && onEmail) {
      onEmail(email);
    }
  }, [email, onEmail]);

  return (
    <>
      {user ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm">
                <ShieldCheck className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">Clerk Google authentication active</p>
                <p className="text-xs text-slate-600">
                  {isLoaded ? email ?? "Signed in with Clerk" : "Loading Clerk account..."}
                </p>
              </div>
            </div>
            <UserButton />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-orange-950">Google sign-in required</p>
              <p className="mt-1 text-sm text-orange-800">Use Clerk to authenticate with Gmail before demo setup.</p>
            </div>
            <div className="[&_button]:bg-orange-600 [&_button]:px-4 [&_button]:py-2 [&_button]:text-white [&_button]:shadow-none [&_button:hover]:bg-orange-700">
              <ClerkGoogleLoginButton configured />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
