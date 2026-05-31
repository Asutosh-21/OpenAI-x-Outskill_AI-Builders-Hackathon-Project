"use client";

import { usePathname } from "next/navigation";

import { AICopilotFloat } from "@/components/ai-copilot-float";
import { AppSidebar } from "@/components/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthSurface = pathname === "/login";

  if (isAuthSurface) {
    return <main className="min-h-screen min-w-0 flex-1 overflow-x-hidden">{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
      <AICopilotFloat />
    </div>
  );
}
