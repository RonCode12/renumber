import type {
  WorkPlanModel,
  FacebookCampaignGetPayload,
  FacebookAdsetGetPayload,
  FacebookAdModel,
  TikTokCampaignGetPayload,
  TikTokAdsetGetPayload,
  TikTokAdModel,
  SmsItemModel,
  MailingItemModel,
} from "@/generated/prisma/models";

export type WorkPlanRow = WorkPlanModel;
export type SmsItemRow = SmsItemModel;
export type MailingItemRow = MailingItemModel;
export type FacebookAdRow = FacebookAdModel;
export type TikTokAdRow = TikTokAdModel;

export type FacebookAdsetRow = FacebookAdsetGetPayload<{
  include: { ads: true };
}>;

export type FacebookCampaignRow = FacebookCampaignGetPayload<{
  include: { adsets: { include: { ads: true } } };
}>;

export type TikTokAdsetRow = TikTokAdsetGetPayload<{
  include: { ads: true };
}>;

export type TikTokCampaignRow = TikTokCampaignGetPayload<{
  include: { adsets: { include: { ads: true } } };
}>;
