"use client";

import { api } from "@/lib/api";
import type { CopilotResponse } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { BrainCircuit, Maximize2, Minimize2, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";

const ALL_QUESTIONS = [
  "Which SKU needs attention today?",
  "What are my top risks?",
  "Why are sales dropping?",
  "Which products may stock out?",
  "Which ads should I pause?",
  "Where should I move inventory?",
  "Which returns require disputes?",
  "Which products have the highest demand?",
  "What is my revenue at risk?",
  "Which marketplace is performing best?",
  "What margin leakages exist?",
  "What actions should I take today?",
];

export function AICopilotFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; timestamp: Date }>>([]);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const copilotMutation = useMutation({
    mutationFn: api.copilot,
    onSuccess: (data: CopilotResponse) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || copilotMutation.isPending) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: query,
        timestamp: new Date(),
      },
    ]);

    copilotMutation.mutate(query);
    setQuery("");
    setShowAllQuestions(false);
  };

  const handleQuestionClick = (question: string) => {
    setQuery(question);
    setShowAllQuestions(false);
    
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
        timestamp: new Date(),
      },
    ]);

    copilotMutation.mutate(question);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <BrainCircuit className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-xl border border-slate-200 bg-white shadow-2xl transition-all ${
        isMinimized ? "h-14 w-80" : "h-[600px] w-96"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 rounded-t-xl">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-white" />
          <span className="font-semibold text-white">AI Operations Copilot</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/80 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 mb-4">
                  <BrainCircuit className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">AI Operations Advisor</h3>
                <p className="text-sm text-slate-600 mb-1">Ask me anything about your business</p>
                <p className="text-xs text-slate-400">Inventory • Ads • Returns • Pooling • Finance</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                        : "bg-slate-50 text-slate-800 border border-slate-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-white/70" : "text-slate-400"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {copilotMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-slate-600 font-medium">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions Menu */}
          <div className="border-t border-slate-200 px-4 py-3 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <p className="text-xs font-semibold text-slate-700">Quick Questions</p>
              </div>
              <button
                onClick={() => setShowAllQuestions(!showAllQuestions)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {showAllQuestions ? "Show Less" : `View All (${ALL_QUESTIONS.length})`}
              </button>
            </div>
            
            <div className={`space-y-1.5 overflow-y-auto custom-scrollbar ${showAllQuestions ? "max-h-48" : "max-h-32"}`}>
              {(showAllQuestions ? ALL_QUESTIONS : ALL_QUESTIONS.slice(0, 4)).map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionClick(question)}
                  disabled={copilotMutation.isPending}
                  className="w-full text-left text-xs px-3 py-2 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg transition-colors border border-slate-200 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4 bg-white rounded-b-xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about operations..."
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                disabled={copilotMutation.isPending}
              />
              <button
                type="submit"
                disabled={!query.trim() || copilotMutation.isPending}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

// Made with Bob - Professional SaaS AI Copilot
