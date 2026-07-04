"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, PageHeader, TextAreaField } from "@/components/ui";

export function GoogleStep({ planId, initialNotes }: { planId: string; initialNotes: string }) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    try {
      const res = await fetch(`/api/workplans/${planId}/google`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleNotes: notes }),
      });
      if (!res.ok) throw new Error("save failed");
      router.push(`/plan/${planId}/tiktok`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="הגדרות קמפיינים בגוגל" />
      <Card>
        <h3 className="mb-3 text-sm font-bold text-slate-700">הגדרות והסברים לגוגל</h3>
        <TextAreaField
          rows={12}
          placeholder="מה צריך להקים, אילו קמפיינים, תקציבים, קהלים, מילות מפתח, דפי נחיתה, לינקים, הערות וכל מידע נוסף..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <p className="mt-2 text-xs text-slate-400">
          השדה אינו חובה — ייתכן ואין פעילות בגוגל בתוכנית זו.
        </p>
      </Card>
      <div className="mt-6 flex justify-start">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "שומר..." : "המשך לטיקטוק ←"}
        </Button>
      </div>
    </div>
  );
}
