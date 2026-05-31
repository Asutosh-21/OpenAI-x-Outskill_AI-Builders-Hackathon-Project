# ShelfSync AI Project Memory

## Source Images Analyzed

The project direction comes from three MVP reference images:

- `FULL TECHSTACK.png`: defines the full product workflow architecture and technical stack.
- `MVP DESIGN PRODUCT.png`: defines the MVP+ architecture, key benefits, product workflow, and dashboard/reporting outputs.
- `PRODUCT WORKFLOW.png`: defines the end-to-end operational workflow from ingestion to monitoring and feedback.

## Core Product Interpretation

ShelfSync AI is an AI-powered operations copilot for Indian quick-commerce brands. It is not a chatbot. It is an operational intelligence platform that turns fragmented marketplace, brand, ad, catalog, and returns data into recommended actions.

The MVP should demonstrate:

- control tower dashboard
- structured recommendations
- AI-agent-style analysis
- operational workflows
- realistic quick-commerce scenarios
- enterprise SaaS polish

## MVP Scope

Included:

- Executive command center
- Hyperlocal demand forecasting
- Ad-to-shelf synchronization
- Catalog intelligence
- Returns and audit intelligence
- Cross-platform pooling optimizer
- Alerts center
- Mock data and deterministic AI scoring
- FastAPI REST backend
- Next.js dashboard frontend

Not included:

- real marketplace APIs
- real campaign mutations
- authentication
- payment systems
- production database migrations
- distributed queues
- full ML model training

## Workflow Summary

1. Connect and ingest marketplace, brand, ad, return, and local signal data.
2. Process and standardize SKU, store, campaign, and return records.
3. Run independent AI agents across inventory, ads, catalog, returns, and pooling.
4. Generate ranked recommendations and action suggestions.
5. Simulate execution actions such as replenishment, ad pause, transfer, and dispute.
6. Monitor outcomes through KPIs, alerts, and feedback loops.

## Technical Stack

- Frontend: Next.js 15, TypeScript, TailwindCSS, React Query, Recharts, Zustand-ready state, Lucide icons.
- Backend: FastAPI, Python, Pydantic, modular services and agents.
- Data: JSON seed files for MVP, PostgreSQL and Supabase as production direction.
- AI: OpenAI GPT-5 / GPT-4o-ready structured-output layer, deterministic fallback scoring.
- Deployment: Vercel frontend, Railway or Render backend.

## Demo Flow

1. Select `SYN-BUDS-MINI`.
2. See Blinkit South Delhi stockout risk.
3. See ad spend at risk on the low-stock SKU.
4. See Zepto Gurgaon excess inventory.
5. Trigger recommended transfer and ad pause conceptually.
6. Review return discrepancy and dispute recommendation.
7. Generate platform-specific catalog copy.

## Design Direction

The UI should feel like a modern operational SaaS product:

- dense but readable
- dark premium dashboard
- restrained neon accents
- clear KPI hierarchy
- direct recommendation cards
- workflow-driven information architecture
- not a generic marketing page
