import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { PlanSummary } from "@/components/PlanSummary";
import { GOAL_LABELS, type Goal } from "@/lib/types";
import { fullWorkPlanInclude } from "@/lib/prismaTypes";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const plans = await prisma.workPlan.findMany({
    orderBy: { updatedAt: "desc" },
    include: fullWorkPlanInclude,
  });

  return (
    <div className="min-h-full">
      <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <Logo size="sm" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold text-slate-800">אזור ניהול — כל תוכניות העבודה</h1>
        <p className="mt-1 mb-8 text-sm text-slate-500">
          תצוגה מרוכזת של כל התוכניות שהוזנו על ידי הצוות, עם כל הפרטים לכל פלטפורמה. לחצו על תוכנית כדי לפתוח ולראות הכל.
        </p>

        {plans.length === 0 ? (
          <p className="text-sm text-slate-400">עדיין לא הוזנו תוכניות עבודה.</p>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <details
                key={plan.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-slate-800">{plan.clientName}</span>
                    <span
                      className={
                        plan.status === "completed"
                          ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"
                          : "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600"
                      }
                    >
                      {plan.status === "completed" ? "הושלם" : "טיוטה"}
                    </span>
                    <span className="text-sm text-slate-500">{GOAL_LABELS[plan.goal as Goal]}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>עודכן ב-{new Date(plan.updatedAt).toLocaleDateString("he-IL")}</span>
                    <span className="transition-transform group-open:rotate-180">▾</span>
                  </div>
                </summary>
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-6">
                  <PlanSummary plan={plan} />
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
