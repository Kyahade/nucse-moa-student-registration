
  import { NextResponse } from "next/server";
  import { put, del } from "@vercel/blob";
  import { randomUUID } from "node:crypto";
  import { prisma } from "@/lib/prisma";

  const MAX_FILE_SIZE = 4 * 1024 * 1024;

  async function validateCorFile(file: File) {
    if (file.size === 0) {
      return null;
    }

    if (file.size > MAX_FILE_SIZE) {
      return null;
    }

    const signature = new Uint8Array(
      await file.slice(0, 8).arrayBuffer()
    );

    // PDF: %PDF-
    if (
      signature.length >= 5 &&
      signature[0] === 0x25 &&
      signature[1] === 0x50 &&
      signature[2] === 0x44 &&
      signature[3] === 0x46 &&
      signature[4] === 0x2d
    ) {
      return {
        contentType: "application/pdf",
        extension: "pdf",
      };
    }

    // PNG signature
    if (
      signature.length >= 8 &&
      signature[0] === 0x89 &&
      signature[1] === 0x50 &&
      signature[2] === 0x4e &&
      signature[3] === 0x47 &&
      signature[4] === 0x0d &&
      signature[5] === 0x0a &&
      signature[6] === 0x1a &&
      signature[7] === 0x0a
    ) {
      return {
        contentType: "image/png",
        extension: "png",
      };
    }

    // JPEG signature
    if (
      signature.length >= 3 &&
      signature[0] === 0xff &&
      signature[1] === 0xd8 &&
      signature[2] === 0xff
    ) {
      return {
        contentType: "image/jpeg",
        extension: "jpg",
      };
    }

    return null;
  }

  export async function POST(request: Request) {
    let uploadedPathname: string | null = null;

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

      // Read multipart form data.
      const formData = await request.formData();

      const email = String(formData.get("email") ?? "")
        .trim()
        .toLowerCase();

      const studentId = String(formData.get("studentId") ?? "").trim();
      if (!/^\d{4}-\d{6,10}$/.test(studentId)) {
          return NextResponse.json(
            { error: "Student ID must follow the format YYYY-XXXXXX (6–10 digits after the hyphen)." },
            { status: 400 }
          );
        }
      const programId = Number(formData.get("programId"));
      const yearLevel = Number(formData.get("yearLevel"));

      const corFile = formData.get("corFile");

      // Validate NU MOA email.
      if (!/^[a-zA-Z0-9._%+-]+@students\.nu-moa\.edu\.ph$/i.test(email)) {
        return NextResponse.json(
          { error: "Use your NU MOA student email address." },
          { status: 400 }
        );
      }

      // Validate registration details.
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

      // Require a COR document.
      if (!(corFile instanceof File)) {
        return NextResponse.json(
          { error: "Please upload your Certificate of Registration (COR)." },
          { status: 400 }
        );
      }

      if (corFile.size === 0) {
        return NextResponse.json(
          { error: "The uploaded COR file is empty." },
          { status: 400 }
        );
      }

      if (corFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Your COR file must not exceed 4 MB." },
          { status: 400 }
        );
      }

      // Validate the actual file format.
      const fileInfo = await validateCorFile(corFile);

      if (!fileInfo) {
        return NextResponse.json(
          { error: "Only valid PDF, JPG, and PNG files are accepted." },
          { status: 400 }
        );
      }

      // Check for existing registration.
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

      // Validate academic program.
      const program = await prisma.program.findUnique({
        where: { id: programId },
      });

      if (!program) {
        return NextResponse.json(
          { error: "Invalid academic program." },
          { status: 400 }
        );
      }

      // Upload COR to private Vercel Blob storage.
      const pathname = `cor/${randomUUID()}.${fileInfo.extension}`;

      const blob = await put(pathname, corFile, {
        access: "private",
        addRandomSuffix: true,
        contentType: fileInfo.contentType,
      });

      uploadedPathname = blob.pathname;

      // Create voter and COR metadata together.
      const voter = await prisma.$transaction(async (tx) => {
        const newVoter = await tx.voter.create({
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

        await tx.corDocument.create({
          data: {
            voterId: newVoter.id,
            blobUrl: blob.url,
            pathname: blob.pathname,
            originalFilename: corFile.name.slice(0, 255),
            contentType: fileInfo.contentType,
            size: corFile.size,
          },
        });

        return newVoter;
      });

      return NextResponse.json(
        {
          message: "Registration successful.",
          voter,
        },
        { status: 201 }
      );
    } catch (error) {
      // Remove uploaded COR if database registration fails.
      if (uploadedPathname) {
        try {
          await del(uploadedPathname);
        } catch (cleanupError) {
          console.error("COR cleanup error:", cleanupError);
        }
      }

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
