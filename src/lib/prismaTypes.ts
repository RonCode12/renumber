import type {
  WorkPlanModel,
  WorkPlanGetPayload,
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

export const fullWorkPlanInclude = {
  facebookCampaigns: {
    orderBy: { order: "asc" as const },
    include: {
      adsets: {
        orderBy: { order: "asc" as const },
        include: { ads: { orderBy: { order: "asc" as const } } },
      },
    },
  },
  tiktokCampaigns: {
    orderBy: { order: "asc" as const },
    include: {
      adsets: {
        orderBy: { order: "asc" as const },
        include: { ads: { orderBy: { order: "asc" as const } } },
      },
    },
  },
  smsItems: { orderBy: { order: "asc" as const } },
  mailingItems: { orderBy: { order: "asc" as const } },
};

export type FullWorkPlanRow = WorkPlanGetPayload<{
  include: typeof fullWorkPlanInclude;
}>;
