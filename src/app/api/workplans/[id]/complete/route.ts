import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const workPlan = await prisma.workPlan.update({
    where: { id },
    data: { status: "completed" },
  });
  return NextResponse.json(workPlan);
}
