import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GOAL_LABELS, type Goal } from "@/lib/types";
import { Button, Card } from "@/components/ui";
import { DeletePlanButton } from "@/components/DeletePlanButton";
import { Logo } from "@/components/Logo";
import type { WorkPlanRow } from "@/lib/prismaTypes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const workPlans = await prisma.workPlan.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-full">
      <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5 sm:px-6">
          <Logo size="md" />
          <Link href="/admin" className="text-sm font-semibold text-slate-500 hover:text-slate-800">
            אזור ניהול
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">תוכניות עבודה לקמפיינים</h1>
            <p className="mt-1 text-sm text-slate-500">
              ניהול תוכניות עבודה חודשיות ותוכניות ליום מכירות עבור לקוחות
            </p>
          </div>
          <Link href="/plan/new">
            <Button className="shadow-md shadow-amber-200/70">+ תוכנית עבודה חדשה</Button>
          </Link>
        </div>

        {workPlans.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
              📋
            </div>
            <p className="font-semibold text-slate-600">עדיין לא נוצרו תוכניות עבודה</p>
            <p className="text-sm text-slate-400">
              לחצו על &quot;תוכנית עבודה חדשה&quot; כדי להתחיל את הראשונה
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {workPlans.map((plan: WorkPlanRow) => (
              <Card
                key={plan.id}
                className="flex items-center justify-between gap-4 transition hover:border-amber-200 hover:shadow-md"
              >
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
    </div>
  );
}
