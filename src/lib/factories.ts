import { v4 as uuid } from "uuid";
import type {
  AdData,
  AdsetData,
  FacebookCampaignData,
  MailingItemData,
  SmsItemData,
  TikTokCampaignData,
} from "@/lib/types";

export function createAd(order: number): AdData {
  return {
    id: uuid(),
    adType: "dark",
    copy: "",
    headline: "",
    graphicLink: "",
    postLink: "",
    link: "",
    notes: "",
    order,
  };
}

export function createAdset(order: number): AdsetData {
  return {
    id: uuid(),
    audienceName: "",
    dailyBudget: null,
    hasAgeRange: false,
    ageRange: "",
    locationType: "all_israel",
    locationDetails: "",
    notes: "",
    order,
    ads: [createAd(0)],
  };
}

export function createFacebookCampaign(order: number): FacebookCampaignData {
  return {
    id: uuid(),
    name: "",
    dailyBudget: null,
    budgetLevel: "campaign",
    startAt: "",
    endAt: "",
    type: "engagement",
    notes: "",
    order,
    adsets: [createAdset(0)],
    leadCollectionType: "",
    websiteUrl: "",
    leadFormTitle: "",
    leadFormDescription: "",
    leadFormQuestions: "",
  };
}

export function createTikTokCampaign(order: number): TikTokCampaignData {
  return {
    id: uuid(),
    name: "",
    type: "views",
    dailyBudgetUsd: null,
    notes: "",
    order,
    adsets: [createAdset(0)],
  };
}

export function createSmsItem(order: number): SmsItemData {
  return {
    id: uuid(),
    title: "",
    copy: "",
    audience: "",
    sendAt: "",
    hasBurningCoupons: false,
    sheetsLink: "",
    order,
  };
}

export function createMailingItem(order: number): MailingItemData {
  return {
    id: uuid(),
    title: "",
    copy: "",
    audience: "",
    imageLink: "",
    link: "",
    sendAt: "",
    order,
  };
}
