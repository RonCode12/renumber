import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WizardShell } from "@/components/WizardShell";
import { TikTokStep } from "@/components/steps/tiktok/TikTokStep";
import type { AdData, AdsetData, AdType, LocationType, TikTokCampaignData } from "@/lib/types";
import type { TikTokAdRow, TikTokAdsetRow, TikTokCampaignRow } from "@/lib/prismaTypes";

export default async function TikTokStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await prisma.workPlan.findUnique({
    where: { id },
    include: {
      tiktokCampaigns: {
        orderBy: { order: "asc" },
        include: {
          adsets: {
            orderBy: { order: "asc" },
            include: { ads: { orderBy: { order: "asc" } } },
          },
        },
      },
    },
  });
  if (!plan) notFound();

  const campaigns: TikTokCampaignData[] = plan.tiktokCampaigns.map((c: TikTokCampaignRow) => ({
    id: c.id,
    name: c.name,
    type: "views",
    dailyBudgetUsd: c.dailyBudgetUsd,
    notes: c.notes ?? "",
    order: c.order,
    adsets: c.adsets.map(
      (a: TikTokAdsetRow): AdsetData => ({
        id: a.id,
        audienceName: a.audienceName,
        dailyBudget: null,
        hasAgeRange: a.hasAgeRange,
        ageRange: a.ageRange ?? "",
        locationType: a.locationType as LocationType,
        locationDetails: a.locationDetails ?? "",
        notes: a.notes ?? "",
        order: a.order,
        ads: a.ads.map(
          (ad: TikTokAdRow): AdData => ({
            id: ad.id,
            adType: ad.adType as AdType,
            copy: ad.copy ?? "",
            headline: ad.headline ?? "",
            graphicLink: ad.graphicLink ?? "",
            postLink: ad.postLink ?? "",
            link: ad.link ?? "",
            notes: ad.notes ?? "",
            order: ad.order,
          })
        ),
      })
    ),
  }));

  return (
    <WizardShell planId={id} current="tiktok">
      <TikTokStep planId={id} initialCampaigns={campaigns} />
    </WizardShell>
  );
}
