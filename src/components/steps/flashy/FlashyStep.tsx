"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, PageHeader } from "@/components/ui";
import type { MailingItemData, SmsItemData } from "@/lib/types";
import { createMailingItem, createSmsItem } from "@/lib/factories";
import { flashyPayloadSchema } from "@/lib/validation";
import { buildErrorTree } from "@/lib/errorTree";
import { SmsCard } from "@/components/steps/flashy/SmsCard";
import { MailingCard } from "@/components/steps/flashy/MailingCard";

export function FlashyStep({
  planId,
  initialSms,
  initialMailing,
}: {
  planId: string;
  initialSms: SmsItemData[];
  initialMailing: MailingItemData[];
}) {
  const router = useRouter();
  const [smsItems, setSmsItems] = useState<SmsItemData[]>(initialSms);
  const [mailingItems, setMailingItems] = useState<MailingItemData[]>(initialMailing);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);

  function updateSms(id: string, patch: Partial<SmsItemData>) {
    setSmsItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }
  function removeSms(id: string) {
    setSmsItems((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })));
  }
  function updateMailing(id: string, patch: Partial<MailingItemData>) {
    setMailingItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }
  function removeMailing(id: string) {
    setMailingItems((prev) => prev.filter((m) => m.id !== id).map((m, i) => ({ ...m, order: i })));
  }

  async function handleSubmit() {
    const payload = { smsItems, mailingItems };
    const parsed = flashyPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(buildErrorTree(parsed.error.issues));
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const res = await fetch(`/api/workplans/${planId}/flashy`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      await fetch(`/api/workplans/${planId}/complete`, { method: "POST" });
      router.push(`/plan/${planId}/finish`);
    } finally {
      setSaving(false);
    }
  }

  const smsErrors: Record<number, Record<string, string>> = errors?.smsItems ?? {};
  const mailingErrors: Record<number, Record<string, string>> = errors?.mailingItems ?? {};

  return (
    <div>
      <PageHeader
        title="פלאשי — SMS ודיוור"
        subtitle="במידה ופלאשי לא רלוונטי לתוכנית זו, ניתן להמשיך לשלב הבא."
      />

      <Card>
        <h3 className="mb-4 text-base font-bold text-slate-800">SMS</h3>
        <div className="space-y-4">
          {smsItems.map((sms, i) => (
            <SmsCard
              key={sms.id}
              sms={sms}
              index={i}
              errors={smsErrors[i]}
              onChange={(patch) => updateSms(sms.id, patch)}
              onRemove={() => removeSms(sms.id)}
              canRemove
            />
          ))}
        </div>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => setSmsItems((prev) => [...prev, createSmsItem(prev.length)])}
          >
            + הוסף SMS
          </Button>
        </div>
      </Card>

      <Card className="mt-6">
        <h3 className="mb-4 text-base font-bold text-slate-800">דיוור</h3>
        <div className="space-y-4">
          {mailingItems.map((mailing, i) => (
            <MailingCard
              key={mailing.id}
              mailing={mailing}
              index={i}
              errors={mailingErrors[i]}
              onChange={(patch) => updateMailing(mailing.id, patch)}
              onRemove={() => removeMailing(mailing.id)}
              canRemove
            />
          ))}
        </div>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => setMailingItems((prev) => [...prev, createMailingItem(prev.length)])}
          >
            + הוסף דיוור
          </Button>
        </div>
      </Card>

      <div className="mt-6 flex justify-start">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "שומר..." : "סיום ←"}
        </Button>
      </div>
    </div>
  );
}
