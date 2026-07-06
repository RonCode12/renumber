import Link from "next/link";
import { Card } from "@/components/ui";
import {
  AD_TYPE_LABELS,
  BUDGET_LEVEL_LABELS,
  FACEBOOK_CAMPAIGN_TYPE_LABELS,
  GOAL_LABELS,
  LOCATION_TYPE_LABELS,
  type AdType,
  type BudgetLevel,
  type FacebookCampaignType,
  type Goal,
} from "@/lib/types";
import type {
  FacebookAdRow,
  FacebookAdsetRow,
  FacebookCampaignRow,
  FullWorkPlanRow,
  TikTokAdRow,
  TikTokAdsetRow,
  TikTokCampaignRow,
} from "@/lib/prismaTypes";

function fmt(d: Date, withTime = false) {
  return withTime
    ? d.toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" })
    : d.toLocaleDateString("he-IL");
}

export function PlanSummary({ plan }: { plan: FullWorkPlanRow }) {
  return (
    <div className="space-y-6">
      <SummarySection title="פרטים כלליים" editHref={`/plan/${plan.id}/general`}>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Row label="לקוח" value={plan.clientName} />
          <Row label="מטרה" value={GOAL_LABELS[plan.goal as Goal]} />
          <Row label="תאריכים" value={`${fmt(plan.startDate)} – ${fmt(plan.endDate)}`} />
          <Row label="תקציב כולל" value={`${plan.totalBudget.toLocaleString("he-IL")} ₪`} />
        </dl>
      </SummarySection>

      <SummarySection title="פייסבוק / מטא" editHref={`/plan/${plan.id}/facebook`}>
        {plan.facebookCampaigns.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-4">
            {plan.facebookCampaigns.map((c: FacebookCampaignRow, i: number) => (
              <div key={c.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-bold text-slate-800">
                  קמפיין {i + 1}: {c.name}
                </p>
                <dl className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <Row label="תקציב יומי" value={`${c.dailyBudget.toLocaleString("he-IL")} ₪`} />
                  <Row label="רמת תקציב" value={BUDGET_LEVEL_LABELS[c.budgetLevel as BudgetLevel]} />
                  <Row label="סוג" value={FACEBOOK_CAMPAIGN_TYPE_LABELS[c.type as FacebookCampaignType]} />
                  <Row label="תאריכים" value={`${fmt(c.startAt, true)} – ${fmt(c.endAt, true)}`} />
                </dl>
                <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                  {c.adsets.map((a: FacebookAdsetRow, ai: number) => (
                    <div key={a.id} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-700">
                        אדסט {ai + 1}: {a.audienceName} ·{" "}
                        {a.locationType === "custom" ? a.locationDetails : LOCATION_TYPE_LABELS["all_israel"]}
                        {a.hasAgeRange ? ` · גילאים ${a.ageRange}` : ""}
                      </p>
                      <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                        {a.ads.map((ad: FacebookAdRow, adi: number) => (
                          <li key={ad.id}>
                            מודעה {adi + 1} — {AD_TYPE_LABELS[ad.adType as AdType]}
                            {ad.headline ? ` · ${ad.headline}` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {plan.facebookGeneralNotes && (
          <p className="mt-4 text-sm text-slate-500">
            <span className="font-semibold text-slate-600">הערות כלליות: </span>
            {plan.facebookGeneralNotes}
          </p>
        )}
      </SummarySection>

      <SummarySection title="גוגל" editHref={`/plan/${plan.id}/google`}>
        {plan.googleNotes ? (
          <p className="whitespace-pre-wrap text-sm text-slate-600">{plan.googleNotes}</p>
        ) : (
          <Empty />
        )}
      </SummarySection>

      <SummarySection title="טיקטוק" editHref={`/plan/${plan.id}/tiktok`}>
        {plan.tiktokCampaigns.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-4">
            {plan.tiktokCampaigns.map((c: TikTokCampaignRow, i: number) => (
              <div key={c.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-bold text-slate-800">
                  קמפיין {i + 1}: {c.name}
                </p>
                <dl className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <Row label="תקציב יומי" value={`${c.dailyBudgetUsd.toLocaleString("en-US")} $`} />
                  <Row label="סוג" value="צפיות" />
                </dl>
                <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                  {c.adsets.map((a: TikTokAdsetRow, ai: number) => (
                    <div key={a.id} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-700">
                        אדסט {ai + 1}: {a.audienceName} ·{" "}
                        {a.locationType === "custom" ? a.locationDetails : LOCATION_TYPE_LABELS["all_israel"]}
                        {a.hasAgeRange ? ` · גילאים ${a.ageRange}` : ""}
                      </p>
                      <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                        {a.ads.map((ad: TikTokAdRow, adi: number) => (
                          <li key={ad.id}>
                            מודעה {adi + 1} — {AD_TYPE_LABELS[ad.adType as AdType]}
                            {ad.headline ? ` · ${ad.headline}` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </SummarySection>

      <SummarySection title="פלאשי: SMS ודיוור" editHref={`/plan/${plan.id}/flashy`}>
        {plan.smsItems.length === 0 && plan.mailingItems.length === 0 ? (
          <Empty />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-bold text-slate-600">SMS ({plan.smsItems.length})</p>
              <ul className="space-y-1 text-xs text-slate-500">
                {plan.smsItems.map((s, i) => (
                  <li key={s.id}>
                    {i + 1}. {s.title || "ללא כותרת"} — {fmt(s.sendAt, true)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-slate-600">דיוור ({plan.mailingItems.length})</p>
              <ul className="space-y-1 text-xs text-slate-500">
                {plan.mailingItems.map((m, i) => (
                  <li key={m.id}>
                    {i + 1}. {m.title || "ללא כותרת"} — {fmt(m.sendAt, true)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </SummarySection>
    </div>
  );
}

function SummarySection({
  title,
  editHref,
  children,
}: {
  title: string;
  editHref: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <Link href={editHref} className="text-xs font-semibold text-amber-700 hover:underline">
          עריכה
        </Link>
      </div>
      {children}
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-slate-400">אין מידע להצגה עבור פלטפורמה זו.</p>;
}
