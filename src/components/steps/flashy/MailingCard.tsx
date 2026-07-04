"use client";

import type { MailingItemData } from "@/lib/types";
import { TextAreaField, TextField } from "@/components/ui";

export function MailingCard({
  mailing,
  index,
  errors,
  onChange,
  onRemove,
  canRemove,
}: {
  mailing: MailingItemData;
  index: number;
  errors?: Record<string, string>;
  onChange: (patch: Partial<MailingItemData>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">דיוור {index + 1}</span>
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
          value={mailing.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <TextAreaField
          label="קופי"
          rows={3}
          value={mailing.copy}
          onChange={(e) => onChange({ copy: e.target.value })}
        />
        <TextField
          label="קהל"
          value={mailing.audience}
          onChange={(e) => onChange({ audience: e.target.value })}
        />
        <TextField
          label="תמונה"
          placeholder="קישור ל-Google Drive"
          value={mailing.imageLink}
          onChange={(e) => onChange({ imageLink: e.target.value })}
        />
        <TextField
          label="לינק"
          value={mailing.link}
          onChange={(e) => onChange({ link: e.target.value })}
        />
        <TextField
          type="datetime-local"
          label="תאריך ושעת שליחה"
          required
          value={mailing.sendAt}
          onChange={(e) => onChange({ sendAt: e.target.value })}
          error={errors?.sendAt}
        />
      </div>
    </div>
  );
}
