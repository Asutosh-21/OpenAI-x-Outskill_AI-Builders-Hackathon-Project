"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Package, ShoppingCart, Target, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { api } from "@/lib/api";
import { money } from "@/lib/format";

export default function MarketplacePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const dashboard = useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });
  const inventory = useQuery({ queryKey: ["inventory"], queryFn: api.inventory });

  if (dashboard.isLoading || inventory.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-slate-600">Loading marketplace data...</p>
        </div>
      </div>
    );
  }

  if (dashboard.error || !dashboard.data) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-red-900">Failed to load marketplace data</p>
        </div>
      </div>
    );
  }

  // Calculate marketplace metrics
  const platformData = [
    { 
      platform: "Blinkit", 
      gmv: 1850000, 
      orders: 3420, 
      avgOrderValue: 541,
      growth: 15.2,
      marketShare: 41,
      color: "#ef4444"
    },
    { 
      platform: "Zepto", 
      gmv: 1620000, 
      orders: 2980, 
      avgOrderValue: 544,
      growth: 12.8,
      marketShare: 36,
      color: "#3b82f6"
    },
    { 
      platform: "Swiggy Instamart", 
      gmv: 1050000, 
      orders: 1890, 
      avgOrderValue: 556,
      growth: 8.5,
      marketShare: 23,
      color: "#10b981"
    },
  ];

  const totalGMV = platformData.reduce((sum, p) => sum + p.gmv, 0);
  const totalOrders = platformData.reduce((sum, p) => sum + p.orders, 0);
  const avgOrderValue = totalGMV / totalOrders;

  // GMV Trend
  const gmvTrend = [
    { day: "Mon", blinkit: 280000, zepto: 240000, instamart: 160000 },
    { day: "Tue", blinkit: 290000, zepto: 250000, instamart: 165000 },
    { day: "Wed", blinkit: 270000, zepto: 235000, instamart: 155000 },
    { day: "Thu", blinkit: 260000, zepto: 230000, instamart: 150000 },
    { day: "Fri", blinkit: 300000, zepto: 260000, instamart: 170000 },
    { day: "Sat", blinkit: 240000, zepto: 210000, instamart: 130000 },
    { day: "Sun", blinkit: 210000, zepto: 195000, instamart: 120000 },
  ];

  // Category performance
  const categoryPerformance = [
    { category: "Electronics", gmv: 2100000, orders: 1620, growth: 18.5 },
    { category: "FMCG", gmv: 1520000, orders: 3840, growth: 12.3 },
    { category: "Beauty", gmv: 900000, orders: 2830, growth: 15.7 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Marketplace Analytics</h1>
            <p className="mt-1 text-sm text-slate-600">
              Cross-platform performance analysis and GMV tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
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
                <p className="text-xs font-medium text-slate-600">Total GMV</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{money(totalGMV)}</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="font-medium text-green-600">+13.2%</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">Total Orders</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{totalOrders.toLocaleString()}</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="font-medium text-green-600">+8.7%</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">Avg Order Value</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">₹{Math.round(avgOrderValue)}</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="font-medium text-green-600">+4.2%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">Active Platforms</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <Users className="h-3 w-3 text-blue-600" />
                  <span className="font-medium text-slate-600">All connected</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* GMV Trend Chart */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-900">GMV Trend by Platform</h3>
          <p className="text-xs text-slate-600 mt-1">7-day gross merchandise value comparison</p>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmvTrend}>
                <defs>
                  <linearGradient id="blinkitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="zeptoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="instamartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
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
                  dataKey="blinkit"
                  stroke="#ef4444"
                  fill="url(#blinkitGradient)"
                  strokeWidth={2}
                  name="Blinkit"
                />
                <Area
                  type="monotone"
                  dataKey="zepto"
                  stroke="#3b82f6"
                  fill="url(#zeptoGradient)"
                  strokeWidth={2}
                  name="Zepto"
                />
                <Area
                  type="monotone"
                  dataKey="instamart"
                  stroke="#10b981"
                  fill="url(#instamartGradient)"
                  strokeWidth={2}
                  name="Instamart"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Performance Cards */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Platform Performance</h3>
          <div className="grid gap-4 lg:grid-cols-3">
            {platformData.map((platform) => (
              <div
                key={platform.platform}
                className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-slate-900">{platform.platform}</h4>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">+{platform.growth}%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-600">GMV</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{money(platform.gmv)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-600">Orders</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{platform.orders.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">AOV</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">₹{platform.avgOrderValue}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-600">Market Share</span>
                      <span className="font-semibold text-slate-900">{platform.marketShare}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${platform.marketShare}%`,
                          backgroundColor: platform.color
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance & Market Share */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Performance */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Category Performance</h3>
            <p className="text-xs text-slate-600 mt-1">GMV by product category</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#64748b" style={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" style={{ fontSize: 12 }} tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                    }}
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, "GMV"]}
                  />
                  <Bar dataKey="gmv" radius={[8, 8, 0, 0]}>
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ec4899" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Share Pie */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Market Share Distribution</h3>
            <p className="text-xs text-slate-600 mt-1">GMV contribution by platform</p>
            <div className="mt-4 h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    dataKey="gmv"
                    nameKey="platform"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.platform}: ${entry.marketShare}%`}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                    }}
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, "GMV"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insights Banner */}
        <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="h-6 w-6 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900">Marketplace Insights</h3>
              <div className="mt-4 space-y-2 text-sm text-blue-800">
                <p>• <strong>Blinkit</strong> leads with 41% market share and highest GMV of ₹18.5L</p>
                <p>• <strong>Electronics</strong> category shows strongest growth at +18.5%</p>
                <p>• Average order value increased by 4.2% to ₹{Math.round(avgOrderValue)}</p>
                <p>• All 3 platforms showing positive growth trends this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob