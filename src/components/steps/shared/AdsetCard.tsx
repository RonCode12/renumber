"use client";

import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { LOCATION_TYPE_LABELS, type AdsetData, type LocationType } from "@/lib/types";
import { Button, NumberField, RadioGroup, TextAreaField, TextField } from "@/components/ui";
import { adsetDroppableId } from "@/lib/dnd";
import { createAd } from "@/lib/factories";
import { AdCard } from "@/components/steps/shared/AdCard";

export function AdsetCard({
  adset,
  index,
  campaignId,
  showDailyBudget,
  errors,
  onChange,
  onRemove,
  canRemove,
}: {
  adset: AdsetData;
  index: number;
  campaignId: string;
  showDailyBudget: boolean;
  errors?: Record<string, unknown>;
  onChange: (patch: Partial<AdsetData>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const droppableId = adsetDroppableId(campaignId, adset.id);
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });
  const adErrors = (errors?.ads as Record<string, unknown>[] | undefined) ?? [];

  function updateAd(adId: string, patch: Partial<AdsetData["ads"][number]>) {
    onChange({
      ads: adset.ads.map((a) => (a.id === adId ? { ...a, ...patch } : a)),
    });
  }

  function removeAd(adId: string) {
    onChange({ ads: adset.ads.filter((a) => a.id !== adId).map((a, i) => ({ ...a, order: i })) });
  }

  function duplicateAd(adId: string) {
    const ad = adset.ads.find((a) => a.id === adId);
    if (!ad) return;
    const copy = { ...createAd(adset.ads.length), ...ad, id: crypto.randomUUID(), order: adset.ads.length };
    onChange({ ads: [...adset.ads, copy] });
  }

  function addAd() {
    onChange({ ads: [...adset.ads, createAd(adset.ads.length)] });
  }

  return (
    <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/30 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-[11px] font-bold text-emerald-900">
            {index + 1}
          </span>
          <span className="text-sm font-bold text-slate-700">אדסט</span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-50"
          >
            הסרת אדסט
          </button>
        )}
      </div>

      <div className="space-y-4 rounded-xl bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField
            label="שם קהל"
            required
            value={adset.audienceName}
            onChange={(e) => onChange({ audienceName: e.target.value })}
            error={errors?.audienceName as string}
          />
          {showDailyBudget && (
            <NumberField
              label="תקציב יומי לסדרת המודעות"
              required
              suffix="₪"
              value={adset.dailyBudget}
              onChange={(v) => onChange({ dailyBudget: v })}
              error={errors?.dailyBudget as string}
            />
          )}
        </div>

        <RadioGroup
          label="האם יש טווח גילאים רלוונטי?"
          required
          value={adset.hasAgeRange ? "כן" : "לא"}
          onChange={(v) => onChange({ hasAgeRange: v === "כן", ageRange: v === "כן" ? adset.ageRange : "" })}
          options={[
            { value: "כן", label: "כן" },
            { value: "לא", label: "לא" },
          ]}
        />
        {adset.hasAgeRange && (
          <TextField
            label="טווח גילאים"
            required
            placeholder="לדוגמה: 25-45"
            value={adset.ageRange}
            onChange={(e) => onChange({ ageRange: e.target.value })}
            error={errors?.ageRange as string}
          />
        )}

        <RadioGroup
          label="מיקום"
          required
          value={adset.locationType}
          onChange={(v) =>
            onChange({
              locationType: v as LocationType,
              locationDetails: v === "custom" ? adset.locationDetails : "",
            })
          }
          options={Object.entries(LOCATION_TYPE_LABELS).map(([v, label]) => ({ value: v, label }))}
        />
        {adset.locationType === "custom" && (
          <TextField
            label="פירוט מיקומים"
            required
            placeholder="לדוגמה: אשדוד, אשקלון, ראשון לציון"
            value={adset.locationDetails}
            onChange={(e) => onChange({ locationDetails: e.target.value })}
            error={errors?.locationDetails as string}
          />
        )}

        <TextAreaField
          label="הערות לאדסט"
          rows={2}
          value={adset.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </div>

      <div
        ref={setNodeRef}
        className={clsx(
          "mt-4 space-y-3 rounded-xl border-2 border-dashed p-3 transition-colors",
          isOver ? "border-amber-400 bg-amber-100/40" : "border-amber-200/60 bg-amber-50/20"
        )}
      >
        <p className="px-1 text-xs font-semibold text-amber-700/70">מודעות ({adset.ads.length})</p>
        {adset.ads.map((ad, i) => (
          <AdCard
            key={ad.id}
            ad={ad}
            index={i}
            campaignId={campaignId}
            adsetId={adset.id}
            errors={adErrors[i] as Record<string, string>}
            onChange={(patch) => updateAd(ad.id, patch)}
            onRemove={() => removeAd(ad.id)}
            onDuplicate={() => duplicateAd(ad.id)}
            canRemove={adset.ads.length > 1}
          />
        ))}
      </div>
      <div className="mt-3">
        <Button variant="secondary" onClick={addAd}>
          + הוסף מודעה
        </Button>
      </div>
    </div>
  );
}
