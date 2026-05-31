"use client";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  PlugZap,
  Save,
  ShieldCheck,
  Store,
  UserPlus,
  Users,
} from "lucide-react";
import { useCallback, useState } from "react";

import { ClerkAccountStatus } from "@/components/clerk-account-status";

const MARKETPLACE_COLORS: Record<string, string> = {
  Blinkit: "#16a34a",
  Zepto: "#1d4ed8",
  Instamart: "#f97316",
};

const onboardingSteps = [
  { label: "Sign in with Google", status: "connected" },
  { label: "Create Organization", status: "connected" },
  { label: "Connect Marketplaces", status: "connected" },
  { label: "Configure Alerts", status: "active" },
  { label: "Open Command Center", status: "pending" },
];

const marketplaceConnectors = [
  { name: "Blinkit", status: "Connected", stores: 18, lastSync: "4 min ago" },
  { name: "Zepto", status: "Connected", stores: 14, lastSync: "7 min ago" },
  { name: "Instamart", status: "Connected", stores: 12, lastSync: "11 min ago" },
];

const teamMembers = [
  { name: "Aarav Mehta", email: "aarav@shelfsync.ai", role: "Owner", access: "Full workspace" },
  { name: "Priya Nair", email: "priya@shelfsync.ai", role: "Ops Manager", access: "Inventory, pooling, alerts" },
  { name: "Rohan Shah", email: "rohan@shelfsync.ai", role: "Growth Lead", access: "Ads, catalog, revenue" },
];

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    companyName: "ShelfSync Demo Foods Pvt Ltd",
    workspaceSlug: "shelfsync-demo",
    ownerEmail: "admin@shelfsync.ai",
    cityCluster: "Bengaluru, Mumbai, Delhi NCR",
    timezone: "Asia/Kolkata",
    emailNotifications: true,
    stockoutAlerts: true,
    adWasteAlerts: true,
    returnsAlerts: true,
    poolingAlerts: true,
    dailyDigest: true,
    weeklyReview: true,
    stockoutThreshold: 12,
    adWasteThreshold: 5000,
    returnLeakageThreshold: 1000,
    digestEmail: "ops-alerts@shelfsync.ai",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (key: keyof typeof settings, value: string | number | boolean) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const syncClerkEmail = useCallback((email: string) => {
    setSettings((current) =>
      current.ownerEmail === email && current.digestEmail === email
        ? current
        : { ...current, ownerEmail: email, digestEmail: email }
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Demo workspace ready
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-950">System Settings</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Configure authentication, organization setup, marketplace access, alert workflows, and team permissions.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </header>

      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        {saved && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
            Settings saved. Demo email notifications and workspace rules are active.
          </div>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-950">Workspace Onboarding Workflow</h2>
              <p className="mt-1 text-sm text-slate-600">MVP path from Google sign-in to Command Center access.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {onboardingSteps.map((step, index) => (
                <div key={step.label} className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      step.status === "connected"
                        ? "bg-emerald-100 text-emerald-700"
                        : step.status === "active"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {step.status === "connected" ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">{step.label}</p>
                    <p className="text-[11px] font-medium uppercase text-slate-500">{step.status}</p>
                  </div>
                  {index < onboardingSteps.length - 1 && <ChevronRight className="hidden h-4 w-4 text-slate-300 lg:block" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <SectionCard
              icon={ShieldCheck}
              iconClass="bg-blue-50 text-blue-700"
              title="Google Login"
              caption="Real Google/Gmail authentication powered by Clerk."
            >
              <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                <ClerkAccountStatus onEmail={syncClerkEmail} />
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">Access policy</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <StatusLine label="Provider" value="Clerk + Google" />
                    <StatusLine label="Email identity" value="Verified Gmail" />
                    <StatusLine label="Redirect after login" value="/settings" />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={Store}
              iconClass="bg-emerald-50 text-emerald-700"
              title="Organization Settings"
              caption="Company profile, Indian operating region, and workspace identity."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Organization Name" value={settings.companyName} onChange={(value) => updateSetting("companyName", value)} />
                <TextField label="Workspace Slug" value={settings.workspaceSlug} onChange={(value) => updateSetting("workspaceSlug", value)} />
                <TextField label="Owner Email" type="email" value={settings.ownerEmail} onChange={(value) => updateSetting("ownerEmail", value)} />
                <TextField label="Operating Cities" value={settings.cityCluster} onChange={(value) => updateSetting("cityCluster", value)} />
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => updateSetting("timezone", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={PlugZap}
              iconClass="bg-orange-50 text-orange-700"
              title="Marketplace Connectors"
              caption="Quick-commerce platforms connected for inventory, catalog, ads, and returns sync."
            >
              <div className="grid gap-3 lg:grid-cols-3">
                {marketplaceConnectors.map((connector) => (
                  <div key={connector.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: MARKETPLACE_COLORS[connector.name] }}
                        />
                        <p className="text-sm font-bold text-slate-950">{connector.name}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold uppercase text-emerald-700">
                        {connector.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <MiniMetric label="Dark stores" value={String(connector.stores)} />
                      <MiniMetric label="Last sync" value={connector.lastSync} />
                    </div>
                    <button className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100">
                      Manage Connector
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              icon={Bell}
              iconClass="bg-rose-50 text-rose-700"
              title="Alert Settings"
              caption="Email notification workflow for stockouts, ad waste, returns leakage, and transfer opportunities."
            >
              <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
                <div className="space-y-3">
                  <ToggleRow
                    icon={Mail}
                    title="Email Notifications"
                    caption={`Send demo alerts to ${settings.digestEmail}`}
                    checked={settings.emailNotifications}
                    onChange={(value) => updateSetting("emailNotifications", value)}
                  />
                  <ToggleRow
                    icon={AlertTriangle}
                    title="Critical Stockout Alerts"
                    caption="Immediate email when stockout risk is inside threshold."
                    checked={settings.stockoutAlerts}
                    onChange={(value) => updateSetting("stockoutAlerts", value)}
                  />
                  <ToggleRow
                    icon={Clock3}
                    title="Daily Digest"
                    caption="Morning summary for inventory, ads, returns, and pooling."
                    checked={settings.dailyDigest}
                    onChange={(value) => updateSetting("dailyDigest", value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Notification Email" type="email" value={settings.digestEmail} onChange={(value) => updateSetting("digestEmail", value)} />
                  <NumberField label="Stockout Threshold (hours)" value={settings.stockoutThreshold} onChange={(value) => updateSetting("stockoutThreshold", value)} />
                  <NumberField label="Ad Waste Threshold (INR)" value={settings.adWasteThreshold} onChange={(value) => updateSetting("adWasteThreshold", value)} />
                  <NumberField label="Return Leakage Threshold (INR)" value={settings.returnLeakageThreshold} onChange={(value) => updateSetting("returnLeakageThreshold", value)} />
                  <CheckOption label="Ad waste alerts" checked={settings.adWasteAlerts} onChange={(value) => updateSetting("adWasteAlerts", value)} />
                  <CheckOption label="Returns leakage alerts" checked={settings.returnsAlerts} onChange={(value) => updateSetting("returnsAlerts", value)} />
                  <CheckOption label="Pooling opportunity alerts" checked={settings.poolingAlerts} onChange={(value) => updateSetting("poolingAlerts", value)} />
                  <CheckOption label="Weekly business review" checked={settings.weeklyReview} onChange={(value) => updateSetting("weeklyReview", value)} />
                </div>
              </div>
            </SectionCard>
          </div>

          <aside className="space-y-6">
            <SectionCard
              icon={Users}
              iconClass="bg-violet-50 text-violet-700"
              title="Team Management"
              caption="Demo roles mapped to quick-commerce operations."
            >
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.email} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-700 shadow-sm">
                        {member.name.split(" ").map((part) => part[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-950">{member.name}</p>
                        <p className="truncate text-xs text-slate-500">{member.email}</p>
                        <p className="mt-2 text-xs font-semibold text-slate-700">{member.role}</p>
                        <p className="text-xs text-slate-500">{member.access}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                  <UserPlus className="h-4 w-4" />
                  Invite Team Member
                </button>
              </div>
            </SectionCard>

            <SectionCard
              icon={Mail}
              iconClass="bg-emerald-50 text-emerald-700"
              title="Email Notification Demo"
              caption="Shows how alerts will behave during the MVP demo."
            >
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-bold text-emerald-950">Email workflow active</p>
                <p className="mt-2 text-sm text-emerald-800">
                  Critical stockout, ad waste, returns leakage, and pooling alerts are routed to the configured ops inbox.
                </p>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <StatusLine label="Immediate alerts" value={settings.emailNotifications && settings.stockoutAlerts ? "On" : "Off"} />
                <StatusLine label="Daily digest" value={settings.dailyDigest ? "8:30 AM IST" : "Off"} />
                <StatusLine label="Weekly review" value={settings.weeklyReview ? "Monday" : "Off"} />
              </div>
            </SectionCard>

            <SectionCard
              icon={MapPin}
              iconClass="bg-slate-100 text-slate-700"
              title="Command Center Access"
              caption="Final setup state for demo navigation."
            >
              <div className="space-y-3">
                <StatusLine label="Organization" value="Created" />
                <StatusLine label="Marketplaces" value="3 connected" />
                <StatusLine label="Alerts" value="Configured" />
                <a
                  href="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
                >
                  Open Command Center
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </SectionCard>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  iconClass,
  title,
  caption,
  children,
}: {
  icon: React.ElementType;
  iconClass: string;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className={`rounded-lg p-2 ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{caption}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  caption,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  title: string;
  caption: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="h-5 w-5 shrink-0 text-slate-600" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-950">{title}</p>
          <p className="text-xs text-slate-600">{caption}</p>
        </div>
      </div>
      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <div className="h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-950 peer-checked:after:translate-x-full peer-checked:after:border-white" />
      </label>
    </div>
  );
}

function CheckOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
      />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-600">{label}</span>
      <span className="text-right font-bold text-slate-950">{value}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <p className="text-[11px] font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}
