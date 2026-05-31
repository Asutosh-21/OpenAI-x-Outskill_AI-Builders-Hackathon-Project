"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BadgeIndianRupee, DollarSign, Target, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { api } from "@/lib/api";
import { money } from "@/lib/format";

export default function RevenuePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const dashboard = useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });
  const inventory = useQuery({ queryKey: ["inventory"], queryFn: api.inventory });

  if (dashboard.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-slate-600">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  if (dashboard.error || !dashboard.data) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-red-900">Failed to load revenue data</p>
        </div>
      </div>
    );
  }

  // Revenue metrics
  const totalRevenue = 4520000;
  const revenueGrowth = 13.5;
  const targetRevenue = 5000000;
  const revenueAchievement = (totalRevenue / targetRevenue) * 100;

  // Revenue trend data
  const revenueTrend = [
    { day: "Mon", revenue: 620000, target: 650000, growth: 12.5 },
    { day: "Tue", revenue: 680000, target: 650000, growth: 15.2 },
    { day: "Wed", revenue: 650000, target: 650000, growth: 13.8 },
    { day: "Thu", revenue: 640000, target: 650000, growth: 12.1 },
    { day: "Fri", revenue: 720000, target: 650000, growth: 18.5 },
    { day: "Sat", revenue: 580000, target: 650000, growth: 8.7 },
    { day: "Sun", revenue: 630000, target: 650000, growth: 11.2 },
  ];

  // Platform revenue breakdown
  const platformRevenue = [
    { platform: "Blinkit", revenue: 1850000, percentage: 41, growth: 15.2, color: "#ef4444" },
    { platform: "Zepto", revenue: 1620000, percentage: 36, growth: 12.8, color: "#3b82f6" },
    { platform: "Instamart", revenue: 1050000, percentage: 23, growth: 8.5, color: "#10b981" },
  ];

  // SKU revenue contribution
  const skuRevenue = [
    { sku: "SYN-BUDS-MINI", revenue: 2100000, orders: 1620, aov: 1296, growth: 18.5 },
    { sku: "FMCG-PROTEIN-250", revenue: 1520000, orders: 10200, aov: 149, growth: 12.3 },
    { sku: "BEAUTY-SERUM-30", revenue: 900000, orders: 1287, aov: 699, growth: 15.7 },
  ];

  // Revenue by channel
  const channelRevenue = [
    { channel: "Organic", revenue: 2710000, percentage: 60 },
    { channel: "Paid Ads", revenue: 1356000, percentage: 30 },
    { channel: "Referral", revenue: 452000, percentage: 10 },
  ];

  // City-wise revenue
  const cityRevenue = [
    { city: "Delhi NCR", revenue: 1580000, growth: 16.2 },
    { city: "Mumbai", revenue: 1240000, growth: 12.5 },
    { city: "Bengaluru", revenue: 1020000, growth: 14.8 },
    { city: "Hyderabad", revenue: 680000, growth: 10.3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Revenue Intelligence</h1>
            <p className="mt-1 text-sm text-slate-600">
              Revenue analytics and profitability insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="revenue">Revenue</option>
              <option value="growth">Growth Rate</option>
              <option value="aov">Avg Order Value</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">Total Revenue</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{money(totalRevenue)}</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="font-medium text-green-600">+{revenueGrowth}%</span>
                </div>
              </div>
              <BadgeIndianRupee className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-700">Target Achievement</p>
                <p className="mt-2 text-2xl font-bold text-green-900">{revenueAchievement.toFixed(1)}%</p>
                <div className="mt-2 h-1.5 rounded-full bg-green-200">
                  <div
                    className="h-1.5 rounded-full bg-green-600"
                    style={{ width: `${revenueAchievement}%` }}
                  />
                </div>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">Avg Order Value</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">₹548</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="font-medium text-green-600">+4.2%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-700">Revenue at Risk</p>
                <p className="mt-2 text-2xl font-bold text-orange-900">{money(dashboard.data.kpis.revenue_at_risk_inr)}</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <AlertTriangle className="h-3 w-3 text-orange-700" />
                  <span className="font-medium text-orange-700">Stockout risk</span>
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-900">Revenue Trend vs Target</h3>
          <p className="text-xs text-slate-600 mt-1">7-day revenue performance against targets</p>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" style={{ fontSize: 12 }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                  }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform & SKU Revenue */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Platform Revenue */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Revenue by Platform</h3>
            <p className="text-xs text-slate-600 mt-1">Marketplace contribution and growth</p>
            <div className="mt-4 space-y-4">
              {platformRevenue.map((platform) => (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      <p className="text-sm font-medium text-slate-900">{platform.platform}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-900">{money(platform.revenue)}</span>
                      <span className="text-xs font-medium text-green-600">+{platform.growth}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${platform.percentage}%`,
                        backgroundColor: platform.color
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-600">{platform.percentage}% of total revenue</p>
                </div>
              ))}
            </div>
          </div>

          {/* SKU Revenue */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Top Revenue SKUs</h3>
            <p className="text-xs text-slate-600 mt-1">Product-wise revenue contribution</p>
            <div className="mt-4 space-y-3">
              {skuRevenue.map((sku, index) => (
                <div key={sku.sku} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {index + 1}
                      </span>
                      <p className="text-sm font-semibold text-slate-900">{sku.sku}</p>
                    </div>
                    <span className="text-xs font-medium text-green-600">+{sku.growth}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-600">Revenue</p>
                      <p className="font-semibold text-slate-900">{money(sku.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Orders</p>
                      <p className="font-semibold text-slate-900">{sku.orders.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">AOV</p>
                      <p className="font-semibold text-slate-900">₹{sku.aov}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Channel & City Revenue */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Channel Revenue */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Revenue by Channel</h3>
            <p className="text-xs text-slate-600 mt-1">Acquisition channel breakdown</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="channel" stroke="#64748b" style={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" style={{ fontSize: 12 }} tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                    }}
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                    <Cell fill="#10b981" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#8b5cf6" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* City Revenue */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Revenue by City</h3>
            <p className="text-xs text-slate-600 mt-1">Geographic revenue distribution</p>
            <div className="mt-4 space-y-3">
              {cityRevenue.map((city) => (
                <div key={city.city} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{city.city}</p>
                    <p className="mt-1 text-xs text-slate-600">Growth: +{city.growth}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">{money(city.revenue)}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {((city.revenue / totalRevenue) * 100).toFixed(1)}% share
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Insights */}
        <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
          <div className="flex items-start gap-4">
            <BadgeIndianRupee className="h-6 w-6 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900">Revenue Intelligence Summary</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-blue-200 bg-white p-4">
                  <p className="text-xs font-medium text-slate-600">Weekly Growth</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">+{revenueGrowth}%</p>
                  <p className="mt-1 text-xs text-green-600">Above target</p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-white p-4">
                  <p className="text-xs font-medium text-slate-600">Best Performer</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">Blinkit</p>
                  <p className="mt-1 text-xs text-slate-600">41% revenue share</p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-white p-4">
                  <p className="text-xs font-medium text-slate-600">Top SKU</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">SparkBuds Mini</p>
                  <p className="mt-1 text-xs text-slate-600">₹21L revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob