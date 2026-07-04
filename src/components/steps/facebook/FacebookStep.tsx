"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Button, Card, PageHeader, TextAreaField } from "@/components/ui";
import type { FacebookCampaignData } from "@/lib/types";
import { createFacebookCampaign } from "@/lib/factories";
import { facebookPayloadSchema } from "@/lib/validation";
import { buildErrorTree } from "@/lib/errorTree";
import { moveAdBetweenAdsets } from "@/lib/dnd";
import { FacebookCampaignCard } from "@/components/steps/facebook/FacebookCampaignCard";

export function FacebookStep({
  planId,
  initialCampaigns,
  initialNotes,
}: {
  planId: string;
  initialCampaigns: FacebookCampaignData[];
  initialNotes: string;
}) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<FacebookCampaignData[]>(
    initialCampaigns.length ? initialCampaigns : [createFacebookCampaign(0)]
  );
  const [notes, setNotes] = useState(initialNotes);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);

  function updateCampaign(id: string, patch: Partial<FacebookCampaignData>) {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCampaign(id: string) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id).map((c, i) => ({ ...c, order: i })));
  }

  function addCampaign() {
    setCampaigns((prev) => [...prev, createFacebookCampaign(prev.length)]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    setCampaigns((prev) => moveAdBetweenAdsets(prev, String(active.id), String(over.id)));
  }

  async function handleSubmit() {
    const payload = { facebookGeneralNotes: notes, campaigns };
    const parsed = facebookPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(buildErrorTree(parsed.error.issues));
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const res = await fetch(`/api/workplans/${planId}/facebook`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      router.push(`/plan/${planId}/google`);
    } finally {
      setSaving(false);
    }
  }

  const campaignErrors: Record<number, unknown> = errors?.campaigns ?? {};

  return (
    <div>
      <PageHeader title="קמפיינים בפייסבוק / מטא" />

      <DndContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          {campaigns.map((campaign, i) => (
            <FacebookCampaignCard
              key={campaign.id}
              campaign={campaign}
              index={i}
              errors={campaignErrors[i]}
              onChange={(patch) => updateCampaign(campaign.id, patch)}
              onRemove={() => removeCampaign(campaign.id)}
              canRemove={campaigns.length > 1}
            />
          ))}
        </div>
      </DndContext>

      <div className="mt-6">
        <Button variant="secondary" onClick={addCampaign}>
          + הוסף קמפיין
        </Button>
      </div>

      <Card className="mt-6">
        <TextAreaField
          label="הערות כלליות לפייסבוק / מטא"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Card>

      <div className="mt-6 flex justify-start">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "שומר..." : "המשך לגוגל ←"}
        </Button>
      </div>
    </div>
  );
}
