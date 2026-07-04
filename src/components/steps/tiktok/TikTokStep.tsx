"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Button, PageHeader } from "@/components/ui";
import type { TikTokCampaignData } from "@/lib/types";
import { createTikTokCampaign } from "@/lib/factories";
import { tiktokPayloadSchema } from "@/lib/validation";
import { buildErrorTree } from "@/lib/errorTree";
import { moveAdBetweenAdsets } from "@/lib/dnd";
import { TikTokCampaignCard } from "@/components/steps/tiktok/TikTokCampaignCard";

export function TikTokStep({
  planId,
  initialCampaigns,
}: {
  planId: string;
  initialCampaigns: TikTokCampaignData[];
}) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<TikTokCampaignData[]>(
    initialCampaigns.length ? initialCampaigns : [createTikTokCampaign(0)]
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);

  function updateCampaign(id: string, patch: Partial<TikTokCampaignData>) {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCampaign(id: string) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id).map((c, i) => ({ ...c, order: i })));
  }

  function addCampaign() {
    setCampaigns((prev) => [...prev, createTikTokCampaign(prev.length)]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    setCampaigns((prev) => moveAdBetweenAdsets(prev, String(active.id), String(over.id)));
  }

  async function handleSubmit() {
    const payload = { campaigns };
    const parsed = tiktokPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(buildErrorTree(parsed.error.issues));
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const res = await fetch(`/api/workplans/${planId}/tiktok`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      router.push(`/plan/${planId}/flashy`);
    } finally {
      setSaving(false);
    }
  }

  const campaignErrors: Record<number, unknown> = errors?.campaigns ?? {};

  return (
    <div>
      <PageHeader title="קמפיינים בטיקטוק" />

      <DndContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          {campaigns.map((campaign, i) => (
            <TikTokCampaignCard
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

      <div className="mt-6 flex justify-start">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "שומר..." : "המשך לפלאשי ←"}
        </Button>
      </div>
    </div>
  );
}
