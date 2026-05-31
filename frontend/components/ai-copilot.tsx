
"use client";

import { Badge, Card } from "@/components/ui";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { BrainCircuit, Send, Sparkles } from "lucide-react";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type CopilotResponse = {
  query: string;
  response: string;
  mode: string;
  context_summary: {
    inventory_risks: number;
    ad_risks: number;
    pooling_opportunities: number;
    return_disputes: number;
  };
  suggested_questions: string[];
};

export function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your AI Operations Copilot. I can help you understand inventory risks, ad performance, and operational priorities. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "Why are sales dropping?",
    "Which SKU is at highest risk?",
    "Where should I move inventory?",
    "Which ads should I pause?",
    "What are my top actions for today?",
  ]);

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
      setSuggestedQuestions(data.suggested_questions);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again or check if the backend is running.",
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSubmit = (query: string) => {
    if (!query.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: query,
        timestamp: new Date(),
      },
    ]);

    copilotMutation.mutate(query);
    setInput("");
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSubmit(question);
  };

  return (
    <Card className="flex h-[600px] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Operations Copilot</h2>
            <p className="text-xs text-slate-400">Powered by OpenAI GPT-4o</p>
          </div>
        </div>
        <Badge className="border-lime-400/40 bg-lime-400/10 text-lime-200">
          <Sparkles className="mr-1 h-3 w-3" />
          Active
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 ${
                message.role === "user"
                  ? "bg-violet-500/20 text-slate-100"
                  : "bg-slate-800/70 text-slate-200"
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
              <div className="mt-2 text-[10px] text-slate-500">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {copilotMutation.isPending && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg bg-slate-800/70 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "0.2s" }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "0.4s" }} />
                <span className="ml-2">Analyzing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && (
        <div className="border-t border-slate-700 pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Suggested Questions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                disabled={copilotMutation.isPending}
                className="rounded-md border border-cyan-400/30 bg-cyan-400/5 px-3 py-1.5 text-xs text-cyan-200 transition-colors hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="mt-3 flex gap-2 border-t border-slate-700 pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(input);
            }
          }}
          placeholder="Ask about inventory, ads, or operations..."
          disabled={copilotMutation.isPending}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          onClick={() => handleSubmit(input)}
          disabled={copilotMutation.isPending || !input.trim()}
          className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}