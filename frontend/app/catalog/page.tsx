"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, FileText, PackageCheck, Search, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

import {
  OperationHero,
  OperationKpiCard,
  OperationPageShell,
  OperationPanel,
  OperationSelect,
  PlatformBadge,
} from "@/components/operations-ui";
import { api } from "@/lib/api";

export default function CatalogPage() {
  const [selectedSku, setSelectedSku] = useState("SYN-BUDS-MINI");
  const [generatedVariants, setGeneratedVariants] = useState<any>(null);

  const skuOptions = [
    { value: "SYN-BUDS-MINI", label: "SparkBuds Mini" },
    { value: "FMCG-PROTEIN-250", label: "NourishGo Protein Shake 250ml" },
    { value: "BEAUTY-SERUM-30", label: "GlowRush Vitamin C Serum" },
    { value: "FOOD-MILK-AMUL-1L", label: "Amul Taaza Toned Milk 1L" },
    { value: "FOOD-BREAD-BRITANNIA-400G", label: "Britannia Whole Wheat Bread 400g" },
    { value: "SNACK-LAYS-CHIPS-52G", label: "Lay's Classic Salted Chips 52G" },
    { value: "BEVERAGE-COKE-750ML", label: "Coca-Cola Soft Drink 750ml" },
    { value: "BABY-DIAPER-PAMPERS-M-20", label: "Pampers Baby Dry Pants Medium 20 Count" },
  ];

  const generateMutation = useMutation({
    mutationFn: (sku: string) => api.catalog(sku),
    onSuccess: (data) => setGeneratedVariants(data),
  });

  const handleGenerate = () => {
    generateMutation.mutate(selectedSku);
  };

  const productTitle = generatedVariants?.title ?? generatedVariants?.product_title ?? "Generated product listing";
  const features = Array.isArray(generatedVariants?.features) ? generatedVariants.features : [];
  const variants = generatedVariants?.variants ?? [];
  const avgScore = variants.length ? Math.round(variants.reduce((sum: number, variant: any) => sum + variant.content_score, 0) / variants.length) : 0;

  return (
    <OperationPageShell>
      <OperationHero
        icon={Wand2}
        eyebrow="Catalog command"
        title="Catalog Intelligence"
        description="Generate marketplace-ready product copy, platform variants, and content quality signals for Blinkit, Zepto, and Instamart."
      >
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
          <OperationSelect value={selectedSku} onChange={setSelectedSku}>
            {skuOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </OperationSelect>
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-lime-300 px-4 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:bg-lime-200 disabled:cursor-wait disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {generateMutation.isPending ? "Generating" : "Generate"}
          </button>
        </div>
      </OperationHero>

      <div className="grid gap-4 md:grid-cols-4">
        <OperationKpiCard icon={PackageCheck} label="SKU selected" value={selectedSku.split("-")[0]} caption="Catalog seed active" tone="blue" />
        <OperationKpiCard icon={Sparkles} label="Variants" value={String(variants.length || 3)} caption="Marketplace outputs" tone="violet" />
        <OperationKpiCard icon={Search} label="Content score" value={avgScore ? `${avgScore}` : "--"} caption="Average generated quality" tone="emerald" />
        <OperationKpiCard icon={FileText} label="Channels" value="3" caption="Blinkit, Zepto, Instamart" tone="orange" />
      </div>

      <section className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-blue-200 bg-white text-blue-700 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-blue-950">AI-powered listing generation</p>
            <p className="mt-1 text-sm font-medium leading-6 text-blue-800">
              Create platform-specific titles, descriptions, tones, and marketplace copy designed for quick-commerce discovery and conversion.
            </p>
          </div>
        </div>
      </section>

      {generateMutation.isPending ? (
        <OperationPanel icon={Sparkles} title="Generating Listings" caption="Creating platform-ready marketplace variants.">
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-lime-100 border-t-lime-600" />
          </div>
        </OperationPanel>
      ) : null}

      {generateMutation.isError ? (
        <OperationPanel icon={AlertTriangle} title="Failed to Generate Listings" caption={generateMutation.error instanceof Error ? generateMutation.error.message : "Please try again or contact support."}>
          <div className="h-6" />
        </OperationPanel>
      ) : null}

      {generatedVariants && !generateMutation.isPending ? (
        <div className="space-y-6">
          <OperationPanel icon={FileText} title="Product Information" caption="Generated listing source and feature set">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoCell label="SKU" value={generatedVariants.sku} />
              <InfoCell label="Product title" value={productTitle} />
              <InfoCell label="Category" value={generatedVariants.category} />
              <InfoCell label="Features" value={features.length ? features.join(", ") : "Marketplace-ready features generated from catalog seed data."} />
            </div>
          </OperationPanel>

          <div className="grid gap-4 xl:grid-cols-3">
            {variants.map((variant: any, index: number) => (
              <div key={`${variant.platform}-${index}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <PlatformBadge platform={variant.platform} />
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    {variant.content_score} score
                  </span>
                </div>
                <p className="text-base font-black leading-6 text-slate-950">{variant.title}</p>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{variant.description}</p>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${variant.content_score}%` }} />
                </div>
                <div className="mt-5 flex gap-2">
                  <button className="flex-1 rounded-lg bg-slate-950 px-3 py-2 text-xs font-black text-white hover:bg-slate-800">
                    Publish
                  </button>
                  <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
              <div>
                <p className="text-sm font-black text-emerald-950">Listings generated successfully</p>
                <p className="mt-1 text-sm font-medium text-emerald-800">Review the platform-specific variants and publish them to marketplace channels.</p>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {!generatedVariants && !generateMutation.isPending && !generateMutation.isError ? (
        <OperationPanel icon={FileText} title="No Listings Generated Yet" caption="Select a SKU and generate AI-powered marketplace listings.">
          <div className="flex justify-center py-8">
            <button onClick={handleGenerate} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800">
              <Sparkles className="h-4 w-4" />
              Generate Your First Listing
            </button>
          </div>
        </OperationPanel>
      ) : null}
    </OperationPageShell>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-950">{value}</p>
    </div>
  );
}
