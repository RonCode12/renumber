"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { AD_TYPE_LABELS, type AdData, type AdType } from "@/lib/types";
import { RadioGroup, TextAreaField, TextField } from "@/components/ui";
import { adDraggableId } from "@/lib/dnd";

export function AdCard({
  ad,
  index,
  campaignId,
  adsetId,
  errors,
  onChange,
  onRemove,
  onDuplicate,
  canRemove,
}: {
  ad: AdData;
  index: number;
  campaignId: string;
  adsetId: string;
  errors?: Record<string, string>;
  onChange: (patch: Partial<AdData>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  canRemove: boolean;
}) {
  const draggableId = adDraggableId(campaignId, adsetId, ad.id);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: draggableId,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={clsx(
        "rounded-xl border border-slate-200 bg-slate-50/60 p-4",
        isDragging && "opacity-40"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            type="button"
            title="גררו כדי להעביר לאדסט אחר"
            className="cursor-grab rounded-md p-1.5 text-slate-400 hover:bg-slate-200 active:cursor-grabbing"
          >
            ⠿
          </button>
          <span className="text-sm font-bold text-slate-600">מודעה {index + 1}</span>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onDuplicate}
            className="rounded-md px-2 py-1 text-xs font-semibold text-sky-600 hover:bg-sky-50"
          >
            שכפול
          </button>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md px-2 py-1 text-xs font-semibold text-red-400 hover:bg-red-50"
            >
              הסרה
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <RadioGroup
          label="סוג מודעה"
          required
          value={ad.adType}
          onChange={(v) => onChange({ adType: v as AdType })}
          options={Object.entries(AD_TYPE_LABELS).map(([v, label]) => ({
            value: v,
            label,
          }))}
          error={errors?.adType}
        />

        {ad.adType === "dark" ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextAreaField
              label="קופי"
              required
              rows={2}
              value={ad.copy}
              onChange={(e) => onChange({ copy: e.target.value })}
              error={errors?.copy}
            />
            <TextField
              label="הדליין"
              required
              value={ad.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              error={errors?.headline}
            />
            <TextField
              label="גרפיקה (קישור ל-Google Drive)"
              required
              className="sm:col-span-2"
              value={ad.graphicLink}
              onChange={(e) => onChange({ graphicLink: e.target.value })}
              error={errors?.graphicLink}
            />
          </div>
        ) : (
          <TextField
            label="קישור לפוסט"
            required
            value={ad.postLink}
            onChange={(e) => onChange({ postLink: e.target.value })}
            error={errors?.postLink}
          />
        )}

        <TextField
          label="לינק (לדף נחיתה / אתר)"
          value={ad.link}
          onChange={(e) => onChange({ link: e.target.value })}
        />

        <TextAreaField
          label="הערות למודעה"
          rows={2}
          value={ad.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </div>
    </div>
  );
}
