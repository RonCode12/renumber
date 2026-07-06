"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, NumberField, PageHeader, RadioGroup, SelectField, TextField } from "@/components/ui";
import { GOAL_LABELS, type Goal } from "@/lib/types";

interface GeneralFormValue {
  name: string;
  clientName: string;
  goal: Goal | "";
  startDate: string;
  endDate: string;
  totalBudget: number | null;
}

export function GeneralForm({
  planId,
  initial,
}: {
  planId: string | null;
  initial?: Partial<GeneralFormValue>;
}) {
  const router = useRouter();
  const [value, setValue] = useState<GeneralFormValue>({
    name: initial?.name ?? "",
    clientName: initial?.clientName ?? "בייביסטאר",
    goal: initial?.goal ?? "",
    startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "",
    totalBudget: initial?.totalBudget ?? null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!value.name) next.name = "נא למלא שדה זה";
    if (!value.clientName) next.clientName = "נא למלא שדה זה";
    if (!value.goal) next.goal = "נא למלא שדה זה";
    if (!value.startDate) next.startDate = "נא למלא שדה זה";
    if (!value.endDate) next.endDate = "נא למלא שדה זה";
    if (value.startDate && value.endDate && value.endDate < value.startDate)
      next.endDate = "תאריך הסיום חייב להיות אחרי תאריך ההתחלה";
    if (!value.totalBudget || value.totalBudget <= 0)
      next.totalBudget = "נא למלא שדה זה";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      if (planId) {
        const res = await fetch(`/api/workplans/${planId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });
        if (!res.ok) throw new Error("save failed");
        router.push(`/plan/${planId}/facebook`);
      } else {
        const res = await fetch(`/api/workplans`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });
        if (!res.ok) throw new Error("create failed");
        const created = await res.json();
        router.push(`/plan/${created.id}/facebook`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="פרטים כלליים לתוכנית העבודה" />
      <Card className="space-y-5">
        <TextField
          label="שם תוכנית העבודה"
          required
          placeholder="לדוגמה: תוכנית עבודה בייביסטאר חודש 07"
          value={value.name}
          onChange={(e) => setValue((s) => ({ ...s, name: e.target.value }))}
          error={errors.name}
        />

        <SelectField
          label="שם לקוח"
          required
          value={value.clientName}
          onChange={(v) => setValue((s) => ({ ...s, clientName: v }))}
          options={[{ value: "בייביסטאר", label: "בייביסטאר" }]}
          error={errors.clientName}
        />

        <RadioGroup
          label="מטרה"
          required
          value={value.goal}
          onChange={(v) => setValue((s) => ({ ...s, goal: v as Goal }))}
          options={Object.entries(GOAL_LABELS).map(([v, label]) => ({
            value: v,
            label,
          }))}
          error={errors.goal}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            type="date"
            label="תאריך התחלה"
            required
            value={value.startDate}
            onChange={(e) => setValue((s) => ({ ...s, startDate: e.target.value }))}
            error={errors.startDate}
          />
          <TextField
            type="date"
            label="תאריך סיום"
            required
            value={value.endDate}
            onChange={(e) => setValue((s) => ({ ...s, endDate: e.target.value }))}
            error={errors.endDate}
          />
        </div>

        <NumberField
          label="תקציב קמפיינים כולל (Facebook / Meta + Google + TikTok)"
          required
          value={value.totalBudget}
          onChange={(v) => setValue((s) => ({ ...s, totalBudget: v }))}
          suffix="₪"
          error={errors.totalBudget}
        />
      </Card>

      <div className="mt-6 flex justify-start">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "שומר..." : "המשך לפייסבוק / מטא ←"}
        </Button>
      </div>
    </div>
  );
}
