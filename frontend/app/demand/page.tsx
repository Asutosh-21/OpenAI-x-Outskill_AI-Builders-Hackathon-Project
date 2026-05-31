"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, Calendar, Cloud, MapPin, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { api } from "@/lib/api";

export default function DemandPage() {
  const [selectedSku, setSelectedSku] = useState("SYN-BUDS-MINI");
  const [forecastHorizon, setForecastHorizon] = useState("7d");
  const inventory = useQuery({ queryKey: ["inventory"], queryFn: api.inventory });

  if (inventory.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-slate-600">Loading demand forecasts...</p>
        </div>
      </div>
    );
  }

  if (inventory.error || !inventory.data) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-red-900">Failed to load demand data</p>
        </div>
      </div>
    );
  }

  const skuOptions = Array.from(new Set(inventory.data.map((item) => item.sku)));

  // Demand forecast data (48-hour prediction)
  const demandForecast = [
    { hour: "0h", actual: 25, forecast: 25, confidence: 95 },
    { hour: "6h", actual: 28, forecast: 27, confidence: 92 },
    { hour: "12h", actual: 32, forecast: 31, confidence: 90 },
    { hour: "18h", actual: 35, forecast: 36, confidence: 88 },
    { hour: "24h", actual: null, forecast: 38, confidence: 85 },
    { hour: "30h", actual: null, forecast: 42, confidence: 82 },
    { hour: "36h", actual: null, forecast: 45, confidence: 78 },
    { hour: "42h", actual: null, forecast: 48, confidence: 75 },
    { hour: "48h", actual: null, forecast: 50, confidence: 72 },
  ];

  // Weekly demand pattern
  const weeklyPattern = [
    { day: "Mon", demand: 180, baseline: 160 },
    { day: "Tue", demand: 195, baseline: 165 },
    { day: "Wed", demand: 175, baseline: 160 },
    { day: "Thu", demand: 170, baseline: 155 },
    { day: "Fri", demand: 220, baseline: 170 },
    { day: "Sat", demand: 150, baseline: 140 },
    { day: "Sun", demand: 140, baseline: 130 },
  ];

  // Demand heatmap by location and time
  const demandHeatmap = [
    { location: "Delhi NCR", morning: 45, afternoon: 62, evening: 88, night: 35 },
    { location: "Mumbai", morning: 38, afternoon: 55, evening: 75, night: 28 },
    { location: "Bengaluru", morning: 42, afternoon: 58, evening: 80, night: 32 },
    { location: "Hyderabad", morning: 35, afternoon: 48, evening: 65, night: 25 },
  ];

  // External factors
  const externalFactors = [
    { factor: "Weather", impact: "High", description: "Rain expected - 25% demand spike", color: "blue" },
    { factor: "Events", impact: "Medium", description: "College fest nearby - 15% increase", color: "purple" },
    { factor: "Seasonality", impact: "Low", description: "Normal seasonal pattern", color: "green" },
  ];

  const totalDemand = weeklyPattern.reduce((sum, d) => sum + d.demand, 0);
  const avgDailyDemand = Math.round(totalDemand / weeklyPattern.length);
  const peakDemandDay = weeklyPattern.reduce((max, d) => d.demand > max.demand ? d : max);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Demand Forecasting</h1>
            <p className="mt-1 text-sm text-slate-600">
              AI-powered demand prediction and trend analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={forecastHorizon}
              onChange={(e) => setForecastHorizon(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="7d">7-Day Forecast</option>
              <option value="14d">14-Day Forecast</option>
              <option value="30d">30-Day Forecast</option>
            </select>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {skuOptions.map((sku) => (
                <option key={sku} value={sku}>
                  {sku}
                </option>
              ))}
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
                <p className="text-xs font-medium text-slate-600">Avg Daily Demand</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{avgDailyDemand}</p>
                <p className="mt-1 text-xs text-slate-500">units/day</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-700">Peak Demand</p>
                <p className="mt-2 text-2xl font-bold text-orange-900">{peakDemandDay.demand}</p>
                <p className="mt-1 text-xs text-orange-600">on {peakDemandDay.day}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-700">Forecast Accuracy</p>
                <p className="mt-2 text-2xl font-bold text-green-900">87%</p>
                <p className="mt-1 text-xs text-green-600">Last 30 days</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">Demand Volatility</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">Medium</p>
                <p className="mt-1 text-xs text-slate-500">±18% variance</p>
              </div>
              <Activity className="h-8 w-8 text-slate-600" />
            </div>
          </div>
        </div>

        {/* 48-Hour Demand Forecast */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-900">48-Hour Demand Forecast</h3>
          <p className="text-xs text-slate-600 mt-1">AI-predicted demand with confidence intervals</p>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={demandForecast}>
                <defs>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
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
                  dataKey="forecast"
                  stroke="#3b82f6"
                  fill="url(#forecastGradient)"
                  strokeWidth={2}
                  name="Forecast"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                  name="Actual"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Pattern & Demand Heatmap */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Demand Pattern */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Weekly Demand Pattern</h3>
            <p className="text-xs text-slate-600 mt-1">Historical vs baseline demand</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weeklyPattern}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="demand" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Demand Heatmap */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Demand Heatmap by Location</h3>
            <p className="text-xs text-slate-600 mt-1">Hourly demand patterns across cities</p>
            <div className="mt-4 space-y-3">
              {demandHeatmap.map((location) => (
                <div key={location.location} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-600" />
                    <p className="text-sm font-medium text-slate-900">{location.location}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Morning", value: location.morning, color: "bg-blue-500" },
                      { label: "Afternoon", value: location.afternoon, color: "bg-yellow-500" },
                      { label: "Evening", value: location.evening, color: "bg-orange-500" },
                      { label: "Night", value: location.night, color: "bg-purple-500" },
                    ].map((time) => (
                      <div key={time.label} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <p className="text-xs text-slate-600">{time.label}</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{time.value}</p>
                        <div className="mt-2 h-1 rounded-full bg-slate-200">
                          <div
                            className={`h-1 rounded-full ${time.color}`}
                            style={{ width: `${(time.value / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* External Factors */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-900">External Demand Factors</h3>
          <p className="text-xs text-slate-600 mt-1">Events and conditions affecting demand</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {externalFactors.map((factor) => (
              <div
                key={factor.factor}
                className={`rounded-lg border p-4 ${
                  factor.color === "blue"
                    ? "border-blue-200 bg-blue-50"
                    : factor.color === "purple"
                    ? "border-purple-200 bg-purple-50"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {factor.factor === "Weather" && <Cloud className="h-5 w-5 text-blue-600" />}
                  {factor.factor === "Events" && <Calendar className="h-5 w-5 text-purple-600" />}
                  {factor.factor === "Seasonality" && <Activity className="h-5 w-5 text-green-600" />}
                  <p className="text-sm font-semibold text-slate-900">{factor.factor}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    factor.impact === "High"
                      ? "bg-red-100 text-red-700"
                      : factor.impact === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {factor.impact} Impact
                </span>
                <p className="mt-2 text-sm text-slate-700">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
          <div className="flex items-start gap-4">
            <Activity className="h-6 w-6 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900">AI Demand Insights</h3>
              <div className="mt-4 space-y-2 text-sm text-blue-800">
                <p>• <strong>Peak demand expected Friday evening</strong> - Increase safety stock by 30%</p>
                <p>• <strong>Weather-driven spike predicted</strong> - Rain forecast will boost demand by 25%</p>
                <p>• <strong>Delhi NCR shows highest evening demand</strong> - Optimize dark store inventory</p>
                <p>• <strong>Forecast accuracy at 87%</strong> - Model confidence is high for next 48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob