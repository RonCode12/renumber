import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generalSchema } from "@/lib/validation";

export async function GET() {
  const workPlans = await prisma.workPlan.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(workPlans);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = generalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { clientName, goal, startDate, endDate, totalBudget } = parsed.data;
  const workPlan = await prisma.workPlan.create({
    data: {
      clientName,
      goal,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalBudget,
    },
  });
  return NextResponse.json(workPlan, { status: 201 });
}
