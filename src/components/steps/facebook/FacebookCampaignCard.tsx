"use client";

import {
  BUDGET_LEVEL_LABELS,
  FACEBOOK_CAMPAIGN_TYPE_LABELS,
  type BudgetLevel,
  type FacebookCampaignData,
  type FacebookCampaignType,
} from "@/lib/types";
import { Button, NumberField, RadioGroup, SelectField, TextAreaField, TextField } from "@/components/ui";
import { createAdset } from "@/lib/factories";
import { AdsetCard } from "@/components/steps/shared/AdsetCard";

export function FacebookCampaignCard({
  campaign,
  index,
  errors,
  onChange,
  onRemove,
  canRemove,
}: {
  campaign: FacebookCampaignData;
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
  onChange: (patch: Partial<FacebookCampaignData>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  function updateAdset(adsetId: string, patch: Partial<FacebookCampaignData["adsets"][number]>) {
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
          <NumberField
            label="תקציב יומי"
            required
            suffix="₪"
            value={campaign.dailyBudget}
            onChange={(v) => onChange({ dailyBudget: v })}
            error={errors?.dailyBudget}
          />
          <SelectField
            label="סוג קמפיין"
            required
            value={campaign.type}
            onChange={(v) => onChange({ type: v as FacebookCampaignType })}
            options={Object.entries(FACEBOOK_CAMPAIGN_TYPE_LABELS).map(([v, label]) => ({
              value: v,
              label,
            }))}
            error={errors?.type}
          />
        </div>

        <RadioGroup
          label="רמת התקציב"
          required
          value={campaign.budgetLevel}
          onChange={(v) => onChange({ budgetLevel: v as BudgetLevel })}
          options={Object.entries(BUDGET_LEVEL_LABELS).map(([v, label]) => ({ value: v, label }))}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField
            type="datetime-local"
            label="תאריך ושעת התחלה"
            required
            value={campaign.startAt}
            onChange={(e) => onChange({ startAt: e.target.value })}
            error={errors?.startAt}
          />
          <TextField
            type="datetime-local"
            label="תאריך ושעת סיום"
            required
            value={campaign.endAt}
            onChange={(e) => onChange({ endAt: e.target.value })}
            error={errors?.endAt}
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
        <p className="text-sm font-bold text-slate-500">אדסטים / סדרות מודעות</p>
        {campaign.adsets.map((adset, i) => (
          <AdsetCard
            key={adset.id}
            adset={adset}
            index={i}
            campaignId={campaign.id}
            showDailyBudget={campaign.budgetLevel === "adset"}
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
