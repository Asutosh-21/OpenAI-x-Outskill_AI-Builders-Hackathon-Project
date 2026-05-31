"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BarChart3, BadgeIndianRupee, Megaphone, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

export default function AdsPage() {
  const [selectedSku, setSelectedSku] = useState("SYN-BUDS-MINI");
  const ads = useQuery({ queryKey: ["ads"], queryFn: api.ads });

  if (ads.isLoading) return <LoadingState label="Loading ad intelligence" />;
  if (ads.error || !ads.data) return <ErrorState label="Failed to load ad data" />;

  const filteredData = ads.data.filter((item) => item.sku === selectedSku);
  const skuOptions = Array.from(new Set(ads.data.map((item) => item.sku)));
  const totalSpend = filteredData.reduce((sum, item) => sum + item.daily_spend_inr, 0);
  const avgRoas = filteredData.length ? filteredData.reduce((sum, item) => sum + item.roas, 0) / filteredData.length : 0;
  const atRiskCampaigns = filteredData.filter((item) => item.severity === "critical" || item.severity === "high").length;
  const riskRatio = filteredData.length ? atRiskCampaigns / filteredData.length : 0;
  const roasTrendData = [
    { day: "Mon", roas: 2.8 },
    { day: "Tue", roas: 3.2 },
    { day: "Wed", roas: 2.9 },
    { day: "Thu", roas: 2.5 },
    { day: "Fri", roas: 2.1 },
    { day: "Sat", roas: 1.8 },
    { day: "Sun", roas: 1.5 },
  ];

  return (
    <OperationPageShell>
      <OperationHero
        icon={Megaphone}
        eyebrow="Ad command"
        title="Ad Intelligence"
        description="Synchronize campaign spend with shelf availability, ROAS movement, and SKU-level risk before ads create wasted demand."
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
        <OperationKpiCard icon={BadgeIndianRupee} label="Daily spend" value={money(totalSpend)} caption="Selected SKU" tone="blue" />
        <OperationKpiCard icon={TrendingUp} label="Average ROAS" value={`${avgRoas.toFixed(1)}x`} caption="Return on ad spend" tone="emerald" />
        <OperationKpiCard icon={AlertTriangle} label="At-risk campaigns" value={String(atRiskCampaigns)} caption="Spend needs action" tone="red" />
        <OperationKpiCard icon={Target} label="Active campaigns" value={String(filteredData.length)} caption="Live marketplace ads" tone="slate" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <OperationPanel className="lg:col-span-2" icon={TrendingUp} title="ROAS Trend" caption="7-day return on ad spend performance">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roasTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }} />
                <Line type="monotone" dataKey="roas" stroke="#0f766e" strokeWidth={3} dot={{ fill: "#0f766e", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </OperationPanel>

        <OperationPanel icon={AlertTriangle} title="Campaign Risk Gauge" caption="Inventory availability vs ad spend">
          <div className="flex flex-col items-center">
            <div className="relative h-36 w-36">
              <svg className="h-full w-full -rotate-90">
                <circle cx="72" cy="72" r="60" fill="none" stroke="#e2e8f0" strokeWidth="14" />
                <circle cx="72" cy="72" r="60" fill="none" stroke="#ef4444" strokeWidth="14" strokeDasharray={`${riskRatio * 377} 377`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <p className="text-3xl font-black text-slate-950">{Math.round(riskRatio * 100)}%</p>
                  <p className="text-xs font-bold uppercase text-slate-500">At risk</p>
                </div>
              </div>
            </div>
            <div className="mt-6 w-full space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600">Needs intervention</span>
                <span className="font-black text-red-600">{atRiskCampaigns}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600">Healthy</span>
                <span className="font-black text-emerald-600">{filteredData.length - atRiskCampaigns}</span>
              </div>
            </div>
          </div>
        </OperationPanel>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredData.length === 0 ? (
          <OperationPanel className="md:col-span-2 xl:col-span-3" icon={Megaphone} title="No Active Campaigns" caption="Select another SKU or sync marketplace ads to review campaign risk.">
            <div className="h-12" />
          </OperationPanel>
        ) : (
          filteredData.map((campaign) => (
            <div key={campaign.campaign_id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <PlatformBadge platform={campaign.platform} />
                  <h3 className="mt-3 text-base font-black leading-6 text-slate-950">{campaign.campaign}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{campaign.channel}</p>
                </div>
                <SeverityBadge severity={campaign.severity} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">Daily spend</p>
                  <p className="mt-1 text-lg font-black text-slate-950">{money(campaign.daily_spend_inr)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">ROAS</p>
                  <p className="mt-1 text-lg font-black text-slate-950">{campaign.roas.toFixed(1)}x</p>
                </div>
              </div>
              <p className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-xs font-medium leading-5 text-slate-600">{campaign.reason}</p>
              <button className="mt-4 w-full rounded-lg bg-slate-950 px-3 py-2.5 text-xs font-black text-white hover:bg-slate-800">
                {campaign.severity === "critical" || campaign.severity === "high" ? "Pause or reduce campaign" : "Optimize campaign"}
              </button>
            </div>
          ))
        )}
      </div>

      <OperationPanel icon={BarChart3} title="Spend vs Inventory Availability" caption="Campaign spend aligned with stock risk">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData.map((campaign) => ({ name: campaign.campaign.substring(0, 18), spend: campaign.daily_spend_inr, platform: campaign.platform }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: 10 }} angle={-35} textAnchor="end" height={74} />
              <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }} formatter={(value: any) => [money(Number(value)), "Spend"]} />
              <Bar dataKey="spend" radius={[8, 8, 0, 0]}>
                {filteredData.map((campaign) => (
                  <Cell key={campaign.campaign_id} fill={MARKETPLACE_COLORS[campaign.platform] ?? "#64748b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </OperationPanel>
    </OperationPageShell>
  );
}
