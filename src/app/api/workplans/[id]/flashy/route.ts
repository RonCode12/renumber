import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { flashyPayloadSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = flashyPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { smsItems, mailingItems } = parsed.data;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.smsItem.deleteMany({ where: { workPlanId: id } });
    await tx.mailingItem.deleteMany({ where: { workPlanId: id } });
    if (smsItems.length) {
      await tx.smsItem.createMany({
        data: smsItems.map((sms) => ({
          workPlanId: id,
          title: sms.title,
          copy: sms.copy,
          audience: sms.audience,
          sendAt: new Date(sms.sendAt),
          hasBurningCoupons: sms.hasBurningCoupons,
          sheetsLink: sms.sheetsLink,
          order: sms.order,
        })),
      });
    }
    if (mailingItems.length) {
      await tx.mailingItem.createMany({
        data: mailingItems.map((mailing) => ({
          workPlanId: id,
          title: mailing.title,
          copy: mailing.copy,
          audience: mailing.audience,
          imageLink: mailing.imageLink,
          link: mailing.link,
          sendAt: new Date(mailing.sendAt),
          order: mailing.order,
        })),
      });
    }
  });

  return NextResponse.json({ ok: true });
}
