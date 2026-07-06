import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WizardShell } from "@/components/WizardShell";
import { PlanSummary } from "@/components/PlanSummary";
import { fullWorkPlanInclude } from "@/lib/prismaTypes";

export default async function FinishStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await prisma.workPlan.findUnique({
    where: { id },
    include: fullWorkPlanInclude,
  });
  if (!plan) notFound();

  return (
    <WizardShell planId={id} current="finish">
      <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-2xl font-extrabold text-emerald-700">סיימנו!!! בהצלחה :)</p>
        <p className="mt-1 text-sm text-emerald-600">
          תוכנית העבודה נשמרה במלואה. ניתן לחזור ולערוך כל שלב בכל עת דרך התפריט למעלה.
        </p>
      </div>

      <PlanSummary plan={plan} />
    </WizardShell>
  );
}
