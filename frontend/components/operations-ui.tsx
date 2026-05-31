import type { LucideIcon } from "lucide-react";

export type OperationTone = "emerald" | "blue" | "amber" | "orange" | "red" | "violet" | "teal" | "slate";

const toneStyles: Record<OperationTone, { icon: string; card: string; accent: string; text: string }> = {
  emerald: {
    icon: "border-emerald-200 bg-emerald-50 text-emerald-700",
    card: "border-emerald-200 bg-emerald-50",
    accent: "from-emerald-500 to-lime-400",
    text: "text-emerald-700",
  },
  blue: {
    icon: "border-blue-200 bg-blue-50 text-blue-700",
    card: "border-blue-200 bg-blue-50",
    accent: "from-blue-500 to-cyan-400",
    text: "text-blue-700",
  },
  amber: {
    icon: "border-amber-200 bg-amber-50 text-amber-700",
    card: "border-amber-200 bg-amber-50",
    accent: "from-amber-500 to-yellow-400",
    text: "text-amber-700",
  },
  orange: {
    icon: "border-orange-200 bg-orange-50 text-orange-700",
    card: "border-orange-200 bg-orange-50",
    accent: "from-orange-500 to-amber-400",
    text: "text-orange-700",
  },
  red: {
    icon: "border-red-200 bg-red-50 text-red-700",
    card: "border-red-200 bg-red-50",
    accent: "from-red-500 to-rose-400",
    text: "text-red-700",
  },
  violet: {
    icon: "border-violet-200 bg-violet-50 text-violet-700",
    card: "border-violet-200 bg-violet-50",
    accent: "from-violet-500 to-fuchsia-400",
    text: "text-violet-700",
  },
  teal: {
    icon: "border-teal-200 bg-teal-50 text-teal-700",
    card: "border-teal-200 bg-teal-50",
    accent: "from-teal-500 to-cyan-400",
    text: "text-teal-700",
  },
  slate: {
    icon: "border-slate-200 bg-slate-50 text-slate-700",
    card: "border-slate-200 bg-slate-50",
    accent: "from-slate-700 to-slate-500",
    text: "text-slate-700",
  },
};

export function OperationPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f6f8] text-slate-950">
      <div className="mx-auto w-full max-w-[1800px] space-y-6 p-4 md:p-6 xl:p-8">{children}</div>
    </div>
  );
}

export function OperationHero({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/10">
      <div className="relative min-w-0 overflow-hidden p-5 sm:p-6 xl:p-8">
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative flex min-w-0 flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-lime-200">
                <Icon className="h-3.5 w-3.5" />
                {eyebrow}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
                Enterprise ops
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-300 md:text-base">{description}</p>
          </div>
          {children ? <div className="min-w-0 shrink-0">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function OperationKpiCard({
  icon: Icon,
  label,
  value,
  caption,
  tone = "blue",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  caption?: string;
  tone?: OperationTone;
}) {
  const style = toneStyles[tone];

  return (
    <div className="group relative min-h-[160px] overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl">
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${style.accent}`} />
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${style.accent} opacity-10 transition group-hover:opacity-20`} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">{value}</p>
          {caption ? <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{caption}</p> : null}
        </div>
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg border shadow-lg ${style.icon}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

export function OperationPanel({
  icon: Icon,
  title,
  caption,
  children,
  className = "",
}: {
  icon?: LucideIcon;
  title?: string;
  caption?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-black/[0.02] md:p-6 ${className}`}>
      {title ? (
        <div className="mb-5 flex items-start gap-3">
          {Icon ? (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 shadow-sm">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
          <div>
            <h2 className="text-base font-black text-slate-950">{title}</h2>
            {caption ? <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{caption}</p> : null}
          </div>
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function OperationSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white shadow-sm outline-none backdrop-blur transition focus:border-lime-300/60 focus:ring-2 focus:ring-lime-300/20 xl:min-w-64 [&_option]:bg-slate-950 [&_option]:text-white"
    >
      {children}
    </select>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const classes =
    severity === "critical"
      ? "border-red-200 bg-red-50 text-red-700"
      : severity === "high"
      ? "border-orange-200 bg-orange-50 text-orange-700"
      : severity === "medium"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black uppercase ${classes}`}>{severity}</span>;
}

export function PlatformBadge({ platform }: { platform: string }) {
  const classes =
    platform === "Blinkit"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : platform === "Zepto"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : platform === "Instamart"
      ? "border-orange-200 bg-orange-50 text-orange-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${classes}`}>{platform}</span>;
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex h-screen items-center justify-center bg-[#f3f6f8]">
      <div className="rounded-lg border border-slate-200 bg-white px-10 py-9 text-center shadow-sm">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-lime-100 border-t-lime-600" />
        <p className="mt-5 text-sm font-black text-slate-800">{label}</p>
      </div>
    </div>
  );
}

export function ErrorState({ label }: { label: string }) {
  return (
    <div className="flex h-screen items-center justify-center bg-[#fff7ed] p-6">
      <div className="max-w-md rounded-lg border border-red-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-black text-red-950">{label}</p>
      </div>
    </div>
  );
}
