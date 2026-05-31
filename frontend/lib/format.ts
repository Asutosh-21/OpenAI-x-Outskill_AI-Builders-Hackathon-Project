export function money(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
  return `₹${value}`;
}

export function severityClass(severity: string) {
  switch (severity) {
    case "critical":
      return "border-rose-400/40 bg-rose-500/10 text-rose-200";
    case "high":
      return "border-orange-400/40 bg-orange-500/10 text-orange-200";
    case "medium":
      return "border-cyan-400/40 bg-cyan-500/10 text-cyan-200";
    default:
      return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200";
  }
}
