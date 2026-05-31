import type {
  AdRecommendation,
  Alert,
  ActionResponse,
  CatalogResponse,
  DashboardSummary,
  InventoryRisk,
  PoolingRecommendation,
  ReturnAudit,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    throw new Error(`API ${path} failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  dashboard: () => request<DashboardSummary>("/api/dashboard/summary"),
  inventory: () => request<InventoryRisk[]>("/api/inventory/risks"),
  ads: () => request<AdRecommendation[]>("/api/ads/recommendations"),
  returns: () => request<ReturnAudit[]>("/api/returns/audit"),
  pooling: () => request<PoolingRecommendation[]>("/api/pooling/recommendations"),
  alerts: () => request<Alert[]>("/api/alerts"),
  executeAction: (payload: {
    action_type: string;
    sku: string;
    platform?: string;
    location?: string;
    units?: number;
    reason?: string;
  }) =>
    request<ActionResponse>("/api/actions/execute", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  catalog: (sku: string) =>
    request<CatalogResponse>("/api/catalog/generate", {
      method: "POST",
      body: JSON.stringify({ sku }),
    }),
  copilot: (query: string) =>
    request<{
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
    }>("/api/copilot/query", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),
};
