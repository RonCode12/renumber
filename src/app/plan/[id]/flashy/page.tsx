import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WizardShell } from "@/components/WizardShell";
import { FlashyStep } from "@/components/steps/flashy/FlashyStep";
import type { MailingItemData, SmsItemData } from "@/lib/types";
import { toDateTimeLocal } from "@/lib/format";
import type { MailingItemRow, SmsItemRow } from "@/lib/prismaTypes";

export default async function FlashyStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await prisma.workPlan.findUnique({
    where: { id },
    include: {
      smsItems: { orderBy: { order: "asc" } },
      mailingItems: { orderBy: { order: "asc" } },
    },
  });
  if (!plan) notFound();

  const smsItems: SmsItemData[] = plan.smsItems.map((s: SmsItemRow) => ({
    id: s.id,
    title: s.title ?? "",
    copy: s.copy ?? "",
    audience: s.audience ?? "",
    sendAt: toDateTimeLocal(s.sendAt),
    hasBurningCoupons: s.hasBurningCoupons,
    sheetsLink: s.sheetsLink ?? "",
    order: s.order,
  }));

  const mailingItems: MailingItemData[] = plan.mailingItems.map((m: MailingItemRow) => ({
    id: m.id,
    title: m.title ?? "",
    copy: m.copy ?? "",
    audience: m.audience ?? "",
    imageLink: m.imageLink ?? "",
    link: m.link ?? "",
    sendAt: toDateTimeLocal(m.sendAt),
    order: m.order,
  }));

  return (
    <WizardShell planId={id} current="flashy">
      <FlashyStep planId={id} initialSms={smsItems} initialMailing={mailingItems} />
    </WizardShell>
  );
}
