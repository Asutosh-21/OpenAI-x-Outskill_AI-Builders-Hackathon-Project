"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BrainCircuit,
  ClipboardList,
  Clock,
  Download,
  FileText,
  Package,
  Sparkles,
  TrendingUp,
  Warehouse,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

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

export default function InventoryPage() {
  const [selectedSku, setSelectedSku] = useState("SYN-BUDS-MINI");
  const [reportGenerated, setReportGenerated] = useState(false);
  const inventory = useQuery({ queryKey: ["inventory"], queryFn: api.inventory });

  if (inventory.isLoading) {
    return <LoadingState label="Loading inventory intelligence" />;
  }

  if (inventory.error || !inventory.data) {
    return <ErrorState label="Failed to load inventory data" />;
  }

  const filteredData = inventory.data.filter((item) => item.sku === selectedSku);
  const skuOptions = Array.from(new Set(inventory.data.map((item) => item.sku)));
  const criticalCount = filteredData.filter((item) => item.severity === "critical").length;
  const highCount = filteredData.filter((item) => item.severity === "high").length;
  const avgHoursToStockout = filteredData.length
    ? Math.round(filteredData.reduce((sum, item) => sum + item.hours_to_stockout, 0) / filteredData.length)
    : 0;
  const topRecommendations = [...filteredData]
    .sort((a, b) => b.risk_score - a.risk_score || b.recommended_units - a.recommended_units)
    .slice(0, 3);
  const urgentRecommendation = topRecommendations[0];
  const totalRecommendedUnits = filteredData.reduce((sum, item) => sum + item.recommended_units, 0);
  const reportGeneratedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const averageRiskForPlatform = (platform: string) => {
    const rows = filteredData.filter((item) => item.platform === platform);
    if (!rows.length) return 0;
    return Math.round(rows.reduce((sum, item) => sum + item.risk_score, 0) / rows.length);
  };

  const riskDistribution = [
    { platform: "Blinkit", risk: averageRiskForPlatform("Blinkit"), color: "#16a34a" },
    { platform: "Zepto", risk: averageRiskForPlatform("Zepto"), color: "#1d4ed8" },
    { platform: "Instamart", risk: averageRiskForPlatform("Instamart"), color: "#f97316" },
  ];

  // Forecast data
  const forecastData = [
    { hour: "0h", stock: 100, demand: 20 },
    { hour: "6h", stock: 80, demand: 25 },
    { hour: "12h", stock: 55, demand: 30 },
    { hour: "18h", stock: 25, demand: 35 },
    { hour: "24h", stock: 0, demand: 40 },
    { hour: "30h", stock: 0, demand: 45 },
    { hour: "36h", stock: 0, demand: 50 },
    { hour: "42h", stock: 0, demand: 55 },
    { hour: "48h", stock: 0, demand: 60 },
  ];

  return (
    <OperationPageShell>
      <OperationHero
        icon={Package}
        eyebrow="Inventory command"
        title="Inventory Intelligence"
        description="Hyperlocal stockout forecasting, replenishment recommendations, and dark-store visibility for quick-commerce operations."
      >
        <OperationSelect value={selectedSku} onChange={setSelectedSku}>
              {skuOptions.map((sku) => (
                <option key={sku} value={sku}>
                  {sku}
                </option>
              ))}
        </OperationSelect>
      </OperationHero>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <OperationKpiCard icon={Package} label="Total stores" value={String(filteredData.length)} caption="Dark stores tracked" tone="blue" />
          <OperationKpiCard icon={AlertTriangle} label="Critical risks" value={String(criticalCount)} caption="Immediate action needed" tone="red" />
          <OperationKpiCard icon={TrendingUp} label="High risks" value={String(highCount)} caption="Watch list" tone="orange" />
          <OperationKpiCard icon={Clock} label="Avg hours to stockout" value={`${avgHoursToStockout}h`} caption="Projected cover" tone="slate" />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Inventory Health Chart */}
          <OperationPanel className="lg:col-span-2" icon={TrendingUp} title="Inventory Health Forecast" caption="48-hour stockout prediction">
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" style={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stock"
                    stroke="#3b82f6"
                    fill="url(#stockGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="demand"
                    stroke="#ef4444"
                    fill="url(#demandGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </OperationPanel>

          {/* AI Recommendations Panel */}
          <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-emerald-200 bg-white text-emerald-700 shadow-sm">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">AI Recommendations</h3>
                  <p className="mt-1 text-xs font-medium text-slate-600">Ranked replenishment actions for selected SKU</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-bold uppercase text-emerald-700">
                Live
              </span>
            </div>

            {urgentRecommendation ? (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-700">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">Primary action</p>
                    <p className="mt-1 text-sm font-bold leading-5 text-slate-950">{urgentRecommendation.suggested_action}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{urgentRecommendation.reason}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-4 space-y-3">
              {topRecommendations.map((item) => (
                <div key={`${item.platform}-${item.dark_store}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <PlatformPill platform={item.platform} />
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                          <Warehouse className="h-3 w-3" />
                          {item.dark_store}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{item.expected_impact}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <SeverityPill severity={item.severity} />
                        <span className="text-xs font-semibold text-slate-500">{item.hours_to_stockout}h cover</span>
                        <span className="text-xs font-semibold text-blue-700">+{item.recommended_units} units</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setReportGenerated(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-800"
            >
              <FileText className="h-4 w-4" />
              Generate Inventory Report
            </button>
          </div>
        </div>

        {/* AI Generated Report */}
        {reportGenerated ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">AI Inventory Report</h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Generated for {selectedSku} at {reportGeneratedAt}
                  </p>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Export summary
              </button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <ReportMetric icon={Package} label="Stores monitored" value={String(filteredData.length)} />
              <ReportMetric icon={AlertTriangle} label="Priority risks" value={String(criticalCount + highCount)} />
              <ReportMetric icon={Sparkles} label="Units recommended" value={String(totalRecommendedUnits)} />
            </div>
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-950">Recommendation narrative</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {urgentRecommendation
                  ? `${urgentRecommendation.platform} ${urgentRecommendation.dark_store} is the top action because it has ${urgentRecommendation.hours_to_stockout} hours of cover and a risk score of ${urgentRecommendation.risk_score}. ${urgentRecommendation.suggested_action}`
                  : "No inventory risk rows are available for this SKU. Keep monitoring marketplace demand before placing replenishment."}
              </p>
            </div>
          </div>
        ) : null}

        {/* SKU Inventory Table */}
        <OperationPanel icon={Warehouse} title="Store-Level Inventory" caption="Real-time stock levels across all dark stores">
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-700">
                  <th className="pb-3 pr-4">Platform</th>
                  <th className="pb-3 pr-4">Dark Store</th>
                  <th className="pb-3 pr-4">City</th>
                  <th className="pb-3 pr-4">Current Stock</th>
                  <th className="pb-3 pr-4">Hourly Sales</th>
                  <th className="pb-3 pr-4">Hours to Stockout</th>
                  <th className="pb-3 pr-4">Risk Score</th>
                  <th className="pb-3 pr-4">Severity</th>
                  <th className="pb-3">Recommended Units</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={`${item.platform}-${item.dark_store}`}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 pr-4 font-medium text-slate-900"><PlatformBadge platform={item.platform} /></td>
                    <td className="py-3 pr-4 text-slate-700">{item.dark_store}</td>
                    <td className="py-3 pr-4 text-slate-700">{item.city}</td>
                    <td className="py-3 pr-4 font-semibold text-slate-900">
                      {item.inventory_units}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{item.hourly_sales}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`font-semibold ${
                          item.hours_to_stockout < 12
                            ? "text-red-600"
                            : item.hours_to_stockout < 24
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.hours_to_stockout}h
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-slate-200">
                          <div
                            className={`h-2 rounded-full ${
                              item.risk_score > 70
                                ? "bg-red-500"
                                : item.risk_score > 40
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${item.risk_score}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">{item.risk_score}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <SeverityBadge severity={item.severity} />
                    </td>
                    <td className="py-3 font-semibold text-blue-600">
                      +{item.recommended_units}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </OperationPanel>

        {/* Risk Distribution */}
        <OperationPanel icon={ClipboardList} title="Risk Distribution by Platform" caption="Average risk score comparison">
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={riskDistribution}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="platform" stroke="#64748b" style={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="risk" radius={[8, 8, 0, 0]}>
                  {riskDistribution.map((item) => (
                    <Cell key={item.platform} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </OperationPanel>
    </OperationPageShell>
  );
}

function PlatformPill({ platform }: { platform: string }) {
  const styles =
    platform === "Blinkit"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : platform === "Zepto"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : "border-orange-200 bg-orange-50 text-orange-700";

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles}`}>{platform}</span>;
}

function SeverityPill({ severity }: { severity: string }) {
  const styles =
    severity === "critical"
      ? "border-red-200 bg-red-50 text-red-700"
      : severity === "high"
      ? "border-orange-200 bg-orange-50 text-orange-700"
      : severity === "medium"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase ${styles}`}>{severity}</span>;
}

function ReportMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>
        <Icon className="h-6 w-6 text-slate-500" />
      </div>
    </div>
  );
}

// Made with Bob
