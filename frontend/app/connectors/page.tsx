"use client";

import { AlertTriangle, CheckCircle2, Clock, Plug, RefreshCw, Settings, XCircle } from "lucide-react";
import { useState } from "react";

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState([
    {
      id: "blinkit",
      name: "Blinkit",
      status: "connected",
      lastSync: "2 minutes ago",
      syncFrequency: "Every 5 minutes",
      dataPoints: ["Orders", "Inventory", "Returns", "Payouts"],
      health: 98,
      color: "red",
    },
    {
      id: "zepto",
      name: "Zepto",
      status: "connected",
      lastSync: "5 minutes ago",
      syncFrequency: "Every 5 minutes",
      dataPoints: ["Orders", "Inventory", "Returns", "Payouts"],
      health: 95,
      color: "blue",
    },
    {
      id: "instamart",
      name: "Swiggy Instamart",
      status: "connected",
      lastSync: "3 minutes ago",
      syncFrequency: "Every 5 minutes",
      dataPoints: ["Orders", "Inventory", "Returns", "Payouts"],
      health: 92,
      color: "green",
    },
    {
      id: "google-ads",
      name: "Google Ads",
      status: "connected",
      lastSync: "10 minutes ago",
      syncFrequency: "Every 15 minutes",
      dataPoints: ["Campaigns", "Spend", "Performance"],
      health: 100,
      color: "yellow",
    },
    {
      id: "meta-ads",
      name: "Meta Ads",
      status: "warning",
      lastSync: "2 hours ago",
      syncFrequency: "Every 15 minutes",
      dataPoints: ["Campaigns", "Spend", "Performance"],
      health: 75,
      color: "blue",
    },
    {
      id: "erp",
      name: "ERP System",
      status: "disconnected",
      lastSync: "Never",
      syncFrequency: "Every 30 minutes",
      dataPoints: ["Inventory", "Orders", "Finance"],
      health: 0,
      color: "gray",
    },
  ]);

  const connectedCount = connectors.filter((c) => c.status === "connected").length;
  const warningCount = connectors.filter((c) => c.status === "warning").length;
  const disconnectedCount = connectors.filter((c) => c.status === "disconnected").length;

  const handleSync = (id: string) => {
    setConnectors(
      connectors.map((c) =>
        c.id === id ? { ...c, lastSync: "Just now" } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Marketplace Connectors</h1>
            <p className="mt-1 text-sm text-slate-600">
              API integrations and data sync management
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            <Plug className="h-4 w-4" />
            Add New Connector
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 space-y-6">
        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">Total Connectors</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{connectors.length}</p>
              </div>
              <Plug className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-700">Connected</p>
                <p className="mt-2 text-2xl font-bold text-green-900">{connectedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-700">Warnings</p>
                <p className="mt-2 text-2xl font-bold text-orange-900">{warningCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-700">Disconnected</p>
                <p className="mt-2 text-2xl font-bold text-red-900">{disconnectedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Connector Cards */}
        <div className="grid gap-4 lg:grid-cols-2">
          {connectors.map((connector) => (
            <div
              key={connector.id}
              className={`rounded-lg border p-6 ${
                connector.status === "connected"
                  ? "border-green-200 bg-white"
                  : connector.status === "warning"
                  ? "border-orange-200 bg-orange-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      connector.status === "connected"
                        ? "bg-green-100"
                        : connector.status === "warning"
                        ? "bg-orange-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Plug
                      className={`h-6 w-6 ${
                        connector.status === "connected"
                          ? "text-green-600"
                          : connector.status === "warning"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{connector.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      {connector.status === "connected" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Connected
                        </span>
                      )}
                      {connector.status === "warning" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                          <AlertTriangle className="h-3 w-3" />
                          Warning
                        </span>
                      )}
                      {connector.status === "disconnected" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          <XCircle className="h-3 w-3" />
                          Disconnected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="rounded-lg border border-slate-300 bg-white p-2 hover:bg-slate-50 transition-colors">
                  <Settings className="h-4 w-4 text-slate-600" />
                </button>
              </div>

              {/* Sync Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Last Sync:</span>
                  <span className="font-medium text-slate-900">{connector.lastSync}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Frequency:</span>
                  <span className="font-medium text-slate-900">{connector.syncFrequency}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Health:</span>
                    <span className="font-semibold text-slate-900">{connector.health}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className={`h-2 rounded-full ${
                        connector.health >= 90
                          ? "bg-green-500"
                          : connector.health >= 70
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${connector.health}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Data Points */}
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-600 mb-2">Data Points:</p>
                <div className="flex flex-wrap gap-2">
                  {connector.dataPoints.map((point) => (
                    <span
                      key={point}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {connector.status === "connected" || connector.status === "warning" ? (
                  <>
                    <button
                      onClick={() => handleSync(connector.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Sync Now
                    </button>
                    <button className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                      View Logs
                    </button>
                  </>
                ) : (
                  <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
                    Connect Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sync Activity Log */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Sync Activity</h3>
          <div className="space-y-3">
            {[
              { connector: "Blinkit", action: "Data sync completed", time: "2 minutes ago", status: "success" },
              { connector: "Zepto", action: "Inventory updated", time: "5 minutes ago", status: "success" },
              { connector: "Google Ads", action: "Campaign data synced", time: "10 minutes ago", status: "success" },
              { connector: "Meta Ads", action: "Sync failed - API timeout", time: "2 hours ago", status: "error" },
              { connector: "Swiggy Instamart", action: "Orders synced", time: "3 minutes ago", status: "success" },
            ].map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  {log.status === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-900">{log.connector}</p>
                    <p className="text-xs text-slate-600">{log.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-4 w-4" />
                  {log.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
          <div className="flex items-start gap-4">
            <Plug className="h-6 w-6 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900">Connector Status</h3>
              <div className="mt-4 space-y-2 text-sm text-blue-800">
                <p>• <strong>{connectedCount} connectors</strong> are actively syncing data</p>
                <p>• <strong>Meta Ads</strong> requires attention - last sync 2 hours ago</p>
                <p>• <strong>ERP System</strong> is not connected - connect to enable full functionality</p>
                <p>• All marketplace connectors are healthy and syncing every 5 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob