"use client";

import Link from "next/link";
import clsx from "clsx";
import { Logo } from "@/components/Logo";
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
    <div className="min-h-full">
      <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo size="sm" />
          <Link
            href="/"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-800"
          >
            כל תוכניות העבודה ←
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <ol className="-mx-4 mb-8 flex items-center gap-x-1 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:gap-y-2 sm:overflow-visible sm:px-0 sm:pb-0">
          {WIZARD_STEPS.map((step, i) => {
            const reachable = planId !== null;
            const isCurrent = step.key === current;
            const isDone = i < currentIndex;
            const content = (
              <span
                className={clsx(
                  "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition sm:text-sm",
                  isCurrent && "border-sky-400 bg-sky-500 text-white shadow-sm shadow-sky-200",
                  !isCurrent && isDone && "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300",
                  !isCurrent && !isDone && "border-slate-200 bg-white text-slate-400"
                )}
              >
                <span
                  className={clsx(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                    isCurrent && "bg-white/25",
                    !isCurrent && isDone && "bg-emerald-200 text-emerald-800",
                    !isCurrent && !isDone && "bg-slate-100"
                  )}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                {step.label}
              </span>
            );
            return (
              <li key={step.key} className="flex shrink-0 items-center">
                {i > 0 && (
                  <span
                    className={clsx(
                      "mx-1 h-px w-3 shrink-0 sm:w-5",
                      i <= currentIndex ? "bg-sky-300" : "bg-slate-200"
                    )}
                  />
                )}
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
    </div>
  );
}
