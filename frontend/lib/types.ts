export type Severity = "critical" | "high" | "medium" | "low";

export type InventoryRisk = {
  sku: string;
  product: string;
  category: string;
  platform: string;
  city: string;
  dark_store: string;
  inventory_units: number;
  hourly_sales: number;
  safety_stock: number;
  risk_score: number;
  severity: Severity;
  hours_to_stockout: number;
  recommended_units: number;
  reason: string;
  expected_impact: string;
  suggested_action: string;
  revenue_impact_inr?: number;
};

export type AdRecommendation = {
  campaign_id: string;
  sku: string;
  platform: string;
  channel: string;
  campaign: string;
  campaign_name?: string;
  daily_spend_inr: number;
  waste_inr_per_day?: number;
  roas: number;
  status: string;
  risk_score: number;
  severity: Severity;
  reason: string;
  expected_impact: string;
  suggested_action: string;
};

export type ReturnAudit = {
  return_id: string;
  sku: string;
  product: string;
  platform: string;
  city: string;
  reason: string;
  refund_inr: number;
  payout_expected_inr: number;
  payout_received_inr: number;
  payout_gap_inr: number;
  inventory_updated: boolean;
  condition: string;
  risk_score: number;
  severity: Severity;
  expected_impact: string;
  suggested_action: string;
};

export type PoolingRecommendation = {
  sku: string;
  product: string;
  from_platform: string;
  from_location: string;
  to_platform: string;
  to_location: string;
  transfer_units: number;
  severity: Severity;
  risk_score: number;
  reason: string;
  expected_impact: string;
  suggested_action: string;
  revenue_impact_inr?: number;
};

export type Alert = {
  id: string;
  type: string;
  severity: Severity;
  title: string;
  message: string;
  action: string;
  timestamp?: string;
};

export type DashboardSummary = {
  kpis: {
    revenue_at_risk_inr: number;
    ad_waste_inr_per_day: number;
    critical_stockouts: number;
    returns_leakage_inr: number;
    ai_actions: number;
    sku_health: number;
  };
  hero_insight: InventoryRisk;
  top_ad_alert: AdRecommendation;
  top_return_alert: ReturnAudit;
  pooling: PoolingRecommendation[];
  alerts: Alert[];
  trend: Array<{ day: string; stockoutRisk: number; adWaste: number; fillRate: number }>;
};

export type CatalogResponse = {
  sku: string;
  title: string;
  category: string;
  features: string[];
  mode: string;
  recommendation: string;
  variants: Array<{
    platform: string;
    title: string;
    description: string;
    content_score: number;
    tone: string;
  }>;
};

export type ActionResponse = {
  action_id: string;
  status: string;
  action_type: string;
  title: string;
  message: string;
  next_step: string;
  eta_minutes: number;
};

export type CopilotResponse = {
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
