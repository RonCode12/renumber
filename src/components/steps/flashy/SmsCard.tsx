"use client";

import type { SmsItemData } from "@/lib/types";
import { RadioGroup, TextAreaField, TextField } from "@/components/ui";

export function SmsCard({
  sms,
  index,
  errors,
  onChange,
  onRemove,
  canRemove,
}: {
  sms: SmsItemData;
  index: number;
  errors?: Record<string, string>;
  onChange: (patch: Partial<SmsItemData>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">SMS {index + 1}</span>
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
      <div className="space-y-3">
        <TextField
          label="כותרת"
          value={sms.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <TextAreaField
          label="קופי"
          rows={3}
          value={sms.copy}
          onChange={(e) => onChange({ copy: e.target.value })}
        />
        <TextField
          label="קהל"
          value={sms.audience}
          onChange={(e) => onChange({ audience: e.target.value })}
        />
        <TextField
          type="datetime-local"
          label="תאריך ושעת שליחה"
          required
          value={sms.sendAt}
          onChange={(e) => onChange({ sendAt: e.target.value })}
          error={errors?.sendAt}
        />
        <RadioGroup
          label="האם יש קופונים נשרפים?"
          required
          value={sms.hasBurningCoupons ? "כן" : "לא"}
          onChange={(v) =>
            onChange({
              hasBurningCoupons: v === "כן",
              sheetsLink: v === "כן" ? sms.sheetsLink : "",
            })
          }
          options={[
            { value: "כן", label: "כן" },
            { value: "לא", label: "לא" },
          ]}
        />
        {sms.hasBurningCoupons && (
          <TextField
            label="קובץ Google Sheets"
            value={sms.sheetsLink}
            onChange={(e) => onChange({ sheetsLink: e.target.value })}
            placeholder="קישור לקובץ Google Sheets"
          />
        )}
      </div>
    </div>
  );
}
