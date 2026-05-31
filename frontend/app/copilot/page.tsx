"use client";

import { BrainCircuit, MessageSquare, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CopilotPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Copilot</h1>
            <p className="mt-1 text-sm text-slate-600">
              Conversational AI assistant for operations intelligence
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-12">
        <div className="max-w-2xl text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-6">
            <BrainCircuit className="h-16 w-16 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-slate-900">AI Copilot is Always Available</h2>
          <p className="mt-4 text-lg text-slate-600">
            Your AI assistant is accessible from anywhere in the platform via the floating chat button in the bottom-right corner.
          </p>

          <div className="mt-8 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-900">How to Use AI Copilot</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Click the <strong>floating chat icon</strong> in the bottom-right corner</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Ask questions like "Why are sales dropping?" or "Which SKU needs attention?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Get AI-powered insights based on real-time operational data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>Receive actionable recommendations to optimize your operations</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-900">Natural Language</p>
              <p className="mt-1 text-xs text-slate-600">Ask questions in plain English</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <BrainCircuit className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-900">Context-Aware</p>
              <p className="mt-1 text-xs text-slate-600">Understands your business data</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <Sparkles className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-900">Actionable Insights</p>
              <p className="mt-1 text-xs text-slate-600">Get specific recommendations</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Go to Command Center
            </button>
            <button
              onClick={() => router.push("/inventory")}
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Inventory
            </button>
          </div>

          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-600">
              💡 <strong>Pro Tip:</strong> The AI Copilot is powered by OpenAI GPT-4o-mini and has access to all your operational data including inventory, ads, pooling, returns, and catalog information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
