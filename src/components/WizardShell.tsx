"use client";

import Link from "next/link";
import clsx from "clsx";
import { WIZARD_STEPS, type WizardStepKey } from "@/lib/types";

export function WizardShell({
  planId,
  current,
  children,
}: {
  planId: string | null;
  current: WizardStepKey;
  children: React.ReactNode;
}) {
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.key === current);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-700">
          ← כל תוכניות העבודה
        </Link>
        <h2 className="text-sm font-bold text-slate-400">
          מערכת תוכניות עבודה לקמפיינים
        </h2>
      </div>

      <ol className="mb-8 flex flex-wrap items-center gap-2">
        {WIZARD_STEPS.map((step, i) => {
          const reachable = planId !== null;
          const isCurrent = step.key === current;
          const isDone = i < currentIndex;
          const content = (
            <span
              className={clsx(
                "flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition sm:text-sm",
                isCurrent && "border-sky-400 bg-sky-500 text-white shadow-sm",
                !isCurrent && isDone && "border-sky-200 bg-sky-50 text-sky-700",
                !isCurrent && !isDone && "border-slate-200 bg-white text-slate-400"
              )}
            >
              <span
                className={clsx(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                  isCurrent && "bg-white/25",
                  !isCurrent && isDone && "bg-sky-200 text-sky-800",
                  !isCurrent && !isDone && "bg-slate-100"
                )}
              >
                {i + 1}
              </span>
              {step.label}
            </span>
          );
          return (
            <li key={step.key}>
              {reachable && step.key !== "finish" ? (
                <Link href={`/plan/${planId}/${step.path}`}>{content}</Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ol>

      <div>{children}</div>
    </div>
  );
}
