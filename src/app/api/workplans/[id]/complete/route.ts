import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nextStatusAfterSubmit } from "@/lib/status";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const current = await prisma.workPlan.findUniqueOrThrow({ where: { id }, select: { status: true } });
  const workPlan = await prisma.workPlan.update({
    where: { id },
    data: { status: nextStatusAfterSubmit(current.status) },
  });
  return NextResponse.json(workPlan);
}
