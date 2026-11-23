
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findUnique({
      where: { id: 1 },
      select: {
        registrationLocked: true,
        registrationMessage: true,
      },
    });

    return NextResponse.json({
      isLocked: settings?.registrationLocked ?? false,
      message:
        settings?.registrationMessage ??
        "Student registration is currently closed. Please wait for an official announcement.",
    });
  } catch (error) {
    console.error("Registration status error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve registration status." },
      { status: 500 }
    );
  }
}
