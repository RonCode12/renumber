"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextAreaField } from "@/components/ui";
import { ADMIN_SELECTABLE_STATUSES, STATUS_LABELS, type WorkPlanStatus } from "@/lib/status";
import { PlanSummary } from "@/components/PlanSummary";
import { PlanTreeView } from "@/components/PlanTreeView";
import type { FullWorkPlanRow } from "@/lib/prismaTypes";

export function AdminPlanBody({ plan }: { plan: FullWorkPlanRow }) {
  const router = useRouter();
  const [view, setView] = useState<"brief" | "tree">("brief");
  const [status, setStatus] = useState(plan.status);
  const [adminNotes, setAdminNotes] = useState(plan.adminNotes ?? "");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  async function saveStatus(nextStatus: string) {
    setStatus(nextStatus);
    setSavingStatus(true);
    try {
      await fetch(`/api/workplans/${plan.id}/admin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      router.refresh();
    } finally {
      setSavingStatus(false);
    }
  }

  async function saveNotes() {
    setSavingNotes(true);
    try {
      await fetch(`/api/workplans/${plan.id}/admin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      router.refresh();
    } finally {
      setSavingNotes(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-sky-200/60 bg-sky-50/40 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-600">
            סטטוס (ניהולי)
          </label>
          <select
            value={status}
            disabled={savingStatus}
            onChange={(e) => saveStatus(e.target.value)}
            className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400"
          >
            {ADMIN_SELECTABLE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s as WorkPlanStatus]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 rounded-xl bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setView("brief")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              view === "brief" ? "bg-sky-500 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            תצוגת בריף
          </button>
          <button
            type="button"
            onClick={() => setView("tree")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              view === "tree" ? "bg-sky-500 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            מבנה קמפיינים
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200/60 bg-amber-50/30 p-4">
        <TextAreaField
          label="הערות ניהוליות פנימיות (מוצג רק כאן, לא למשתמשת)"
          rows={2}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
        />
        <div className="mt-2 flex justify-start">
          <Button variant="secondary" onClick={saveNotes} disabled={savingNotes}>
            {savingNotes ? "שומר..." : "שמירת הערה"}
          </Button>
        </div>
      </div>

      {view === "brief" ? <PlanSummary plan={plan} /> : <PlanTreeView plan={plan} />}
    </div>
  );
}
