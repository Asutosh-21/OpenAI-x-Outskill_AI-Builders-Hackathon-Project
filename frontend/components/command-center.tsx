"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  Boxes,
  BrainCircuit,
  Megaphone,
  Search,
  Shuffle
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { AICopilot } from "@/components/ai-copilot";
import { Badge, Card, SectionTitle, Skeleton } from "@/components/ui";
import { api } from "@/lib/api";
import { money, severityClass } from "@/lib/format";
import type { ActionResponse, AdRecommendation, Alert, CatalogResponse, InventoryRisk, PoolingRecommendation, ReturnAudit } from "@/lib/types";

const navItems = [
  ["Command Center", "command"],
  ["AI Copilot", "copilot"],
  ["Inventory", "inventory"],
  ["Ads", "ads"],
  ["Catalog", "catalog"],
  ["Returns", "returns"],
  ["Pooling", "pooling"],
  ["Alerts", "alerts"],
];

const workflow = [
  "Connect & ingest",
  "Process & standardize",
  "AI agents analysis",
  "Decisions & actions",
  "Execution layer",
  "Monitor & learn",
];

export function CommandCenter() {
  const [sku, setSku] = useState("SYN-BUDS-MINI");
  const [lastAction, setLastAction] = useState<ActionResponse | null>(null);
  const dashboard = useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });
  const inventory = useQuery({ queryKey: ["inventory"], queryFn: api.inventory });
  const ads = useQuery({ queryKey: ["ads"], queryFn: api.ads });
  const returns = useQuery({ queryKey: ["returns"], queryFn: api.returns });
  const pooling = useQuery({ queryKey: ["pooling"], queryFn: api.pooling });
  const alerts = useQuery({ queryKey: ["alerts"], queryFn: api.alerts });
  const catalog = useQuery({ queryKey: ["catalog", sku], queryFn: () => api.catalog(sku) });
  const actionMutation = useMutation({
    mutationFn: api.executeAction,
    onSuccess: setLastAction,
  });

  const loading = dashboard.isLoading || inventory.isLoading || ads.isLoading || returns.isLoading || pooling.isLoading || alerts.isLoading;
  const error = dashboard.error || inventory.error || ads.error || returns.error || pooling.error || alerts.error;
  const skuOptions = useMemo(() => Array.from(new Set((inventory.data ?? []).map((row) => row.sku))), [inventory.data]);

  if (loading) return <Skeleton />;
  if (error || !dashboard.data) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <Card className="max-w-xl">
          <p className="text-lg font-semibold text-rose-200">Backend is not reachable yet.</p>
          <p className="mt-2 text-sm text-slate-300">Start FastAPI on port 8000, then refresh the dashboard.</p>
        </Card>
      </main>
    );
  }

  const filteredInventory = (inventory.data ?? []).filter((row) => row.sku === sku);
  const filteredAds = (ads.data ?? []).filter((row) => row.sku === sku);
  const filteredReturns = (returns.data ?? []).filter((row) => row.sku === sku);
  const filteredPooling = (pooling.data ?? []).filter((row) => row.sku === sku);

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-[1500px] gap-5 px-5 py-5">
        <aside className="sticky top-5 hidden h-[calc(100vh-40px)] w-64 shrink-0 rounded-lg border border-slate-700/70 bg-slate-950/80 p-4 shadow-glow lg:block">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400">
              <Boxes className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">ShelfSync AI</p>
              <p className="text-xs text-slate-400">Ops Copilot</p>
            </div>
          </div>
          <div className="hairline my-5 h-px" />
          <nav className="space-y-1">
            {navItems.map(([label, id]) => (
              <a key={id} href={`#${id}`} className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                {label}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </nav>
          <div className="mt-6 rounded-lg border border-lime-400/20 bg-lime-400/5 p-3">
            <p className="font-mono text-[11px] uppercase text-lime-200">AI action loop</p>
            <p className="mt-2 text-sm text-slate-300">Inventory, ads, catalog, returns, and pooling recommendations in one operating layer.</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-5">
          <Header sku={sku} setSku={setSku} skuOptions={skuOptions} />
          <section id="copilot">
            <AICopilot />
          </section>
          <ExecutiveDashboard
            summary={dashboard.data}
            inventory={filteredInventory}
            ads={filteredAds}
            returns={filteredReturns}
            pooling={filteredPooling}
            onExecute={(payload) => actionMutation.mutate(payload)}
            busy={actionMutation.isPending}
          />
          <ExecutionLayer lastAction={lastAction} />
          <WorkflowStrip />
          <InventorySection rows={filteredInventory} />
          <AdSection rows={filteredAds} />
          <CatalogSection
            data={catalog.data}
            loading={catalog.isLoading}
            onPublish={() => actionMutation.mutate({ action_type: "catalog_publish", sku, reason: "Publish optimized marketplace copy" })}
            busy={actionMutation.isPending}
          />
          <ReturnsSection rows={filteredReturns} />
          <PoolingSection rows={filteredPooling} />
          <AlertsSection rows={alerts.data ?? []} />
        </div>
      </div>
    </main>
  );
}

function Header({ sku, setSku, skuOptions }: { sku: string; setSku: (sku: string) => void; skuOptions: string[] }) {
  return (
    <header id="command" className="overflow-hidden rounded-lg border border-slate-700/70 bg-slate-950/80 p-6 shadow-glow">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-signal">AI Operations Copilot for Quick-Commerce Brands</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-5xl">
            Control inventory risk, ad waste, catalog quality, returns, and pooling from one AI command center.
          </h1>
        </div>
        <div className="flex w-full max-w-md items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <select value={sku} onChange={(event) => setSku(event.target.value)} className="w-full bg-transparent text-sm font-semibold text-white outline-none">
            {skuOptions.map((option) => (
              <option key={option} value={option} className="bg-slate-950">
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

function ExecutiveDashboard({
  summary,
  inventory,
  ads,
  returns,
  pooling,
  onExecute,
  busy,
}: {
  summary: any;
  inventory: InventoryRisk[];
  ads: AdRecommendation[];
  returns: ReturnAudit[];
  pooling: PoolingRecommendation[];
  onExecute: (payload: { action_type: string; sku: string; platform?: string; location?: string; units?: number; reason?: string }) => void;
  busy: boolean;
}) {
  const kpis = [
    ["Revenue at risk", money(summary.kpis.revenue_at_risk_inr), "Projected weekly leakage", "text-rose-200", BadgeIndianRupee],
    ["Ad waste/day", money(summary.kpis.ad_waste_inr_per_day), "Active spend on risky SKUs", "text-orange-200", Megaphone],
    ["Critical stockouts", summary.kpis.critical_stockouts, "Stores needing action", "text-cyan-200", AlertTriangle],
    ["AI actions", summary.kpis.ai_actions, "Recommendations queued", "text-lime-200", BrainCircuit],
  ];
  return (
    <section className="grid gap-4 xl:grid-cols-4">
      {kpis.map(([label, value, caption, color, Icon]) => (
        <Card key={String(label)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">{label}</p>
              <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
            </div>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <p className="mt-4 text-xs text-slate-500">{caption}</p>
        </Card>
      ))}

      <Card className="xl:col-span-2">
        <SectionTitle eyebrow="Executive Signal" title="Risk trend by operating day" />
        <div className="h-64">
          <ResponsiveContainer>
            <AreaChart data={summary.trend}>
              <defs>
                <linearGradient id="risk" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2937" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 8 }} />
              <Area dataKey="stockoutRisk" stroke="#f43f5e" fill="url(#risk)" strokeWidth={2} />
              <Line dataKey="fillRate" stroke="#a3e635" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="xl:col-span-2">
        <SectionTitle eyebrow="Next Best Actions" title="AI recommendations ready for ops" />
        <div className="space-y-3">
          <Recommendation
            title={inventory[0]?.suggested_action ?? "No replenishment needed"}
            body={inventory[0]?.reason ?? "Inventory looks stable."}
            severity={inventory[0]?.severity ?? "low"}
            actionLabel="Draft order"
            busy={busy}
            onAction={() =>
              inventory[0] &&
              onExecute({
                action_type: "replenishment",
                sku: inventory[0].sku,
                platform: inventory[0].platform,
                location: inventory[0].dark_store,
                units: inventory[0].recommended_units,
              })
            }
          />
          <Recommendation
            title={ads[0]?.suggested_action ?? "No ad action needed"}
            body={ads[0]?.reason ?? "Campaigns are aligned to stock."}
            severity={ads[0]?.severity ?? "low"}
            actionLabel="Queue ad action"
            busy={busy}
            onAction={() => ads[0] && onExecute({ action_type: "pause_ads", sku: ads[0].sku, platform: ads[0].platform, reason: ads[0].campaign })}
          />
          <Recommendation
            title={pooling[0]?.suggested_action ?? "No pooling action needed"}
            body={pooling[0]?.reason ?? "No imbalance detected for this SKU."}
            severity={pooling[0]?.severity ?? "low"}
            actionLabel="Create transfer"
            busy={busy}
            onAction={() =>
              pooling[0] &&
              onExecute({
                action_type: "transfer",
                sku: pooling[0].sku,
                platform: pooling[0].to_platform,
                location: pooling[0].to_location,
                units: pooling[0].transfer_units,
              })
            }
          />
          <Recommendation
            title={returns[0]?.suggested_action ?? "No disputes needed"}
            body={returns[0]?.reason ?? "Returns are reconciled."}
            severity={returns[0]?.severity ?? "low"}
            actionLabel="Generate dispute"
            busy={busy}
            onAction={() => returns[0] && onExecute({ action_type: "dispute", sku: returns[0].sku, platform: returns[0].platform, reason: returns[0].reason })}
          />
        </div>
      </Card>
    </section>
  );
}

function ExecutionLayer({ lastAction }: { lastAction: ActionResponse | null }) {
  const stages = [
    ["Suggested", "AI ranked the action by operational impact"],
    ["Queued", "Ops workflow created for human review"],
    ["Synced", "Marketplace or system update simulated"],
    ["Learning", "Outcome will feed the recommendation loop"],
  ];

  return (
    <Card>
      <SectionTitle eyebrow="Execution Layer" title="Simulated action automation and feedback loop" />
      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
          {lastAction ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{lastAction.title}</p>
                <Badge className="border-lime-400/40 bg-lime-400/10 text-lime-200">{lastAction.status}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{lastAction.message}</p>
              <p className="mt-4 font-mono text-xs text-slate-500">{lastAction.action_id} • ETA {lastAction.eta_minutes} min</p>
              <p className="mt-3 text-sm font-semibold text-cyan-200">{lastAction.next_step}</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-white">No action executed yet</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Use the buttons in Next Best Actions or Catalog Intelligence to simulate the workflow handoff from AI insight to operational execution.</p>
            </>
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {stages.map(([title, body], index) => (
            <div key={title} className="rounded-lg border border-slate-700/70 bg-slate-950/60 p-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-violet-500 text-sm font-bold text-white">{index + 1}</span>
              <p className="mt-4 font-semibold text-white">{title}</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function WorkflowStrip() {
  return (
    <Card>
      <SectionTitle eyebrow="Workflow Architecture" title="Connect, reason, act, and learn across the quick-commerce loop" />
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {workflow.map((step, index) => (
          <div key={step} className="rounded-lg border border-slate-700/70 bg-slate-900/60 p-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-violet-500 text-xs font-bold text-white">{index + 1}</span>
              <p className="text-sm font-semibold text-slate-100">{step}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function InventorySection({ rows }: { rows: InventoryRisk[] }) {
  return (
    <Card id="inventory">
      <SectionTitle eyebrow="Inventory Intelligence" title="Hyperlocal stockout forecasting" />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <DataTable
          columns={["Platform", "Dark store", "Units", "Cover", "Risk", "Action"]}
          rows={rows.map((row) => [
            row.platform,
            row.dark_store,
            row.inventory_units,
            `${row.hours_to_stockout}h`,
            <Badge key={row.platform} className={severityClass(row.severity)}>{row.risk_score}</Badge>,
            row.suggested_action,
          ])}
        />
        <MiniBars rows={rows.map((row) => ({ name: row.platform, value: row.risk_score, color: row.risk_score > 70 ? "#f43f5e" : "#22d3ee" }))} />
      </div>
    </Card>
  );
}

function AdSection({ rows }: { rows: AdRecommendation[] }) {
  return (
    <Card id="ads">
      <SectionTitle eyebrow="Ad Intelligence" title="Ad-to-shelf synchronization engine" />
      <div className="grid gap-4 xl:grid-cols-3">
        {rows.map((row) => (
          <Recommendation key={row.campaign_id} title={row.campaign} body={`${row.reason} ROAS: ${row.roas}.`} severity={row.severity} footer={row.suggested_action} />
        ))}
      </div>
    </Card>
  );
}

function CatalogSection({ data, loading, onPublish, busy }: { data?: CatalogResponse; loading: boolean; onPublish: () => void; busy: boolean }) {
  return (
    <Card id="catalog">
      <SectionTitle
        eyebrow="Catalog Intelligence"
        title="Marketplace-specific AI listing variants"
        action={
          <button onClick={onPublish} disabled={busy || !data} className="rounded-md border border-lime-400/40 bg-lime-400/10 px-3 py-2 text-xs font-semibold text-lime-100 disabled:cursor-not-allowed disabled:opacity-50">
            {busy ? "Staging..." : "Stage publish"}
          </button>
        }
      />
      {loading || !data ? (
        <p className="text-sm text-slate-400">Generating catalog variants...</p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          {data.variants.map((variant) => (
            <div key={variant.platform} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-cyan-200">{variant.platform}</p>
                <Badge className="border-lime-400/40 bg-lime-400/10 text-lime-200">{variant.content_score}</Badge>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{variant.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{variant.description}</p>
              <p className="mt-4 text-xs text-slate-500">Tone: {variant.tone}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ReturnsSection({ rows }: { rows: ReturnAudit[] }) {
  return (
    <Card id="returns">
      <SectionTitle eyebrow="Returns & Audit" title="Discrepancy detection and dispute readiness" />
      <DataTable
        columns={["Return", "Platform", "Reason", "Payout gap", "Inventory", "Action"]}
        rows={rows.map((row) => [
          row.return_id,
          row.platform,
          row.reason,
          money(row.payout_gap_inr),
          row.inventory_updated ? "Updated" : "Missing",
          row.suggested_action,
        ])}
      />
    </Card>
  );
}

function PoolingSection({ rows }: { rows: PoolingRecommendation[] }) {
  return (
    <Card id="pooling">
      <SectionTitle eyebrow="Pooling Optimizer" title="Cross-platform stock balancing recommendations" />
      <div className="grid gap-4 xl:grid-cols-2">
        {rows.length ? rows.map((row) => <TransferCard key={`${row.sku}-${row.to_platform}`} row={row} />) : <p className="text-sm text-slate-400">No transfer needed for this SKU.</p>}
      </div>
    </Card>
  );
}

function AlertsSection({ rows }: { rows: Alert[] }) {
  return (
    <Card id="alerts">
      <SectionTitle eyebrow="Alerts Center" title="Prioritized operating alerts" />
      <div className="grid gap-3 xl:grid-cols-2">
        {rows.map((row) => (
          <div key={row.id} className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-white">{row.title}</p>
              <Badge className={severityClass(row.severity)}>{row.severity}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-300">{row.message}</p>
            <p className="mt-3 text-sm font-semibold text-lime-200">{row.action}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Recommendation({
  title,
  body,
  severity,
  footer,
  actionLabel,
  onAction,
  busy,
}: {
  title: string;
  body: string;
  severity: string;
  footer?: string;
  actionLabel?: string;
  onAction?: () => void;
  busy?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
        </div>
        <Badge className={severityClass(severity)}>{severity}</Badge>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {footer ? <p className="text-sm font-semibold text-lime-200">{footer}</p> : <span />}
        {actionLabel && onAction ? (
          <button onClick={onAction} disabled={busy} className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50">
            {busy ? "Running..." : actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function DataTable({ columns, rows }: { columns: string[]; rows: Array<Array<React.ReactNode>> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-700 text-xs uppercase text-slate-500">
            {columns.map((column) => (
              <th key={column} className="px-3 py-3 font-semibold">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row, index) => (
            <tr key={index} className="border-b border-slate-800/80 text-slate-300">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-4 align-top">{cell}</td>
              ))}
            </tr>
          )) : (
            <tr>
              <td className="px-3 py-6 text-slate-500" colSpan={columns.length}>No records for selected SKU.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function MiniBars({ rows }: { rows: Array<{ name: string; value: number; color: string }> }) {
  return (
    <div className="h-72 rounded-lg border border-slate-700 bg-slate-900/60 p-4">
      <ResponsiveContainer>
        <BarChart data={rows}>
          <CartesianGrid stroke="#1f2937" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 8 }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {rows.map((row) => <Cell key={row.name} fill={row.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TransferCard({ row }: { row: PoolingRecommendation }) {
  return (
    <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-4">
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <Shuffle className="h-5 w-5 text-cyan-200" />
        <span>{row.from_platform} {row.from_location}</span>
        <ArrowRight className="h-4 w-4 text-slate-500" />
        <span>{row.to_platform} {row.to_location}</span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-white">{row.transfer_units} units</p>
      <p className="mt-2 text-sm text-slate-300">{row.reason}</p>
      <p className="mt-3 text-sm font-semibold text-lime-200">{row.suggested_action}</p>
    </div>
  );
}
