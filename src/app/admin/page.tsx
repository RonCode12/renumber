import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { AdminPlanBody } from "@/components/admin/AdminPlanBody";
import { GOAL_LABELS, type Goal } from "@/lib/types";
import { statusBadgeClass, statusLabel } from "@/lib/status";
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
          תצוגה מרוכזת של כל התוכניות שהתקבלו, עם כל הפרטים לכל פלטפורמה. לחצו על תוכנית כדי לפתוח ולראות הכל.
        </p>

        {plans.length === 0 ? (
          <p className="text-sm text-slate-400">עדיין לא הוזנו תוכניות עבודה.</p>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => {
              const isNew = plan.status === "submitted";
              const isUpdated = plan.status === "updated";
              return (
                <details
                  key={plan.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] open:border-sky-200"
                >
                  <summary className="flex cursor-pointer list-none flex-col gap-2 px-6 py-4 transition-colors hover:bg-sky-50/40 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      {isNew && (
                        <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-extrabold text-white">
                          חדש
                        </span>
                      )}
                      {isUpdated && (
                        <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-extrabold text-white">
                          עודכן
                        </span>
                      )}
                      <span className="text-base font-bold text-slate-800">
                        {plan.name || plan.clientName}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(plan.status)}`}>
                        {statusLabel(plan.status)}
                      </span>
                      <span className="text-sm text-slate-500">
                        {plan.clientName} · {GOAL_LABELS[plan.goal as Goal]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>
                        {new Date(plan.startDate).toLocaleDateString("he-IL")}–
                        {new Date(plan.endDate).toLocaleDateString("he-IL")}
                      </span>
                      <span>נוצרה ב-{new Date(plan.createdAt).toLocaleDateString("he-IL")}</span>
                      <span>עודכנה ב-{new Date(plan.updatedAt).toLocaleDateString("he-IL")}</span>
                      <span className="transition-transform group-open:rotate-180">▾</span>
                    </div>
                  </summary>
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-6">
                    <AdminPlanBody plan={plan} />
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
