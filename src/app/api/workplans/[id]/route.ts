import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generalSchema } from "@/lib/validation";
import { nextStatusAfterSave } from "@/lib/status";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const workPlan = await prisma.workPlan.findUnique({
    where: { id },
    include: {
      facebookCampaigns: {
        orderBy: { order: "asc" },
        include: {
          adsets: {
            orderBy: { order: "asc" },
            include: { ads: { orderBy: { order: "asc" } } },
          },
        },
      },
      tiktokCampaigns: {
        orderBy: { order: "asc" },
        include: {
          adsets: {
            orderBy: { order: "asc" },
            include: { ads: { orderBy: { order: "asc" } } },
          },
        },
      },
      smsItems: { orderBy: { order: "asc" } },
      mailingItems: { orderBy: { order: "asc" } },
    },
  });
  if (!workPlan) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(workPlan);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  if (body.status) {
    const workPlan = await prisma.workPlan.update({
      where: { id },
      data: { status: body.status },
    });
    return NextResponse.json(workPlan);
  }

  const parsed = generalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { name, clientName, goal, startDate, endDate, totalBudget } = parsed.data;
  const current = await prisma.workPlan.findUniqueOrThrow({
    where: { id },
    select: { status: true },
  });
  const workPlan = await prisma.workPlan.update({
    where: { id },
    data: {
      name,
      clientName,
      goal,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalBudget,
      status: nextStatusAfterSave(current.status),
    },
  });
  return NextResponse.json(workPlan);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.workPlan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
