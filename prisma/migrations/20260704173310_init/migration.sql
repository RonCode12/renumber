-- CreateTable
CREATE TABLE "WorkPlan" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalBudget" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "facebookGeneralNotes" TEXT,
    "googleNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookCampaign" (
    "id" TEXT NOT NULL,
    "workPlanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dailyBudget" DOUBLE PRECISION NOT NULL,
    "budgetLevel" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacebookCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookAdset" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "audienceName" TEXT NOT NULL,
    "dailyBudget" DOUBLE PRECISION,
    "hasAgeRange" BOOLEAN NOT NULL DEFAULT false,
    "ageRange" TEXT,
    "locationType" TEXT NOT NULL,
    "locationDetails" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacebookAdset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookAd" (
    "id" TEXT NOT NULL,
    "adsetId" TEXT NOT NULL,
    "adType" TEXT NOT NULL,
    "copy" TEXT,
    "headline" TEXT,
    "graphicLink" TEXT,
    "postLink" TEXT,
    "link" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacebookAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TikTokCampaign" (
    "id" TEXT NOT NULL,
    "workPlanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'views',
    "dailyBudgetUsd" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TikTokCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TikTokAdset" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "audienceName" TEXT NOT NULL,
    "hasAgeRange" BOOLEAN NOT NULL DEFAULT false,
    "ageRange" TEXT,
    "locationType" TEXT NOT NULL,
    "locationDetails" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TikTokAdset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TikTokAd" (
    "id" TEXT NOT NULL,
    "adsetId" TEXT NOT NULL,
    "adType" TEXT NOT NULL,
    "copy" TEXT,
    "headline" TEXT,
    "graphicLink" TEXT,
    "postLink" TEXT,
    "link" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TikTokAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsItem" (
    "id" TEXT NOT NULL,
    "workPlanId" TEXT NOT NULL,
    "title" TEXT,
    "copy" TEXT,
    "audience" TEXT,
    "sendAt" TIMESTAMP(3) NOT NULL,
    "hasBurningCoupons" BOOLEAN NOT NULL DEFAULT false,
    "sheetsLink" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailingItem" (
    "id" TEXT NOT NULL,
    "workPlanId" TEXT NOT NULL,
    "title" TEXT,
    "copy" TEXT,
    "audience" TEXT,
    "imageLink" TEXT,
    "link" TEXT,
    "sendAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MailingItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FacebookCampaign_workPlanId_idx" ON "FacebookCampaign"("workPlanId");

-- CreateIndex
CREATE INDEX "FacebookAdset_campaignId_idx" ON "FacebookAdset"("campaignId");

-- CreateIndex
CREATE INDEX "FacebookAd_adsetId_idx" ON "FacebookAd"("adsetId");

-- CreateIndex
CREATE INDEX "TikTokCampaign_workPlanId_idx" ON "TikTokCampaign"("workPlanId");

-- CreateIndex
CREATE INDEX "TikTokAdset_campaignId_idx" ON "TikTokAdset"("campaignId");

-- CreateIndex
CREATE INDEX "TikTokAd_adsetId_idx" ON "TikTokAd"("adsetId");

-- CreateIndex
CREATE INDEX "SmsItem_workPlanId_idx" ON "SmsItem"("workPlanId");

-- CreateIndex
CREATE INDEX "MailingItem_workPlanId_idx" ON "MailingItem"("workPlanId");

-- AddForeignKey
ALTER TABLE "FacebookCampaign" ADD CONSTRAINT "FacebookCampaign_workPlanId_fkey" FOREIGN KEY ("workPlanId") REFERENCES "WorkPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookAdset" ADD CONSTRAINT "FacebookAdset_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "FacebookCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookAd" ADD CONSTRAINT "FacebookAd_adsetId_fkey" FOREIGN KEY ("adsetId") REFERENCES "FacebookAdset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TikTokCampaign" ADD CONSTRAINT "TikTokCampaign_workPlanId_fkey" FOREIGN KEY ("workPlanId") REFERENCES "WorkPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TikTokAdset" ADD CONSTRAINT "TikTokAdset_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "TikTokCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TikTokAd" ADD CONSTRAINT "TikTokAd_adsetId_fkey" FOREIGN KEY ("adsetId") REFERENCES "TikTokAdset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsItem" ADD CONSTRAINT "SmsItem_workPlanId_fkey" FOREIGN KEY ("workPlanId") REFERENCES "WorkPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingItem" ADD CONSTRAINT "MailingItem_workPlanId_fkey" FOREIGN KEY ("workPlanId") REFERENCES "WorkPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
