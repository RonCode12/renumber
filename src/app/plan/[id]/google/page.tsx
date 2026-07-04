import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WizardShell } from "@/components/WizardShell";
import { GoogleStep } from "@/components/steps/GoogleStep";

export default async function GoogleStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await prisma.workPlan.findUnique({ where: { id } });
  if (!plan) notFound();

  return (
    <WizardShell planId={id} current="google">
      <GoogleStep planId={id} initialNotes={plan.googleNotes ?? ""} />
    </WizardShell>
  );
}
