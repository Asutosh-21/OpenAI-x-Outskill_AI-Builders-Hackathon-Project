import {
  Bell,
  CheckCircle2,
  ChevronRight,
  LockKeyhole,
  Mail,
  PlugZap,
  ShieldCheck,
  Store,
} from "lucide-react";

import { ClerkGoogleLoginButton } from "@/components/clerk-google-login";

const steps = [
  { title: "Sign in with Google", caption: "Use verified Gmail or Google Workspace identity.", icon: LockKeyhole },
  { title: "Create Organization", caption: "Set workspace name, owner, timezone, and city clusters.", icon: Store },
  { title: "Connect Marketplaces", caption: "Attach Blinkit, Zepto, and Instamart operating data.", icon: PlugZap },
  { title: "Configure Alerts", caption: "Route stockout, ad waste, returns, and pooling email alerts.", icon: Bell },
  { title: "Open Command Center", caption: "Launch the quick-commerce operating console.", icon: ShieldCheck },
];

export default function LoginPage() {
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400 text-sm font-black text-slate-950">
              SS
            </div>
            <div>
              <p className="text-sm font-bold">ShelfSync AI</p>
              <p className="text-xs text-slate-400">Quick-commerce command center</p>
            </div>
          </div>
          <a href="/settings" className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
            Setup dashboard
          </a>
        </nav>

        <section className="grid flex-1 gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-200">
              <Mail className="h-3.5 w-3.5" />
              Google-authenticated MVP
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl">
              Launch quick-commerce operations with verified Google sign-in.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Sign in with Gmail, create your organization, connect marketplaces, configure alert emails, and open the Command Center for Blinkit, Zepto, and Instamart operations.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ClerkGoogleLoginButton configured={clerkConfigured} />
              <a
                href="/settings"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                View setup demo
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            {!clerkConfigured && (
              <div className="mt-5 rounded-lg border border-orange-300/30 bg-orange-400/10 p-4 text-sm text-orange-100">
                Clerk is not configured yet. Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to `frontend/.env.local`, then enable Google as a social provider in Clerk.
              </div>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur">
            <div className="rounded-lg border border-white/10 bg-slate-900 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-bold text-white">MVP onboarding workflow</p>
                  <p className="mt-1 text-xs text-slate-400">Real Google identity before workspace setup.</p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
                  Secure
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-950">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">0{index + 1}</span>
                          <h2 className="text-sm font-bold text-white">{step.title}</h2>
                          {index === 0 && clerkConfigured ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : null}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{step.caption}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
