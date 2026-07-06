import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WizardShell } from "@/components/WizardShell";
import { GeneralForm } from "@/components/steps/GeneralForm";
import type { Goal } from "@/lib/types";
import { toDateInput } from "@/lib/format";

export default async function GeneralStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await prisma.workPlan.findUnique({ where: { id } });
  if (!plan) notFound();

  return (
    <WizardShell planId={id} current="general">
      <GeneralForm
        planId={id}
        initial={{
          name: plan.name,
          clientName: plan.clientName,
          goal: plan.goal as Goal,
          startDate: toDateInput(plan.startDate),
          endDate: toDateInput(plan.endDate),
          totalBudget: plan.totalBudget,
        }}
      />
    </WizardShell>
  );
}
