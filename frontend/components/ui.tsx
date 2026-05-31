import { clsx } from "clsx";

export function Card({
  children,
  className,
  id,
}: Readonly<{ children: React.ReactNode; className?: string; id?: string }>) {
  return <section id={id} className={clsx("glass rounded-lg p-5", className)}>{children}</section>;
}

export function SectionTitle({
  eyebrow,
  title,
  action,
}: Readonly<{ eyebrow: string; title: string; action?: React.ReactNode }>) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-50">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, className }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <span className={clsx("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase", className)}>
      {children}
    </span>
  );
}

export function Skeleton() {
  return (
    <div className="min-h-screen animate-pulse p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="h-14 rounded-lg bg-slate-800/70" />
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="h-40 rounded-lg bg-slate-800/70 lg:col-span-2" />
          <div className="h-40 rounded-lg bg-slate-800/70" />
          <div className="h-40 rounded-lg bg-slate-800/70" />
        </div>
        <div className="h-96 rounded-lg bg-slate-800/70" />
      </div>
    </div>
  );
}
