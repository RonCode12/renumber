import type { AdData, AdsetData } from "@/lib/types";

export function adDraggableId(campaignId: string, adsetId: string, adId: string) {
  return `ad::${campaignId}::${adsetId}::${adId}`;
}

export function adsetDroppableId(campaignId: string, adsetId: string) {
  return `adset::${campaignId}::${adsetId}`;
}

export function parseAdDraggableId(id: string) {
  const [, campaignId, adsetId, adId] = id.split("::");
  return { campaignId, adsetId, adId };
}

export function parseAdsetDroppableId(id: string) {
  const [, campaignId, adsetId] = id.split("::");
  return { campaignId, adsetId };
}

interface CampaignLike {
  id: string;
  adsets: AdsetData[];
}

export function moveAdBetweenAdsets<C extends CampaignLike>(
  campaigns: C[],
  activeDraggableId: string,
  overDroppableId: string
): C[] {
  const source = parseAdDraggableId(activeDraggableId);
  const target = parseAdsetDroppableId(overDroppableId);

  if (source.adsetId === target.adsetId) return campaigns;

  let movedAd: AdData | null = null;

  const withRemoval = campaigns.map((campaign) => {
    if (campaign.id !== source.campaignId) return campaign;
    return {
      ...campaign,
      adsets: campaign.adsets.map((adset) => {
        if (adset.id !== source.adsetId) return adset;
        const ad = adset.ads.find((a) => a.id === source.adId);
        if (ad) movedAd = ad;
        return {
          ...adset,
          ads: adset.ads
            .filter((a) => a.id !== source.adId)
            .map((a, i) => ({ ...a, order: i })),
        };
      }),
    };
  });

  if (!movedAd) return campaigns;

  return withRemoval.map((campaign) => {
    if (campaign.id !== target.campaignId) return campaign;
    return {
      ...campaign,
      adsets: campaign.adsets.map((adset) => {
        if (adset.id !== target.adsetId) return adset;
        const nextAds = [...adset.ads, { ...(movedAd as AdData), order: adset.ads.length }];
        return { ...adset, ads: nextAds };
      }),
    };
  });
}
