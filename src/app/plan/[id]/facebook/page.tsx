import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WizardShell } from "@/components/WizardShell";
import { FacebookStep } from "@/components/steps/facebook/FacebookStep";
import type {
  AdData,
  AdsetData,
  AdType,
  BudgetLevel,
  FacebookCampaignData,
  FacebookCampaignType,
  LocationType,
} from "@/lib/types";
import { toDateTimeLocal } from "@/lib/format";
import type { FacebookAdRow, FacebookAdsetRow, FacebookCampaignRow } from "@/lib/prismaTypes";

export default async function FacebookStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await prisma.workPlan.findUnique({
    where: { id },
    include: {
      facebookCampaigns: {
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

  const campaigns: FacebookCampaignData[] = plan.facebookCampaigns.map((c: FacebookCampaignRow) => ({
    id: c.id,
    name: c.name,
    dailyBudget: c.dailyBudget,
    budgetLevel: c.budgetLevel as BudgetLevel,
    startAt: toDateTimeLocal(c.startAt),
    endAt: toDateTimeLocal(c.endAt),
    type: c.type as FacebookCampaignType,
    notes: c.notes ?? "",
    order: c.order,
    adsets: c.adsets.map(
      (a: FacebookAdsetRow): AdsetData => ({
        id: a.id,
        audienceName: a.audienceName,
        dailyBudget: a.dailyBudget,
        hasAgeRange: a.hasAgeRange,
        ageRange: a.ageRange ?? "",
        locationType: a.locationType as LocationType,
        locationDetails: a.locationDetails ?? "",
        notes: a.notes ?? "",
        order: a.order,
        ads: a.ads.map(
          (ad: FacebookAdRow): AdData => ({
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
    <WizardShell planId={id} current="facebook">
      <FacebookStep
        planId={id}
        initialCampaigns={campaigns}
        initialNotes={plan.facebookGeneralNotes ?? ""}
      />
    </WizardShell>
  );
}
