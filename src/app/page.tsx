import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GOAL_LABELS, type Goal } from "@/lib/types";
import { Button, Card, PageHeader } from "@/components/ui";
import { DeletePlanButton } from "@/components/DeletePlanButton";
import type { WorkPlanRow } from "@/lib/prismaTypes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const workPlans = await prisma.workPlan.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <PageHeader
          title="מערכת תוכניות עבודה לקמפיינים"
          subtitle="ניהול תוכניות עבודה חודשיות ותוכניות ליום מכירות עבור לקוחות"
        />
        <Link href="/plan/new">
          <Button>+ תוכנית עבודה חדשה</Button>
        </Link>
      </div>

      {workPlans.length === 0 ? (
        <Card className="text-center text-slate-500">
          עדיין לא נוצרו תוכניות עבודה. לחצו על &quot;תוכנית עבודה חדשה&quot; כדי להתחיל.
        </Card>
      ) : (
        <div className="space-y-3">
          {workPlans.map((plan: WorkPlanRow) => (
            <Card key={plan.id} className="flex items-center justify-between gap-4">
              <Link href={`/plan/${plan.id}/general`} className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-slate-800">
                    {plan.clientName}
                  </span>
                  <span
                    className={
                      plan.status === "completed"
                        ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"
                        : "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600"
                    }
                  >
                    {plan.status === "completed" ? "הושלם" : "טיוטה"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {GOAL_LABELS[plan.goal as Goal]} · עודכן ב-
                  {new Date(plan.updatedAt).toLocaleDateString("he-IL")}
                </p>
              </Link>
              <DeletePlanButton id={plan.id} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
