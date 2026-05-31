"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BadgeIndianRupee, BarChart3, DollarSign, Percent, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {
  ErrorState,
  LoadingState,
  OperationHero,
  OperationKpiCard,
  OperationPageShell,
  OperationPanel,
  OperationSelect,
  PlatformBadge,
} from "@/components/operations-ui";
import { api } from "@/lib/api";
import { money } from "@/lib/format";

export default function FinancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const dashboard = useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });
  const returns = useQuery({ queryKey: ["returns"], queryFn: api.returns });
  const ads = useQuery({ queryKey: ["ads"], queryFn: api.ads });

  if (dashboard.isLoading || returns.isLoading) return <LoadingState label="Loading finance intelligence" />;
  if (dashboard.error || !dashboard.data) return <ErrorState label="Failed to load finance data" />;

  const totalRevenue = 4520000;
  const totalCost = 3200000;
  const grossProfit = totalRevenue - totalCost;
  const grossMargin = (grossProfit / totalRevenue) * 100;
  const adSpend = ads.data?.reduce((sum, ad) => sum + ad.daily_spend_inr, 0) || 0;
  const returnLeakage = returns.data?.reduce((sum, ret) => sum + ret.payout_gap_inr, 0) || 0;
  const revenueAtRisk = dashboard.data.kpis.revenue_at_risk_inr;
  const revenueTrend = [
    { day: "Mon", revenue: 620000, cost: 440000, profit: 180000 },
    { day: "Tue", revenue: 680000, cost: 470000, profit: 210000 },
    { day: "Wed", revenue: 650000, cost: 460000, profit: 190000 },
    { day: "Thu", revenue: 640000, cost: 450000, profit: 190000 },
    { day: "Fri", revenue: 720000, cost: 500000, profit: 220000 },
    { day: "Sat", revenue: 580000, cost: 410000, profit: 170000 },
    { day: "Sun", revenue: 630000, cost: 470000, profit: 160000 },
  ];
  const platformRevenue = [
    { platform: "Blinkit", revenue: 1850000, margin: 32, color: "#16a34a" },
    { platform: "Zepto", revenue: 1620000, margin: 28, color: "#1d4ed8" },
    { platform: "Instamart", revenue: 1050000, margin: 25, color: "#f97316" },
  ];
  const skuProfitability = [
    { sku: "SYN-BUDS-MINI", revenue: 2100000, cost: 1400000, margin: 33.3 },
    { sku: "FMCG-PROTEIN-250", revenue: 1520000, cost: 1100000, margin: 27.6 },
    { sku: "BEAUTY-SERUM-30", revenue: 900000, cost: 700000, margin: 22.2 },
  ];

  return (
    <OperationPageShell>
      <OperationHero
        icon={BadgeIndianRupee}
        eyebrow="Finance command"
        title="Finance Intelligence"
        description="Revenue, margin, leakage, and profitability analytics for quick-commerce operating decisions."
      >
        <OperationSelect value={selectedPeriod} onChange={setSelectedPeriod}>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </OperationSelect>
      </OperationHero>

      <div className="grid gap-4 md:grid-cols-4">
        <OperationKpiCard icon={BadgeIndianRupee} label="Total revenue" value={money(totalRevenue)} caption="+12.5% vs prior period" tone="blue" />
        <OperationKpiCard icon={TrendingUp} label="Gross profit" value={money(grossProfit)} caption={`${grossMargin.toFixed(1)}% margin`} tone="emerald" />
        <OperationKpiCard icon={AlertTriangle} label="Revenue at risk" value={money(revenueAtRisk)} caption="Stockout exposure" tone="orange" />
        <OperationKpiCard icon={DollarSign} label="Revenue leakage" value={money(returnLeakage + adSpend * 0.15)} caption="Returns + ad waste" tone="red" />
      </div>

      <OperationPanel icon={TrendingUp} title="Revenue & Profitability Trend" caption={`${selectedPeriod.toUpperCase()} revenue, cost, and profit analysis`}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" style={{ fontSize: 12 }} tickFormatter={(value) => money(Number(value))} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }} formatter={(value: any) => [money(Number(value)), ""]} />
              <Area type="monotone" dataKey="revenue" stroke="#1d4ed8" fill="url(#revenueGradient)" strokeWidth={3} name="Revenue" />
              <Area type="monotone" dataKey="profit" stroke="#16a34a" fill="url(#profitGradient)" strokeWidth={3} name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </OperationPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <OperationPanel icon={BarChart3} title="Revenue by Platform" caption="Marketplace-wise revenue contribution">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="platform" stroke="#64748b" style={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" style={{ fontSize: 12 }} tickFormatter={(value) => money(Number(value))} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }} formatter={(value: any) => [money(Number(value)), "Revenue"]} />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                  {platformRevenue.map((platform) => (
                    <Cell key={platform.platform} fill={platform.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </OperationPanel>

        <OperationPanel icon={Percent} title="SKU Profitability" caption="Product-wise margin analysis">
          <div className="space-y-4">
            {skuProfitability.map((sku) => (
              <div key={sku.sku} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-slate-950">{sku.sku}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-black ${sku.margin >= 30 ? "bg-emerald-100 text-emerald-700" : sku.margin >= 25 ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-700"}`}>
                    {sku.margin.toFixed(1)}% margin
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-500">Revenue</p>
                    <p className="mt-1 font-black text-slate-950">{money(sku.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Profit</p>
                    <p className="mt-1 font-black text-emerald-700">{money(sku.revenue - sku.cost)}</p>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${sku.margin}%` }} />
                </div>
              </div>
            ))}
          </div>
        </OperationPanel>
      </div>

      <section className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-lg border border-blue-200 bg-white text-blue-700 shadow-sm">
            <BadgeIndianRupee className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="text-base font-black text-blue-950">Financial Health Summary</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <SummaryMetric label="Gross margin" value={`${grossMargin.toFixed(1)}%`} caption="Healthy margin" />
              <SummaryMetric label="Ad spend ratio" value={`${((adSpend * 7 / totalRevenue) * 100).toFixed(1)}%`} caption="Of revenue" />
              <SummaryMetric label="Return leakage" value={`${((returnLeakage / totalRevenue) * 100).toFixed(2)}%`} caption="Needs attention" />
            </div>
          </div>
        </div>
      </section>
    </OperationPageShell>
  );
}

function SummaryMetric({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{caption}</p>
    </div>
  );
}
