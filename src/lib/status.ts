export type WorkPlanStatus =
  | "draft"
  | "submitted"
  | "updated"
  | "in_progress"
  | "missing_info"
  | "ready_to_build"
  | "built"
  | "done";

export const STATUS_LABELS: Record<WorkPlanStatus, string> = {
  draft: "טיוטה",
  submitted: "נשלחה",
  updated: "עודכנה",
  in_progress: "בטיפול",
  missing_info: "חסר מידע",
  ready_to_build: "מוכנה להקמה",
  built: "הוקמה",
  done: "הושלמה",
};

export const STATUS_BADGE_CLASSES: Record<WorkPlanStatus, string> = {
  draft: "bg-amber-50 text-amber-700",
  submitted: "bg-emerald-50 text-emerald-600",
  updated: "bg-amber-50 text-amber-700",
  in_progress: "bg-sky-50 text-sky-600",
  missing_info: "bg-amber-50 text-amber-700",
  ready_to_build: "bg-sky-50 text-sky-600",
  built: "bg-sky-50 text-sky-600",
  done: "bg-emerald-50 text-emerald-600",
};

export const ADMIN_SELECTABLE_STATUSES: WorkPlanStatus[] = [
  "submitted",
  "updated",
  "in_progress",
  "missing_info",
  "ready_to_build",
  "built",
  "done",
];

export function statusLabel(status: string): string {
  return STATUS_LABELS[status as WorkPlanStatus] ?? status;
}

export function statusBadgeClass(status: string): string {
  return STATUS_BADGE_CLASSES[status as WorkPlanStatus] ?? "bg-slate-100 text-slate-500";
}

/** Status to apply whenever a user saves a step (general/facebook/google/tiktok/flashy). */
export function nextStatusAfterSave(currentStatus: string): string {
  return currentStatus === "draft" ? "draft" : "updated";
}

/** Status to apply when the user hits the final "סיום" submit button. */
export function nextStatusAfterSubmit(currentStatus: string): string {
  return currentStatus === "draft" ? "submitted" : "updated";
}
