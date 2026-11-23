
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const colleges = await prisma.college.findMany({
      select: {
        id: true,
        name: true,
        programs: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("Academic data error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve academic data." },
      { status: 500 }
    );
  }
}
