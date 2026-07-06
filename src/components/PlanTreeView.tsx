import {
  AD_TYPE_LABELS,
  LOCATION_TYPE_LABELS,
  type AdType,
} from "@/lib/types";
import type { FullWorkPlanRow } from "@/lib/prismaTypes";

export function PlanTreeView({ plan }: { plan: FullWorkPlanRow }) {
  const hasFacebook = plan.facebookCampaigns.length > 0;
  const hasTiktok = plan.tiktokCampaigns.length > 0;

  return (
    <div className="space-y-5 text-sm">
      {hasFacebook && (
        <TreePlatform title="Facebook / Meta" accent="sky">
          {plan.facebookCampaigns.map((c) => (
            <TreeCampaign
              key={c.id}
              title={c.name}
              meta={`${c.dailyBudget.toLocaleString("he-IL")} ₪/יום · ${
                c.budgetLevel === "adset" ? "תקציב ברמת האדסט" : "תקציב ברמת הקמפיין"
              } · ${new Date(c.startAt).toLocaleDateString("he-IL")}–${new Date(c.endAt).toLocaleDateString("he-IL")}`}
            >
              {c.adsets.map((a) => (
                <TreeAdset
                  key={a.id}
                  title={a.audienceName}
                  meta={[
                    a.hasAgeRange ? `גילאים ${a.ageRange}` : null,
                    a.locationType === "custom" ? a.locationDetails : LOCATION_TYPE_LABELS.all_israel,
                    a.dailyBudget ? `${a.dailyBudget.toLocaleString("he-IL")} ₪/יום` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                >
                  {a.ads.map((ad, i) => (
                    <TreeAd
                      key={ad.id}
                      index={i}
                      type={AD_TYPE_LABELS[ad.adType as AdType]}
                      headline={ad.headline ?? ""}
                      missing={
                        ad.adType === "dark" && (!ad.copy || !ad.headline || !ad.graphicLink)
                      }
                    />
                  ))}
                </TreeAdset>
              ))}
            </TreeCampaign>
          ))}
          {plan.facebookGeneralNotes && (
            <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
              הערות כלליות: {plan.facebookGeneralNotes}
            </p>
          )}
        </TreePlatform>
      )}

      {hasTiktok && (
        <TreePlatform title="TikTok" accent="sky">
          {plan.tiktokCampaigns.map((c) => (
            <TreeCampaign
              key={c.id}
              title={c.name}
              meta={`${c.dailyBudgetUsd.toLocaleString("en-US")} $/יום · צפיות`}
            >
              {c.adsets.map((a) => (
                <TreeAdset
                  key={a.id}
                  title={a.audienceName}
                  meta={[
                    a.hasAgeRange ? `גילאים ${a.ageRange}` : null,
                    a.locationType === "custom" ? a.locationDetails : LOCATION_TYPE_LABELS.all_israel,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                >
                  {a.ads.map((ad, i) => (
                    <TreeAd
                      key={ad.id}
                      index={i}
                      type={AD_TYPE_LABELS[ad.adType as AdType]}
                      headline={ad.headline ?? ""}
                      missing={
                        ad.adType === "dark" && (!ad.copy || !ad.headline || !ad.graphicLink)
                      }
                    />
                  ))}
                </TreeAdset>
              ))}
            </TreeCampaign>
          ))}
        </TreePlatform>
      )}

      {plan.googleNotes && (
        <TreePlatform title="Google" accent="sky">
          <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
            {plan.googleNotes}
          </p>
        </TreePlatform>
      )}

      {(plan.smsItems.length > 0 || plan.mailingItems.length > 0) && (
        <TreePlatform title="פלאשי" accent="sky">
          {plan.smsItems.map((s, i) => (
            <p key={s.id} className="text-xs text-slate-600">
              • SMS {i + 1}: {s.title || "ללא כותרת"} —{" "}
              {new Date(s.sendAt).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" })}
            </p>
          ))}
          {plan.mailingItems.map((m, i) => (
            <p key={m.id} className="text-xs text-slate-600">
              • דיוור {i + 1}: {m.title || "ללא כותרת"} —{" "}
              {new Date(m.sendAt).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" })}
            </p>
          ))}
        </TreePlatform>
      )}

      {!hasFacebook && !hasTiktok && !plan.googleNotes && plan.smsItems.length === 0 && plan.mailingItems.length === 0 && (
        <p className="text-sm text-slate-400">אין עדיין מבנה קמפיינים להצגה עבור תוכנית זו.</p>
      )}
    </div>
  );
}

function TreePlatform({
  title,
  children,
}: {
  title: string;
  accent: "sky";
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-sky-200/60 bg-sky-50/30 p-4">
      <p className="mb-2 text-sm font-extrabold text-sky-700">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function TreeCampaign({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border-r-4 border-sky-400 bg-white p-3 pr-4">
      <p className="text-sm font-bold text-slate-800">▸ קמפיין: {title || "(ללא שם)"}</p>
      <p className="mt-0.5 text-xs text-slate-500">{meta}</p>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}

function TreeAdset({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mr-4 rounded-lg border-r-4 border-emerald-400 bg-emerald-50/40 p-2.5 pr-4">
      <p className="text-xs font-bold text-emerald-800">▸ אדסט: {title || "(ללא שם)"}</p>
      <p className="mt-0.5 text-[11px] text-emerald-700/70">{meta}</p>
      <div className="mt-1.5 space-y-1">{children}</div>
    </div>
  );
}

function TreeAd({
  index,
  type,
  headline,
  missing,
}: {
  index: number;
  type: string;
  headline: string;
  missing: boolean;
}) {
  return (
    <p className="mr-4 border-r-4 border-amber-300 bg-amber-50/40 px-2 py-1 text-[11px] text-amber-800">
      • מודעה {index + 1} — {type}
      {headline ? ` · ${headline}` : ""}
      {missing && <span className="mr-1 font-bold text-red-500">(חסרים פרטים)</span>}
    </p>
  );
}
