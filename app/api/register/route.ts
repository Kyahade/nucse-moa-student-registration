
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Check whether registration is locked.
    const settings = await prisma.systemSetting.findUnique({
      where: { id: 1 },
      select: {
        registrationLocked: true,
        registrationMessage: true,
      },
    });

    if (settings?.registrationLocked) {
      return NextResponse.json(
        {
          error:
            settings.registrationMessage ||
            "Student registration is currently closed.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const email = String(body.email ?? "").trim().toLowerCase();
    const studentId = String(body.studentId ?? "").trim();
    const programId = Number(body.programId);
    const yearLevel = Number(body.yearLevel);

    if (!/^[a-zA-Z0-9._%+-]+@students\.nu-moa\.edu\.ph$/i.test(email)) {
      return NextResponse.json(
        { error: "Use your NU MOA student email address." },
        { status: 400 }
      );
    }

    if (
      !studentId ||
      !Number.isInteger(programId) ||
      programId <= 0 ||
      !Number.isInteger(yearLevel) ||
      yearLevel < 1 ||
      yearLevel > 6
    ) {
      return NextResponse.json(
        { error: "Please provide valid registration details." },
        { status: 400 }
      );
    }

    const existingVoter = await prisma.voter.findFirst({
      where: {
        OR: [{ email }, { studentId }],
      },
    });

    if (existingVoter) {
      return NextResponse.json(
        { error: "This email or student ID is already registered." },
        { status: 409 }
      );
    }

    const program = await prisma.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return NextResponse.json(
        { error: "Invalid academic program." },
        { status: 400 }
      );
    }

    const voter = await prisma.voter.create({
      data: {
        email,
        studentId,
        programId,
        yearLevel,
      },
      select: {
        id: true,
        email: true,
        studentId: true,
        programId: true,
        yearLevel: true,
      },
    });

    return NextResponse.json(
      { message: "Registration successful.", voter },
      { status: 201 }
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This email or student ID is already registered." },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Something went wrong during registration." },
      { status: 500 }
    );
  }
}
