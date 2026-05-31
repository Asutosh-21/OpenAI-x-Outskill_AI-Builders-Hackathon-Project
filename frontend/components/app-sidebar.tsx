"use client";

import {
    Activity,
    BadgeIndianRupee,
    BarChart3,
    Bell,
    Boxes,
    BrainCircuit,
    FileText,
    LayoutDashboard,
    Megaphone,
    Package,
    Plug,
    RotateCcw,
    Settings,
    Shuffle,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    section: "ShelfSync AI",
    items: [
      { name: "Command Center", href: "/", icon: LayoutDashboard },
      { name: "AI Copilot", href: "/copilot", icon: BrainCircuit },
    ],
  },
  {
    section: "OPERATIONS",
    items: [
      { name: "Inventory Intelligence", href: "/inventory", icon: Package },
      { name: "Ad Intelligence", href: "/ads", icon: Megaphone },
      { name: "Pooling Optimizer", href: "/pooling", icon: Shuffle },
      { name: "Catalog Intelligence", href: "/catalog", icon: FileText },
      { name: "Returns Audit", href: "/returns", icon: RotateCcw },
      { name: "Finance Intelligence", href: "/finance", icon: BadgeIndianRupee },
    ],
  },
  {
    section: "ANALYTICS",
    items: [
      { name: "Marketplace Analytics", href: "/marketplace", icon: TrendingUp },
      { name: "Demand Forecasting", href: "/demand", icon: Activity },
      { name: "Revenue Intelligence", href: "/revenue", icon: BarChart3 },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { name: "Alerts Center", href: "/alerts", icon: Bell },
      { name: "Marketplace Connectors", href: "/connectors", icon: Plug },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-900">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
          <Boxes className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-base font-bold text-white">ShelfSync AI</p>
          <p className="text-xs text-slate-400">Ops Copilot</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4">
        {navigation.map((group) => (
          <div key={group.section} className="mb-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {group.section}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-slate-700 px-6 py-4">
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
          <p className="text-xs font-semibold text-blue-300">AI-Powered Platform</p>
          <p className="mt-1 text-xs text-slate-400">
            Real-time operations intelligence for Blinkit, Zepto & Instamart
          </p>
        </div>
      </div>
    </aside>
  );
}

// Made with Bob
