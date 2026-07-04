import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { googlePayloadSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = googlePayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const workPlan = await prisma.workPlan.update({
    where: { id },
    data: { googleNotes: parsed.data.googleNotes },
  });
  return NextResponse.json(workPlan);
}
