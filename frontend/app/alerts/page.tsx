"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Bell, Filter, Search } from "lucide-react";
import { useState } from "react";

import { api } from "@/lib/api";

export default function AlertsPage() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const alerts = useQuery({ queryKey: ["alerts"], queryFn: api.alerts });

  if (alerts.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-slate-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (alerts.error || !alerts.data) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-red-900">Failed to load alerts</p>
        </div>
      </div>
    );
  }

  const filteredAlerts = alerts.data.filter((alert) => {
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesSearch =
      searchQuery === "" ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const criticalCount = alerts.data.filter((a) => a.severity === "critical").length;
  const highCount = alerts.data.filter((a) => a.severity === "high").length;
  const mediumCount = alerts.data.filter((a) => a.severity === "medium").length;
  const lowCount = alerts.data.filter((a) => a.severity === "low").length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Alerts Center</h1>
            <p className="mt-1 text-sm text-slate-600">
              Prioritized operational alerts and notifications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-700">Critical</p>
                <p className="mt-2 text-2xl font-bold text-red-900">{criticalCount}</p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-700">High</p>
                <p className="mt-2 text-2xl font-bold text-orange-900">{highCount}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-700">Medium</p>
                <p className="mt-2 text-2xl font-bold text-yellow-900">{mediumCount}</p>
              </div>
              <Bell className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">Low</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{lowCount}</p>
              </div>
              <Bell className="h-8 w-8 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-slate-600" />
          <div className="flex gap-2">
            {["all", "critical", "high", "medium", "low"].map((severity) => (
              <button
                key={severity}
                onClick={() => setSeverityFilter(severity)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  severityFilter === severity
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
              <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-600">No alerts found</p>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-5 ${
                  alert.severity === "critical"
                    ? "border-red-200 bg-red-50"
                    : alert.severity === "high"
                    ? "border-orange-200 bg-orange-50"
                    : alert.severity === "medium"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          alert.severity === "critical"
                            ? "bg-red-100 text-red-700"
                            : alert.severity === "high"
                            ? "bg-orange-100 text-orange-700"
                            : alert.severity === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-500">{alert.type}</span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-slate-900">{alert.title}</h3>
                    <p className="mt-2 text-sm text-slate-700">{alert.message}</p>
                    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs font-semibold text-slate-900">Recommended Action:</p>
                      <p className="mt-1 text-sm text-blue-600">{alert.action}</p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Bell
                      className={`h-6 w-6 ${
                        alert.severity === "critical"
                          ? "text-red-600"
                          : alert.severity === "high"
                          ? "text-orange-600"
                          : alert.severity === "medium"
                          ? "text-yellow-600"
                          : "text-slate-600"
                      }`}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                    Take Action
                  </button>
                  <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    Dismiss
                  </button>
                  <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    Snooze
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Made with Bob
