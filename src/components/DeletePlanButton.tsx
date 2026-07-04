"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function DeletePlanButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (confirming) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-slate-500">למחוק לצמיתות?</span>
        <Button
          variant="danger"
          disabled={deleting}
          onClick={async () => {
            setDeleting(true);
            await fetch(`/api/workplans/${id}`, { method: "DELETE" });
            router.refresh();
          }}
        >
          כן, מחק
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(false)}>
          ביטול
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-red-50 hover:text-red-500"
    >
      מחק
    </button>
  );
}
