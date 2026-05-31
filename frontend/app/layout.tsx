import { AppShell } from "@/components/app-shell";
import { ClerkAuthProvider } from "@/components/clerk-auth-provider";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ShelfSync AI - Operations Copilot",
  description: "AI operations copilot for India quick-commerce brands.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-white">
        <ClerkAuthProvider>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </ClerkAuthProvider>
      </body>
    </html>
  );
}

// Made with Bob
