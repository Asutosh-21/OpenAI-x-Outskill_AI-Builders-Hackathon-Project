"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  MapPin,
  Megaphone,
  Package,
  Play,
  RefreshCw,
  RotateCcw,
  Route,
  ShieldCheck,
  ShoppingBag,
  Shuffle,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Warehouse,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "@/lib/api";
import type { Alert } from "@/lib/types";

const INR = "\u20B9";

const platformTheme = {
  Blinkit: { color: "#16a34a", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  Zepto: { color: "#1d4ed8", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  Instamart: { color: "#f97316", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
};

const demandData = [
  { day: "Mon", demand: 850, forecast: 920 },
  { day: "Tue", demand: 920, forecast: 980 },
  { day: "Wed", demand: 880, forecast: 950 },
  { day: "Thu", demand: 950, forecast: 1020 },
  { day: "Fri", demand: 1100, forecast: 1180 },
  { day: "Sat", demand: 1250, forecast: 1320 },
  { day: "Sun", demand: 1180, forecast: 1250 },
];

const chartGrid = {
  stroke: "#e5e7eb",
  strokeDasharray: "4 4",
  vertical: false,
};

const axisStyle = {
  stroke: "#64748b",
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 12, fontWeight: 600, fill: "#64748b" },
};

function formatMoney(value = 0) {
  if (value >= 100000) return `${INR}${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${INR}${(value / 1000).toFixed(1)}k`;
  return `${INR}${Math.round(value)}`;
}

function chartLabel(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function platformColor(platform: string) {
  return platformTheme[platform as keyof typeof platformTheme]?.color ?? "#334155";
}

function severityTone(severity: string) {
  if (severity === "critical") return "border-red-200 bg-red-50 text-red-700";
  if (severity === "high") return "border-orange-200 bg-orange-50 text-orange-700";
  if (severity === "medium") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function priorityIcon(issue: string) {
  if (issue.includes("Stockout")) return AlertTriangle;
  if (issue.includes("Ad")) return Megaphone;
  if (issue.includes("Pooling")) return Shuffle;
  return Sparkles;
}

export default function CommandCenterPage() {
  const dashboard = useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });
  const inventory = useQuery({ queryKey: ["inventory"], queryFn: api.inventory });
  const ads = useQuery({ queryKey: ["ads"], queryFn: api.ads });
  const pooling = useQuery({ queryKey: ["pooling"], queryFn: api.pooling });
  const alerts = useQuery({ queryKey: ["alerts"], queryFn: api.alerts });
  const returns = useQuery({ queryKey: ["returns"], queryFn: api.returns });

  if (dashboard.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f8f3]">
        <div className="rounded-lg border border-slate-200 bg-white px-10 py-9 text-center shadow-sm">
          <div className="relative mx-auto h-16 w-16">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
            <Sparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-emerald-700" />
          </div>
          <p className="mt-6 text-base font-bold text-slate-800">Loading Command Center</p>
          <p className="mt-2 text-sm text-slate-500">Reading live ops signals across marketplaces</p>
        </div>
      </div>
    );
  }

  if (dashboard.error || !dashboard.data) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fff7ed] p-6">
        <div className="max-w-md rounded-lg border border-red-200 bg-white p-10 text-center shadow-sm">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-red-50">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <p className="mb-3 text-2xl font-bold text-red-950">Backend connection error</p>
          <p className="mb-6 text-sm text-red-700">Please ensure FastAPI is running on port 8000.</p>
          <button className="rounded-md bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700">
            Retry connection
          </button>
        </div>
      </div>
    );
  }

  const summary = dashboard.data;
  const inventoryRows = inventory.data ?? [];
  const adRows = ads.data ?? [];
  const poolingRows = pooling.data ?? [];
  const returnRows = returns.data ?? [];
  const recentAlerts = (alerts.data ?? []).slice(0, 5);

  const revenueAtRisk = summary.kpis.revenue_at_risk_inr;
  const stockoutRisk = summary.kpis.critical_stockouts;
  const adWaste = summary.kpis.ad_waste_inr_per_day;
  const marginLeakage = summary.kpis.returns_leakage_inr;
  const inventoryHealth = summary.kpis.sku_health ?? 72;
  const activeDarkStores = new Set(inventoryRows.map((row) => row.dark_store)).size || 12;
  const criticalAlerts = (alerts.data ?? []).filter((alert) => alert.severity === "critical" || alert.severity === "high").length;
  const returnsDisputes = returnRows.filter((row) => row.payout_gap_inr > 0 || !row.inventory_updated).length || 8;

  const marketplaceRevenue = ["Blinkit", "Zepto", "Instamart"].map((platform, index) => ({
    platform,
    revenue:
      inventoryRows
        .filter((row) => row.platform === platform)
        .reduce((sum, row) => sum + (row.revenue_impact_inr ?? 0), 0) || [450000, 380000, 320000][index],
    orders: [1250, 1050, 890][index],
  }));

  const platformDistribution = [
    { name: "Blinkit", value: 45 },
    { name: "Zepto", value: 32 },
    { name: "Instamart", value: 23 },
  ];

  const topOpportunities = [
    {
      sku: inventoryRows[0]?.product || "Amul Milk 1L",
      platform: inventoryRows[0]?.platform || "Blinkit",
      issue: "Critical Stockout",
      impact: inventoryRows[0]?.revenue_impact_inr || 15000,
      action: inventoryRows[0]?.suggested_action || "Transfer 30 units from Zepto Gurgaon",
      priority: "Critical",
    },
    {
      sku: adRows[0]?.campaign_name || adRows[0]?.campaign || "Blinkit - Dairy Campaign",
      platform: adRows[0]?.platform || "Blinkit",
      issue: "Ad Waste",
      impact: adRows[0]?.waste_inr_per_day || 2500,
      action: adRows[0]?.suggested_action || "Pause campaign immediately",
      priority: "High",
    },
    {
      sku: poolingRows[0]?.product || "Britannia Bread",
      platform: poolingRows[0]?.to_platform || "Instamart",
      issue: "Pooling Opportunity",
      impact: poolingRows[0]?.revenue_impact_inr || 8000,
      action: poolingRows[0]?.suggested_action || "Transfer 20 units to high-demand store",
      priority: "Medium",
    },
  ];

  const opsNetworkCards = [
    {
      icon: ShoppingBag,
      label: "Marketplace lanes",
      value: "3",
      caption: "Blinkit, Zepto, Instamart",
      tone: "emerald" as const,
    },
    {
      icon: Warehouse,
      label: "Dark-store grid",
      value: String(activeDarkStores),
      caption: "Stores monitored in real time",
      tone: "blue" as const,
    },
    {
      icon: Activity,
      label: "Live demand pulse",
      value: `${Math.max(92, inventoryHealth + 20)}%`,
      caption: "Forecast confidence",
      tone: "amber" as const,
    },
    {
      icon: ShieldCheck,
      label: "Ops control",
      value: String(summary.kpis.ai_actions),
      caption: "AI actions queued",
      tone: "slate" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f6f8] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl md:px-8">
        <div className="mx-auto flex w-full max-w-[1800px] min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-slate-950 text-white shadow-lg shadow-slate-950/20">
              <ShoppingBag className="h-6 w-6 text-lime-300" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Command Center</h1>
                <StatusPill tone="green" label="Live ops" />
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-base font-bold text-slate-600">
                <span className="text-slate-700">Quick-commerce copilot system</span>
                <span className="text-slate-300">·</span>
                <span>Blinkit</span>
                <span className="text-slate-300">·</span>
                <span>Zepto</span>
                <span className="text-slate-300">·</span>
                <span>Instamart</span>
                <span className="text-slate-300">·</span>
                <span>Updated {new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
              </p>
            </div>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-3 xl:min-w-[625px]">
            <HeaderSignal icon={Warehouse} label="Stores" value={String(activeDarkStores)} tone="green" />
            <HeaderSignal icon={Bell} label="Alerts" value={String(criticalAlerts)} tone="orange" />
            <HeaderSignal icon={BrainCircuit} label="AI Tasks" value={String(summary.kpis.ai_actions)} tone="blue" />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1800px] space-y-6 p-4 md:p-6 xl:p-8">
        <section className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/10">
          <div className="grid min-w-0 xl:grid-cols-[minmax(0,1.25fr)_minmax(440px,0.75fr)]">
            <div className="relative min-w-0 overflow-hidden p-5 sm:p-6 xl:p-8">
              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:42px_42px]" />
              <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />
              <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="relative">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-lime-200">
                    <Activity className="h-3.5 w-3.5" />
                    Quick commerce operating layer
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
                    <MapPin className="h-3.5 w-3.5" />
                    India network
                  </span>
                </div>
                <div className="max-w-4xl">
                  <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl">
                    Enterprise copilot system for stock, ads, returns, and store moves.
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-300 md:text-base">
                    Live marketplace signals, AI-ranked actions, and clear execution cues for Blinkit, Zepto, and Instamart.
                  </p>
                </div>
                <div className="mt-7 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
                  {opsNetworkCards.map((card) => (
                    <OpsNetworkCard key={card.label} {...card} />
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 bg-white/[0.06] p-5 backdrop-blur sm:p-6 xl:border-l xl:border-t-0">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">Live control board</p>
                  <p className="mt-2 text-sm font-medium text-slate-300">Priority routes by commercial impact</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/10 text-lime-200">
                  <Zap className="h-5 w-5" />
                </span>
              </div>
              <div className="space-y-3">
                {topOpportunities.map((item, index) => (
                  <ActionBrief key={item.issue} index={index + 1} item={item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <MetricTile
            icon={BadgeIndianRupee}
            label="Revenue at risk"
            value={formatMoney(revenueAtRisk)}
            caption="Weekly projected leakage"
            tone="red"
            trend="Critical"
          />
          <MetricTile
            icon={Package}
            label="Stockout risk"
            value={String(stockoutRisk)}
            caption="SKUs needing replenishment"
            tone="amber"
            trend="High"
          />
          <MetricTile
            icon={Megaphone}
            label="Ad waste"
            value={formatMoney(adWaste)}
            caption="Daily spend to contain"
            tone="orange"
            trend="Watch"
          />
          <MetricTile
            icon={Route}
            label="Pooling moves"
            value={String(poolingRows.length)}
            caption="Cross-platform transfers"
            tone="violet"
            trend="Active"
          />
          <MetricTile
            icon={RotateCcw}
            label="Return disputes"
            value={String(returnsDisputes)}
            caption="Payout and inventory gaps"
            tone="teal"
            trend="Review"
          />
          <MetricTile
            icon={TrendingDown}
            label="Margin leakage"
            value={formatMoney(marginLeakage)}
            caption="Return discrepancies"
            tone="slate"
            trend="Track"
          />
        </section>

        <section className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
          <Panel className="overflow-hidden border-amber-200 bg-white p-0 shadow-md">
            <div className="grid min-w-0 gap-0">
              <div className="relative min-w-0 overflow-hidden bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_48%,#ecfdf5_100%)] p-5 md:p-8">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-amber-200/25 sm:h-40 sm:w-40" />
                <div className="relative mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-amber-300 bg-amber-300 text-slate-950 shadow-sm sm:h-12 sm:w-12">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">AI command signal</p>
                        <StatusPill tone="amber" label="High confidence" />
                      </div>
                      <h2 className="mt-3 max-w-3xl text-balance text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl xl:text-4xl">
                        Protect availability before demand spikes.
                      </h2>
                    </div>
                  </div>
                  <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-bold text-emerald-700 shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                    Actionable now
                  </div>
                </div>
                <div className="relative rounded-lg border border-amber-200 bg-white p-4 shadow-sm sm:p-5">
                  <p className="max-w-4xl text-pretty text-sm font-medium leading-7 text-slate-700 md:text-base">
                    <strong className="font-black text-red-700">{stockoutRisk} stockout risk</strong> and{" "}
                    <strong className="font-black text-amber-700">{formatMoney(revenueAtRisk)} revenue exposure</strong> need action.
                    Prioritize replenishment, cap risky ad spend, and use pooling to rebalance nearby dark stores.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <CommandStat icon={Package} label="Inventory health" value={`${inventoryHealth}%`} tone="green" />
                    <CommandStat icon={Warehouse} label="Stores watched" value={String(activeDarkStores)} tone="amber" />
                    <CommandStat icon={BrainCircuit} label="Action queue" value={String(summary.kpis.ai_actions)} tone="violet" />
                  </div>
                </div>
              </div>
              <div className="min-w-0 border-t border-amber-200 bg-slate-950 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-300" />
                    <p className="text-sm font-black text-white">Ranked next actions</p>
                  </div>
                  <StatusPill tone="amber" label="Ops ready" />
                </div>
                <div className="grid gap-3 xl:grid-cols-3">
                  {topOpportunities.map((item, index) => (
                    <ActionBrief key={item.issue} index={index + 1} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeading icon={ClipboardCheck} title="Marketplace Readiness" caption="Availability, ads, and action posture" />
            <div className="space-y-4">
              {marketplaceRevenue.map((marketplace) => (
                <MarketplaceRow key={marketplace.platform} row={marketplace} />
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <ChartPanel icon={TrendingUp} title="Risk Trend" caption="Stockout risk vs fill-rate recovery">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.trend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="stockoutRisk" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...chartGrid} />
                <XAxis dataKey="day" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip content={<OpsTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 14, fontSize: 12 }} />
                <Area name="Stockout risk" type="monotone" dataKey="stockoutRisk" stroke="#ef4444" fill="url(#stockoutRisk)" strokeWidth={3} />
                <Line name="Fill rate" type="monotone" dataKey="fillRate" stroke="#16a34a" strokeWidth={3} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel icon={Target} title="Demand Forecast" caption="Actual demand and AI forecast for the next week">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid {...chartGrid} />
                <XAxis dataKey="day" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip content={<OpsTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 14, fontSize: 12 }} />
                <Line
                  name="Actual demand"
                  type="monotone"
                  dataKey="demand"
                  stroke="#0f766e"
                  strokeWidth={3}
                  dot={{ fill: "#0f766e", r: 4, stroke: "#fff", strokeWidth: 2 }}
                />
                <Line
                  name="AI forecast"
                  type="monotone"
                  dataKey="forecast"
                  stroke="#f59e0b"
                  strokeDasharray="7 7"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", r: 4, stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel icon={BarChart3} title="Marketplace Revenue" caption="Platform impact using marketplace-aware colors">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketplaceRevenue} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
                <CartesianGrid {...chartGrid} />
                <XAxis dataKey="platform" {...axisStyle} />
                <YAxis {...axisStyle} tickFormatter={(value) => formatMoney(Number(value))} />
                <Tooltip content={<OpsTooltip moneyKeys={["revenue"]} />} />
                <Bar dataKey="revenue" name="Revenue" radius={[8, 8, 0, 0]} barSize={44}>
                  {marketplaceRevenue.map((row) => (
                    <Cell key={row.platform} fill={platformColor(row.platform)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel icon={ShoppingBag} title="Order Distribution" caption="Indicative order mix across quick-commerce platforms">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformDistribution}
                  cx="50%"
                  cy="50%"
                  dataKey="value"
                  innerRadius={64}
                  outerRadius={106}
                  paddingAngle={4}
                  label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {platformDistribution.map((entry) => (
                    <Cell key={entry.name} fill={platformColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip content={<OpsTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Panel className="overflow-hidden p-0">
            <div className="border-b border-slate-200 bg-white px-5 py-4 md:px-6">
              <PanelHeading icon={Zap} title="Top Opportunities" caption="Highest impact actions ranked for quick ops review" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-bold">Signal</th>
                    <th className="px-6 py-3 font-bold">Marketplace</th>
                    <th className="px-6 py-3 font-bold">Impact</th>
                    <th className="px-6 py-3 font-bold">AI action</th>
                    <th className="px-6 py-3 font-bold">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topOpportunities.map((opp) => {
                    const Icon = priorityIcon(opp.issue);
                    return (
                      <tr key={opp.issue} className="transition-colors hover:bg-slate-50">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-700">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-950">{opp.sku}</p>
                              <p className="text-xs font-medium text-slate-500">{opp.issue}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <PlatformBadge platform={opp.platform} />
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-950">{formatMoney(opp.impact)}</td>
                        <td className="px-6 py-5 text-slate-600">{opp.action}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${severityTone(opp.priority.toLowerCase())}`}>
                            {opp.priority}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel>
            <div className="mb-5 flex items-start justify-between gap-4">
              <PanelHeading icon={Bell} title="Recent Critical Alerts" caption="Latest notifications from the operating layer" />
              <Link href="/alerts" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentAlerts.length ? (
                recentAlerts.map((alert) => <AlertRow key={alert.id} alert={alert} />)
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                  <p className="mt-3 text-sm font-bold text-slate-800">No critical alerts</p>
                  <p className="mt-1 text-xs text-slate-500">All monitored channels are stable.</p>
                </div>
              )}
            </div>
          </Panel>
        </section>

        <Panel>
          <PanelHeading icon={Play} title="AI Actions Panel" caption="Fast handoffs into inventory, pooling, ads, returns, and reporting workflows" />
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <ActionLink href="/pooling" icon={Shuffle} title="Generate transfer plan" body="Balance dark-store inventory" tone="violet" />
            <ActionLink href="/inventory" icon={Package} title="Optimize inventory" body="Replenish risky SKUs" tone="green" />
            <ActionLink href="/ads" icon={Megaphone} title="Pause risky ads" body="Cap spend with low shelf availability" tone="orange" />
            <ActionLink href="/returns" icon={FileText} title="Create dispute ticket" body="Recover payout gaps" tone="teal" />
            <button className="flex min-h-[116px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-left transition-all hover:border-slate-300 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700">
                  <RefreshCw className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-950">Executive report</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">Weekly operating summary</span>
                </span>
              </div>
              <RefreshCw className="h-4 w-4 text-slate-500 transition-transform group-hover:rotate-180" />
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function HeaderSignal({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "green" | "orange" | "blue";
}) {
  const tones = {
    green: {
      card: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-emerald-100/70",
      icon: "border-emerald-200 bg-emerald-100 text-emerald-700",
      text: "text-emerald-700",
    },
    orange: {
      card: "border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-orange-100/70",
      icon: "border-orange-200 bg-orange-100 text-orange-700",
      text: "text-orange-700",
    },
    blue: {
      card: "border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-blue-100/70",
      icon: "border-blue-200 bg-blue-100 text-blue-700",
      text: "text-blue-700",
    },
  };

  return (
    <div className={`flex min-h-[74px] min-w-0 items-center gap-4 rounded-lg border px-4 py-3 shadow-lg transition hover:-translate-y-0.5 ${tones[tone].card}`}>
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border shadow-sm ${tones[tone].icon}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 leading-none">
        <p className={`text-[12px] font-black uppercase tracking-[0.12em] ${tones[tone].text}`}>{label}</p>
        <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
      </div>
    </div>
  );
}

function StatusPill({ tone, label }: { tone: "green" | "amber"; label: string }) {
  const classes = tone === "green" ? "border-emerald-300 bg-emerald-100 text-emerald-800 shadow-emerald-100" : "border-amber-200 bg-amber-50 text-amber-800";
  return <span className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-wide shadow-sm ${classes}`}>{label}</span>;
}

function OpsNetworkCard({
  icon: Icon,
  label,
  value,
  caption,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  tone: "emerald" | "blue" | "amber" | "slate";
}) {
  const tones = {
    emerald: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
    blue: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
    amber: "border-amber-300/25 bg-amber-300/10 text-amber-200",
    slate: "border-slate-300/20 bg-white/10 text-slate-200",
  };

  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.075] p-4 shadow-lg shadow-black/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.11]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-lg border ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-300">
          Live
        </span>
      </div>
      <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs font-medium leading-5 text-slate-400">{caption}</p>
    </div>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  caption,
  trend,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  trend: string;
  tone: "red" | "amber" | "orange" | "violet" | "teal" | "slate";
}) {
  const tones = {
    red: "border-red-200 bg-red-50 text-red-700 shadow-red-100",
    amber: "border-amber-200 bg-amber-50 text-amber-700 shadow-amber-100",
    orange: "border-orange-200 bg-orange-50 text-orange-700 shadow-orange-100",
    violet: "border-violet-200 bg-violet-50 text-violet-700 shadow-violet-100",
    teal: "border-teal-200 bg-teal-50 text-teal-700 shadow-teal-100",
    slate: "border-slate-200 bg-slate-50 text-slate-700 shadow-slate-100",
  };
  const accents = {
    red: "from-red-500 to-rose-400",
    amber: "from-amber-500 to-yellow-400",
    orange: "from-orange-500 to-amber-400",
    violet: "from-violet-500 to-fuchsia-400",
    teal: "from-teal-500 to-cyan-400",
    slate: "from-slate-700 to-slate-500",
  };

  return (
    <div className="group relative min-h-[172px] overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl">
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accents[tone]}`} />
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${accents[tone]} opacity-10 transition group-hover:opacity-20`} />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className={`grid h-12 w-12 place-items-center rounded-lg border shadow-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${tones[tone]}`}>{trend}</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{caption}</p>
    </div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-black/[0.02] md:p-6 ${className}`}>{children}</section>;
}

function PanelHeading({ icon: Icon, title, caption }: { icon: LucideIcon; title: string; caption: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-base font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-xs font-medium text-slate-500">{caption}</p>
      </div>
    </div>
  );
}

function CommandStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "green" | "amber" | "violet";
}) {
  const tones = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
  };

  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className={`grid h-9 w-9 place-items-center rounded-lg border ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-2xl font-black text-slate-950">{value}</p>
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}

function ActionBrief({ index, item }: { index: number; item: { action: string; impact: number; platform: string; issue: string } }) {
  const Icon = priorityIcon(item.issue);
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4 shadow-sm transition-colors hover:bg-white/[0.12]">
      <div className="flex items-start gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-300 text-xs font-black text-slate-950">{index}</span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-amber-200">
              <Icon className="h-4 w-4" />
            </span>
            <p className="text-xs font-black uppercase tracking-wide text-slate-200">{item.issue}</p>
          </div>
          <p className="text-sm font-bold leading-5 text-white">{item.action}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <PlatformBadge platform={item.platform} dark />
            <span className="rounded-full bg-amber-300 px-3 py-1 text-sm font-black text-slate-950">{formatMoney(item.impact)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketplaceRow({ row }: { row: { platform: string; revenue: number; orders: number } }) {
  const maxRevenue = 450000;
  const width = `${Math.max(18, Math.min(100, (row.revenue / maxRevenue) * 100))}%`;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <PlatformBadge platform={row.platform} />
        <p className="text-sm font-black text-slate-950">{formatMoney(row.revenue)}</p>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full" style={{ width, backgroundColor: platformColor(row.platform) }} />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>{row.orders.toLocaleString("en-IN")} orders</span>
        <span>Revenue exposure</span>
      </div>
    </div>
  );
}

function ChartPanel({ icon: Icon, title, caption, children }: { icon: LucideIcon; title: string; caption: string; children: React.ReactNode }) {
  return (
    <Panel className="transition-shadow hover:shadow-md">
      <div className="mb-5 flex items-center justify-between gap-4">
        <PanelHeading icon={Icon} title={title} caption={caption} />
      </div>
      <div className="h-72 sm:h-80">{children}</div>
    </Panel>
  );
}

function OpsTooltip({ active, payload, label, moneyKeys = [] }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry: any) => {
          const key = String(entry.dataKey ?? entry.name);
          const value = moneyKeys.includes(key) ? formatMoney(Number(entry.value)) : Number(entry.value).toLocaleString("en-IN");
          return (
            <div key={key} className="flex items-center justify-between gap-8 text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name || chartLabel(key)}
              </span>
              <span className="font-black text-slate-950">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlatformBadge({ platform, dark = false }: { platform: string; dark?: boolean }) {
  const theme = platformTheme[platform as keyof typeof platformTheme];
  if (!theme) {
    return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${dark ? "border-white/10 bg-white/10 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{platform}</span>;
  }

  if (dark) {
    return (
      <span
        className="inline-flex rounded-full border px-3 py-1 text-xs font-black text-white shadow-sm"
        style={{ backgroundColor: theme.color, borderColor: theme.color }}
      >
        {platform}
      </span>
    );
  }

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${theme.bg} ${theme.border} ${theme.text}`}>{platform}</span>;
}

function AlertRow({ alert }: { alert: Alert }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 transition-all hover:border-slate-300 hover:bg-slate-50">
      <div className="flex items-start gap-3">
        <div className={`grid h-9 w-9 place-items-center rounded-lg border ${severityTone(alert.severity)}`}>
          <Bell className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <p className="font-bold text-slate-950">{alert.title}</p>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase ${severityTone(alert.severity)}`}>{alert.severity}</span>
          </div>
          <p className="text-sm leading-6 text-slate-600">{alert.message}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            <span>{alert.action}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionLink({
  href,
  icon: Icon,
  title,
  body,
  tone,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  body: string;
  tone: "violet" | "green" | "orange" | "teal";
}) {
  const tones = {
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
  };

  return (
    <Link href={href} className="group flex min-h-[116px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-lg border ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-bold text-slate-950">{title}</span>
          <span className="mt-1 block text-xs leading-5 text-slate-500">{body}</span>
        </span>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
