import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { facebookPayloadSchema } from "@/lib/validation";
import { nextStatusAfterSave } from "@/lib/status";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = facebookPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { facebookGeneralNotes, campaigns } = parsed.data;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const current = await tx.workPlan.findUniqueOrThrow({ where: { id }, select: { status: true } });
    await tx.workPlan.update({
      where: { id },
      data: { facebookGeneralNotes, status: nextStatusAfterSave(current.status) },
    });
    await tx.facebookCampaign.deleteMany({ where: { workPlanId: id } });
    for (const campaign of campaigns) {
      await tx.facebookCampaign.create({
        data: {
          workPlanId: id,
          name: campaign.name,
          dailyBudget: campaign.dailyBudget,
          budgetLevel: campaign.budgetLevel,
          startAt: new Date(campaign.startAt),
          endAt: new Date(campaign.endAt),
          type: campaign.type,
          notes: campaign.notes,
          order: campaign.order,
          adsets: {
            create: campaign.adsets.map((adset) => ({
              audienceName: adset.audienceName,
              dailyBudget: adset.dailyBudget,
              hasAgeRange: adset.hasAgeRange,
              ageRange: adset.ageRange,
              locationType: adset.locationType,
              locationDetails: adset.locationDetails,
              notes: adset.notes,
              order: adset.order,
              ads: {
                create: adset.ads.map((ad) => ({
                  adType: ad.adType,
                  copy: ad.copy,
                  headline: ad.headline,
                  graphicLink: ad.graphicLink,
                  postLink: ad.postLink,
                  link: ad.link,
                  notes: ad.notes,
                  order: ad.order,
                })),
              },
            })),
          },
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
