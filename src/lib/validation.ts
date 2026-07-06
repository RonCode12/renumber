import { z } from "zod";
import { TIKTOK_MIN_DAILY_BUDGET_USD } from "@/lib/types";

const REQUIRED_MESSAGE = "נא למלא שדה זה";

export const generalSchema = z.object({
  name: z.string().min(1, REQUIRED_MESSAGE),
  clientName: z.string().min(1, REQUIRED_MESSAGE),
  goal: z.enum(["monthly", "sales_day"]),
  startDate: z.string().min(1, REQUIRED_MESSAGE),
  endDate: z.string().min(1, REQUIRED_MESSAGE),
  totalBudget: z.number().positive(),
});

export const adminPayloadSchema = z.object({
  status: z.string().min(1).optional(),
  adminNotes: z.string().optional(),
});

const adSchema = z
  .object({
    id: z.string(),
    adType: z.enum(["dark", "existing_post"]),
    copy: z.string().optional().default(""),
    headline: z.string().optional().default(""),
    graphicLink: z.string().optional().default(""),
    postLink: z.string().optional().default(""),
    link: z.string().optional().default(""),
    notes: z.string().optional().default(""),
    order: z.number(),
  })
  .superRefine((ad, ctx) => {
    if (ad.adType === "dark") {
      if (!ad.copy) ctx.addIssue({ code: "custom", path: ["copy"], message: REQUIRED_MESSAGE });
      if (!ad.headline)
        ctx.addIssue({ code: "custom", path: ["headline"], message: REQUIRED_MESSAGE });
      if (!ad.graphicLink)
        ctx.addIssue({ code: "custom", path: ["graphicLink"], message: REQUIRED_MESSAGE });
    } else if (ad.adType === "existing_post") {
      if (!ad.postLink)
        ctx.addIssue({ code: "custom", path: ["postLink"], message: REQUIRED_MESSAGE });
    }
  });

const adsetSchema = z
  .object({
    id: z.string(),
    audienceName: z.string().min(1, REQUIRED_MESSAGE),
    dailyBudget: z.number().nullable(),
    hasAgeRange: z.boolean(),
    ageRange: z.string().optional().default(""),
    locationType: z.enum(["all_israel", "custom"]),
    locationDetails: z.string().optional().default(""),
    notes: z.string().optional().default(""),
    order: z.number(),
    ads: z.array(adSchema).min(1),
  })
  .superRefine((adset, ctx) => {
    if (adset.hasAgeRange && !adset.ageRange)
      ctx.addIssue({ code: "custom", path: ["ageRange"], message: REQUIRED_MESSAGE });
    if (adset.locationType === "custom" && !adset.locationDetails)
      ctx.addIssue({
        code: "custom",
        path: ["locationDetails"],
        message: REQUIRED_MESSAGE,
      });
  });

export const facebookCampaignSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, REQUIRED_MESSAGE),
    dailyBudget: z.number().positive(),
    budgetLevel: z.enum(["campaign", "adset"]),
    startAt: z.string().min(1, REQUIRED_MESSAGE),
    endAt: z.string().min(1, REQUIRED_MESSAGE),
    type: z.enum(["engagement", "conversions", "awareness", "traffic", "leads"]),
    notes: z.string().optional().default(""),
    order: z.number(),
    adsets: z.array(adsetSchema).min(1),
    leadCollectionType: z.enum(["meta_form", "website", ""]).optional().default(""),
    websiteUrl: z.string().optional().default(""),
    leadFormTitle: z.string().optional().default(""),
    leadFormDescription: z.string().optional().default(""),
    leadFormQuestions: z.string().optional().default(""),
  })
  .superRefine((campaign, ctx) => {
    if (campaign.budgetLevel === "adset") {
      campaign.adsets.forEach((adset, i) => {
        if (adset.dailyBudget === null || adset.dailyBudget <= 0)
          ctx.addIssue({
            code: "custom",
            path: ["adsets", i, "dailyBudget"],
            message: REQUIRED_MESSAGE,
          });
      });
    }
    if (campaign.type === "leads") {
      if (!campaign.leadCollectionType)
        ctx.addIssue({ code: "custom", path: ["leadCollectionType"], message: REQUIRED_MESSAGE });
      if (campaign.leadCollectionType === "website") {
        if (!campaign.websiteUrl) {
          ctx.addIssue({ code: "custom", path: ["websiteUrl"], message: REQUIRED_MESSAGE });
        } else if (!z.string().url().safeParse(campaign.websiteUrl).success) {
          ctx.addIssue({ code: "custom", path: ["websiteUrl"], message: "כתובת URL לא תקינה" });
        }
      }
    }
  });

export const facebookPayloadSchema = z.object({
  facebookGeneralNotes: z.string().optional().default(""),
  campaigns: z.array(facebookCampaignSchema),
});

export const tiktokCampaignSchema = z.object({
  id: z.string(),
  name: z.string().min(1, REQUIRED_MESSAGE),
  type: z.literal("views"),
  dailyBudgetUsd: z.number().min(TIKTOK_MIN_DAILY_BUDGET_USD),
  notes: z.string().optional().default(""),
  order: z.number(),
  adsets: z.array(adsetSchema).min(1),
});

export const tiktokPayloadSchema = z.object({
  campaigns: z.array(tiktokCampaignSchema),
});

export const googlePayloadSchema = z.object({
  googleNotes: z.string().optional().default(""),
});

const smsSchema = z.object({
  id: z.string(),
  title: z.string().optional().default(""),
  copy: z.string().optional().default(""),
  audience: z.string().optional().default(""),
  sendAt: z.string().min(1, REQUIRED_MESSAGE),
  hasBurningCoupons: z.boolean(),
  sheetsLink: z.string().optional().default(""),
  order: z.number(),
});

const mailingSchema = z.object({
  id: z.string(),
  title: z.string().optional().default(""),
  copy: z.string().optional().default(""),
  audience: z.string().optional().default(""),
  imageLink: z.string().optional().default(""),
  link: z.string().optional().default(""),
  sendAt: z.string().min(1, REQUIRED_MESSAGE),
  order: z.number(),
});

export const flashyPayloadSchema = z.object({
  smsItems: z.array(smsSchema),
  mailingItems: z.array(mailingSchema),
});
