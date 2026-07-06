export type Goal = "monthly" | "sales_day";
export type BudgetLevel = "campaign" | "adset";
export type FacebookCampaignType =
  | "engagement"
  | "conversions"
  | "awareness"
  | "traffic"
  | "leads";
export type LeadCollectionType = "meta_form" | "website";
export type LocationType = "all_israel" | "custom";
export type AdType = "dark" | "existing_post";

export const GOAL_LABELS: Record<Goal, string> = {
  monthly: "תוכנית עבודה חודשית",
  sales_day: "תוכנית עבור יום מכירות",
};

export const BUDGET_LEVEL_LABELS: Record<BudgetLevel, string> = {
  campaign: "תקציב ברמת הקמפיין",
  adset: "תקציב ברמת סדרת המודעות / אדסט",
};

export const FACEBOOK_CAMPAIGN_TYPE_LABELS: Record<
  FacebookCampaignType,
  string
> = {
  engagement: "מעורבות",
  conversions: "המרות",
  awareness: "מודעות",
  traffic: "טראפיק",
  leads: "לידים",
};

export const LEAD_COLLECTION_TYPE_LABELS: Record<LeadCollectionType, string> = {
  meta_form: "טופס לידים במטא",
  website: "לידים לאתר / דף נחיתה",
};

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  all_israel: "ישראל כולה",
  custom: "מיקוד אחר",
};

export const AD_TYPE_LABELS: Record<AdType, string> = {
  dark: "דארק",
  existing_post: "מתוך פוסט קיים",
};

export interface AdData {
  id: string;
  adType: AdType;
  copy: string;
  headline: string;
  graphicLink: string;
  postLink: string;
  link: string;
  notes: string;
  order: number;
}

export interface AdsetData {
  id: string;
  audienceName: string;
  dailyBudget: number | null;
  hasAgeRange: boolean;
  ageRange: string;
  locationType: LocationType;
  locationDetails: string;
  notes: string;
  order: number;
  ads: AdData[];
}

export interface FacebookCampaignData {
  id: string;
  name: string;
  dailyBudget: number | null;
  budgetLevel: BudgetLevel;
  startAt: string;
  endAt: string;
  type: FacebookCampaignType;
  notes: string;
  order: number;
  adsets: AdsetData[];
  // Meta Leads only (type === "leads")
  leadCollectionType: LeadCollectionType | "";
  websiteUrl: string;
  leadFormTitle: string;
  leadFormDescription: string;
  leadFormQuestions: string;
}

export interface TikTokCampaignData {
  id: string;
  name: string;
  type: "views";
  dailyBudgetUsd: number | null;
  notes: string;
  order: number;
  adsets: AdsetData[];
}

export interface SmsItemData {
  id: string;
  title: string;
  copy: string;
  audience: string;
  sendAt: string;
  hasBurningCoupons: boolean;
  sheetsLink: string;
  order: number;
}

export interface MailingItemData {
  id: string;
  title: string;
  copy: string;
  audience: string;
  imageLink: string;
  link: string;
  sendAt: string;
  order: number;
}

export interface WorkPlanData {
  id: string;
  name: string;
  clientName: string;
  goal: Goal | "";
  startDate: string;
  endDate: string;
  totalBudget: number | null;
  status: string;
  facebookGeneralNotes: string;
  googleNotes: string;
  adminNotes: string;
  facebookCampaigns: FacebookCampaignData[];
  tiktokCampaigns: TikTokCampaignData[];
  smsItems: SmsItemData[];
  mailingItems: MailingItemData[];
  createdAt: string;
  updatedAt: string;
}

export const TIKTOK_MIN_DAILY_BUDGET_USD = 20;

export const WIZARD_STEPS = [
  { key: "general", label: "פרטים כלליים", path: "general" },
  { key: "facebook", label: "פייסבוק / מטא", path: "facebook" },
  { key: "google", label: "גוגל", path: "google" },
  { key: "tiktok", label: "טיקטוק", path: "tiktok" },
  { key: "flashy", label: "פלאשי", path: "flashy" },
  { key: "finish", label: "סיום", path: "finish" },
] as const;

export type WizardStepKey = (typeof WIZARD_STEPS)[number]["key"];
