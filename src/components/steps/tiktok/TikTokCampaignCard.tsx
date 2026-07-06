"use client";

import { TIKTOK_MIN_DAILY_BUDGET_USD, type TikTokCampaignData } from "@/lib/types";
import { Button, NumberField, TextAreaField, TextField } from "@/components/ui";
import { createAdset } from "@/lib/factories";
import { AdsetCard } from "@/components/steps/shared/AdsetCard";

export function TikTokCampaignCard({
  campaign,
  index,
  errors,
  onChange,
  onRemove,
  canRemove,
}: {
  campaign: TikTokCampaignData;
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
  onChange: (patch: Partial<TikTokCampaignData>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  function updateAdset(adsetId: string, patch: Partial<TikTokCampaignData["adsets"][number]>) {
    onChange({
      adsets: campaign.adsets.map((a) => (a.id === adsetId ? { ...a, ...patch } : a)),
    });
  }

  function removeAdset(adsetId: string) {
    onChange({
      adsets: campaign.adsets.filter((a) => a.id !== adsetId).map((a, i) => ({ ...a, order: i })),
    });
  }

  function addAdset() {
    onChange({ adsets: [...campaign.adsets, createAdset(campaign.adsets.length)] });
  }

  const adsetErrors: Record<number, unknown> = errors?.adsets ?? {};

  return (
    <div className="overflow-hidden rounded-2xl border border-sky-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]">
      <div className="h-1.5 bg-gradient-to-l from-sky-500 to-sky-300" />
      <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
            {index + 1}
          </span>
          <h3 className="text-base font-bold text-slate-800">קמפיין</h3>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-50"
          >
            הסרת קמפיין
          </button>
        )}
      </div>

      <div className="space-y-4">
        <TextField
          label="שם קמפיין"
          required
          value={campaign.name}
          onChange={(e) => onChange({ name: e.target.value })}
          error={errors?.name}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="סוג קמפיין" required value="צפיות" disabled />
          <NumberField
            label="תקציב יומי בדולרים"
            required
            suffix="$"
            min={TIKTOK_MIN_DAILY_BUDGET_USD}
            value={campaign.dailyBudgetUsd}
            onChange={(v) => onChange({ dailyBudgetUsd: v })}
            error={
              errors?.dailyBudgetUsd ||
              (campaign.dailyBudgetUsd !== null && campaign.dailyBudgetUsd < TIKTOK_MIN_DAILY_BUDGET_USD
                ? `התקציב היומי המינימלי בטיקטוק הוא ${TIKTOK_MIN_DAILY_BUDGET_USD}$`
                : undefined)
            }
          />
        </div>

        <TextAreaField
          label="הערות לקמפיין"
          rows={2}
          value={campaign.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </div>

      <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
        <p className="text-sm font-bold text-slate-500">אדסטים / קבוצות מודעות</p>
        {campaign.adsets.map((adset, i) => (
          <AdsetCard
            key={adset.id}
            adset={adset}
            index={i}
            campaignId={campaign.id}
            showDailyBudget={false}
            errors={adsetErrors[i] as Record<string, unknown> | undefined}
            onChange={(patch) => updateAdset(adset.id, patch)}
            onRemove={() => removeAdset(adset.id)}
            canRemove={campaign.adsets.length > 1}
          />
        ))}
        <Button variant="secondary" onClick={addAdset}>
          + הוסף אדסט
        </Button>
      </div>
      </div>
    </div>
  );
}
