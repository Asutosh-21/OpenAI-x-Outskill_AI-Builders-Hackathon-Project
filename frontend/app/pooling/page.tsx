"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, BarChart3, Package, Shuffle, TrendingUp, Warehouse } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {
  ErrorState,
  LoadingState,
  OperationHero,
  OperationKpiCard,
  OperationPageShell,
  OperationPanel,
  OperationSelect,
  PlatformBadge,
  SeverityBadge,
} from "@/components/operations-ui";
import { api } from "@/lib/api";
import { money } from "@/lib/format";

const MARKETPLACE_COLORS: Record<string, string> = {
  Blinkit: "#16a34a",
  Zepto: "#1d4ed8",
  Instamart: "#f97316",
};

export default function PoolingPage() {
  const [selectedSku, setSelectedSku] = useState("SYN-BUDS-MINI");
  const pooling = useQuery({ queryKey: ["pooling"], queryFn: api.pooling });
  const inventory = useQuery({ queryKey: ["inventory"], queryFn: api.inventory });

  if (pooling.isLoading) return <LoadingState label="Loading pooling optimizer" />;
  if (pooling.error || !pooling.data) return <ErrorState label="Failed to load pooling data" />;

  const filteredData = pooling.data.filter((item) => item.sku === selectedSku);
  const skuOptions = Array.from(new Set([...(inventory.data ?? []).map((item) => item.sku), ...pooling.data.map((item) => item.sku)]));
  const inventoryData = inventory.data?.filter((item) => item.sku === selectedSku) || [];
  const totalTransferUnits = filteredData.reduce((sum, item) => sum + item.transfer_units, 0);
  const highPriorityTransfers = filteredData.filter((item) => item.severity === "critical" || item.severity === "high").length;
  const recovery = filteredData.reduce((sum, item) => sum + (item.revenue_impact_inr ?? 25000), 0);

  return (
    <OperationPageShell>
      <OperationHero
        icon={Shuffle}
        eyebrow="Pooling command"
        title="Pooling Optimizer"
        description="Move stock across quick-commerce platforms before demand shifts become stockouts, wasted ads, or missed ranking windows."
      >
        <OperationSelect value={selectedSku} onChange={setSelectedSku}>
          {skuOptions.map((sku) => (
            <option key={sku} value={sku}>
              {sku}
            </option>
          ))}
        </OperationSelect>
      </OperationHero>

      <div className="grid gap-4 md:grid-cols-4">
        <OperationKpiCard icon={Shuffle} label="Transfer opportunities" value={String(filteredData.length)} caption="Cross-platform routes" tone="violet" />
        <OperationKpiCard icon={AlertTriangle} label="High priority" value={String(highPriorityTransfers)} caption="Needs dispatch approval" tone="orange" />
        <OperationKpiCard icon={Package} label="Units to move" value={String(totalTransferUnits)} caption="Recommended quantity" tone="blue" />
        <OperationKpiCard icon={TrendingUp} label="Revenue recovery" value={money(recovery)} caption="Protected demand" tone="emerald" />
      </div>

      <OperationPanel icon={BarChart3} title="Inventory Comparison Across Platforms" caption="Current stock levels by platform and location">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryData.map((item) => ({ name: `${item.platform} ${item.dark_store}`, stock: item.inventory_units, platform: item.platform }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: 10 }} angle={-35} textAnchor="end" height={80} />
              <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }} />
              <Bar dataKey="stock" radius={[8, 8, 0, 0]}>
                {inventoryData.map((item) => (
                  <Cell key={`${item.platform}-${item.dark_store}`} fill={MARKETPLACE_COLORS[item.platform] ?? "#64748b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </OperationPanel>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">Transfer Recommendations</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">AI-ranked operational moves for the selected SKU</p>
        </div>
        <button className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-slate-800">
          Execute High Priority
        </button>
      </div>

      {filteredData.length === 0 ? (
        <OperationPanel icon={Shuffle} title="No Transfer Recommendations" caption="Inventory is balanced across platforms for this SKU.">
          <div className="h-12" />
        </OperationPanel>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredData.map((transfer, index) => (
            <div key={`${transfer.sku}-${index}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-violet-200 bg-violet-50 text-violet-700">
                    <Shuffle className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-slate-950">{transfer.product}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Risk score {transfer.risk_score}</p>
                  </div>
                </div>
                <SeverityBadge severity={transfer.severity} />
              </div>

              <div className="mt-5 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
                <RouteBox label="From surplus" platform={transfer.from_platform} location={transfer.from_location} tone="emerald" />
                <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-slate-700">
                  <ArrowRight className="h-5 w-5" />
                  <span className="text-sm font-black">{transfer.transfer_units} units</span>
                </div>
                <RouteBox label="To deficit" platform={transfer.to_platform} location={transfer.to_location} tone="red" />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-500">Reason</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-700">{transfer.reason}</p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-black uppercase text-emerald-700">Expected impact</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-emerald-800">{transfer.expected_impact}</p>
                </div>
              </div>

              <button className="mt-5 w-full rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800">
                Create Transfer Order
              </button>
            </div>
          ))}
        </div>
      )}

      <OperationPanel icon={Warehouse} title="Platform Balance Overview" caption="Stock distribution by marketplace after recommended moves">
        <div className="grid gap-4 md:grid-cols-3">
          {["Blinkit", "Zepto", "Instamart"].map((platform) => {
            const platformInventory = inventoryData.filter((item) => item.platform === platform);
            const totalStock = platformInventory.reduce((sum, item) => sum + item.inventory_units, 0);
            const avgRisk = platformInventory.length ? platformInventory.reduce((sum, item) => sum + item.risk_score, 0) / platformInventory.length : 0;

            return (
              <div key={platform} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 h-1.5 rounded-full" style={{ backgroundColor: MARKETPLACE_COLORS[platform] }} />
                <PlatformBadge platform={platform} />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-500">Total stock</p>
                    <p className="mt-1 text-2xl font-black text-slate-950">{totalStock}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Avg risk</p>
                    <p className="mt-1 text-2xl font-black text-slate-950">{Math.round(avgRisk)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </OperationPanel>
    </OperationPageShell>
  );
}

function RouteBox({ label, platform, location, tone }: { label: string; platform: string; location: string; tone: "emerald" | "red" }) {
  const bar = tone === "emerald" ? "bg-emerald-500" : "bg-red-500";
  const bg = tone === "emerald" ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200";

  return (
    <div className={`rounded-lg border p-4 ${bg}`}>
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PlatformBadge platform={platform} />
        <span className="text-xs font-bold text-slate-600">{location}</span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white">
        <div className={`h-2 w-2/3 rounded-full ${bar}`} />
      </div>
    </div>
  );
}
