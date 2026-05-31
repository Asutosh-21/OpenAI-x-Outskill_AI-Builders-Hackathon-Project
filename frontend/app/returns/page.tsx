"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BadgeIndianRupee, BarChart3, Package, RotateCcw, TrendingDown } from "lucide-react";
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

export default function ReturnsPage() {
  const [selectedSku, setSelectedSku] = useState("all");
  const returns = useQuery({ queryKey: ["returns"], queryFn: api.returns });

  if (returns.isLoading) return <LoadingState label="Loading returns audit" />;
  if (returns.error || !returns.data) return <ErrorState label="Failed to load returns data" />;

  const filteredData = selectedSku === "all" ? returns.data : returns.data.filter((item) => item.sku === selectedSku);
  const skuOptions = ["all", ...Array.from(new Set(returns.data.map((item) => item.sku)))];
  const totalPayoutGap = filteredData.reduce((sum, item) => sum + item.payout_gap_inr, 0);
  const criticalReturns = filteredData.filter((item) => item.severity === "critical").length;
  const highRiskReturns = filteredData.filter((item) => item.severity === "high").length;
  const avgRiskScore = filteredData.length ? Math.round(filteredData.reduce((sum, item) => sum + item.risk_score, 0) / filteredData.length) : 0;
  const platformGaps = ["Blinkit", "Zepto", "Instamart"].map((platform) => ({
    platform,
    gap: filteredData.filter((item) => item.platform === platform).reduce((sum, item) => sum + item.payout_gap_inr, 0),
  }));

  return (
    <OperationPageShell>
      <OperationHero
        icon={RotateCcw}
        eyebrow="Returns command"
        title="Returns Audit"
        description="Detect payout leakage, inventory mismatches, and dispute-ready return cases across every quick-commerce marketplace."
      >
        <OperationSelect value={selectedSku} onChange={setSelectedSku}>
          <option value="all">All SKUs</option>
          {skuOptions.slice(1).map((sku) => (
            <option key={sku} value={sku}>
              {sku}
            </option>
          ))}
        </OperationSelect>
      </OperationHero>

      <div className="grid gap-4 md:grid-cols-4">
        <OperationKpiCard icon={RotateCcw} label="Total returns" value={String(filteredData.length)} caption="Audited cases" tone="blue" />
        <OperationKpiCard icon={TrendingDown} label="Payout gap" value={money(totalPayoutGap)} caption="Revenue leakage" tone="red" />
        <OperationKpiCard icon={AlertTriangle} label="High risk" value={String(criticalReturns + highRiskReturns)} caption="Dispute candidates" tone="orange" />
        <OperationKpiCard icon={Package} label="Avg risk score" value={String(avgRiskScore)} caption="Return severity index" tone="slate" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <OperationPanel className="lg:col-span-2" icon={BarChart3} title="Payout Gap by Platform" caption="Revenue leakage across marketplaces">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformGaps}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="platform" stroke="#64748b" style={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }} formatter={(value: any) => [money(Number(value)), "Payout gap"]} />
                <Bar dataKey="gap" radius={[8, 8, 0, 0]}>
                  {platformGaps.map((item) => (
                    <Cell key={item.platform} fill={MARKETPLACE_COLORS[item.platform] ?? "#64748b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </OperationPanel>

        <OperationPanel icon={AlertTriangle} title="Risk Distribution" caption="Return cases by severity level">
          <div className="space-y-4">
            {["critical", "high", "medium", "low"].map((severity) => {
              const count = filteredData.filter((item) => item.severity === severity).length;
              const percentage = filteredData.length ? (count / filteredData.length) * 100 : 0;
              return (
                <div key={severity}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-black capitalize text-slate-950">{severity}</span>
                    <span className="font-black text-slate-950">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className={`h-2 rounded-full ${severity === "critical" ? "bg-red-500" : severity === "high" ? "bg-orange-500" : severity === "medium" ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </OperationPanel>
      </div>

      <OperationPanel icon={RotateCcw} title="Return Discrepancies" caption="Detailed audit of returns with payout gaps">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-black uppercase text-slate-500">
                <th className="pb-3 pr-4">Return ID</th>
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 pr-4">Platform</th>
                <th className="pb-3 pr-4">Gap</th>
                <th className="pb-3 pr-4">Risk</th>
                <th className="pb-3 pr-4">Severity</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.return_id} className="hover:bg-slate-50">
                  <td className="py-4 pr-4 font-black text-slate-950">{item.return_id}</td>
                  <td className="py-4 pr-4">
                    <p className="font-bold text-slate-950">{item.product}</p>
                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">{item.reason}</p>
                  </td>
                  <td className="py-4 pr-4"><PlatformBadge platform={item.platform} /></td>
                  <td className="py-4 pr-4 font-black text-red-600">{money(item.payout_gap_inr)}</td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-slate-200">
                        <div className={`h-2 rounded-full ${item.risk_score > 70 ? "bg-red-500" : item.risk_score > 40 ? "bg-orange-500" : "bg-emerald-500"}`} style={{ width: `${item.risk_score}%` }} />
                      </div>
                      <span className="text-xs font-black text-slate-600">{item.risk_score}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4"><SeverityBadge severity={item.severity} /></td>
                  <td className="py-4">
                    <button className={`rounded-lg px-3 py-2 text-xs font-black ${item.risk_score >= 50 ? "bg-red-600 text-white hover:bg-red-700" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                      {item.risk_score >= 50 ? "Create Dispute" : "Monitor"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OperationPanel>

      <section className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-lg border border-blue-200 bg-white text-blue-700 shadow-sm">
            <BadgeIndianRupee className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-black text-blue-950">Revenue Recovery Opportunity</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-blue-800">
              Total payout gap of <span className="font-black">{money(totalPayoutGap)}</span> detected across {filteredData.length} returns. {criticalReturns + highRiskReturns} high-risk returns should move into dispute filing.
            </p>
          </div>
        </div>
      </section>
    </OperationPageShell>
  );
}
