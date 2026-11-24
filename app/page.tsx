
"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";

type Program = {
  id: number;
  name: string;
};

type College = {
  id: number;
  name: string;
  programs: Program[];
};

type RegistrationReceipt = {
  email: string;
  studentId: string;
  college: string;
  program: string;
  yearLevel: string;
  referenceNumber: string;
  registeredAt: string;
};

const MAX_COR_SIZE = 4 * 1024 * 1024;

export default function RegistrationPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegeId, setCollegeId] = useState("");
  const [programId, setProgramId] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [corFile, setCorFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [registrationStatusLoading, setRegistrationStatusLoading] =
    useState(true);
  const [registrationLocked, setRegistrationLocked] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState(
    "Student registration is currently closed. Please wait for an official announcement."
  );
  const [registrationStatusError, setRegistrationStatusError] =
    useState(false);

  const [receipt, setReceipt] = useState<RegistrationReceipt | null>(null);

  useEffect(() => {
    async function loadRegistrationStatus() {
      try {
        const statusResponse = await fetch("/api/registration-status");
        const statusData = await statusResponse.json();

        if (!statusResponse.ok) {
          throw new Error("Unable to verify registration status.");
        }

        setRegistrationLocked(statusData.isLocked ?? false);
        setRegistrationMessage(
          statusData.message ||
            "Student registration is currently closed. Please wait for an official announcement."
        );

        if (!statusData.isLocked) {
          const academicResponse = await fetch("/api/academic-data");

          if (!academicResponse.ok) {
            throw new Error("Unable to load colleges and programs.");
          }

          const academicData = await academicResponse.json();
          setColleges(academicData.colleges ?? []);
        }
      } catch {
        setRegistrationStatusError(true);
      } finally {
        setRegistrationStatusLoading(false);
      }
    }

    loadRegistrationStatus();
  }, []);

  const selectedCollege = colleges.find(
    (college) => college.id === Number(collegeId)
  );

  function handleCorFileChange(file: File | null) {
    setError("");

    if (!file) {
      setCorFile(null);
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["pdf", "jpg", "jpeg", "png"].includes(extension ?? "")) {
      setCorFile(null);
      setError("Only PDF, JPG, and PNG files are accepted.");
      return;
    }

    if (file.size === 0) {
      setCorFile(null);
      setError("The selected COR file is empty.");
      return;
    }

    if (file.size > MAX_COR_SIZE) {
      setCorFile(null);
      setError("Your COR file must not exceed 4 MB.");
      return;
    }

    setCorFile(file);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!corFile) {
      setError("Please upload your Certificate of Registration (COR).");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("email", email.trim().toLowerCase());
      formData.append("studentId", studentId.trim());
      formData.append("programId", programId);
      formData.append("yearLevel", yearLevel);
      formData.append("corFile", corFile);

      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }

      const selectedProgram = selectedCollege?.programs.find(
        (program) => program.id === Number(programId)
      );

      setReceipt({
        email: data.voter.email,
        studentId: data.voter.studentId,
        college: selectedCollege?.name ?? "N/A",
        program: selectedProgram?.name ?? "N/A",
        yearLevel: `${yearLevel}${
          yearLevel === "1"
            ? "st"
            : yearLevel === "2"
              ? "nd"
              : yearLevel === "3"
                ? "rd"
                : "th"
        } Year`,
        referenceNumber: `NUREG-${new Date().getFullYear()}-${String(
          data.voter.id
        ).padStart(5, "0")}`,
        registeredAt: new Date().toISOString(),
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBackToRegistration() {
    setReceipt(null);
    setEmail("");
    setStudentId("");
    setCollegeId("");
    setProgramId("");
    setYearLevel("");
    setCorFile(null);
    setError("");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#e9edf5] px-5 py-12">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(238,242,250,0.76), rgba(238,242,250,0.86)), url('/nu-moa-campus.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

      <div className="absolute -left-32 -top-40 h-80 w-[600px] -rotate-12 rounded-full border-[18px] border-[#d6b45d]/80" />

      <div className="absolute -bottom-48 -right-32 h-80 w-[650px] -rotate-12 rounded-full border-[18px] border-[#142b50]/90" />

      {/* Registration Receipt */}
      {receipt ? (
        <div className="relative z-10 w-full max-w-2xl print:max-w-none">
          <div className="overflow-hidden rounded-2xl border border-white bg-white shadow-2xl print:rounded-none print:shadow-none">
            {/* Receipt Header */}
            <div className="bg-[#142b50] px-8 py-10 text-center text-white print:bg-[#142b50]">
              <Image
                src="/nu-logo.svg"
                alt="National University Logo"
                width={110}
                height={110}
                className="mx-auto mb-4 h-24 w-24 object-contain"
              />

              <h1 className="text-xl font-extrabold tracking-widest">
                NATIONAL UNIVERSITY
              </h1>

              <p className="mt-1 text-xs tracking-[0.4em] text-[#d8b85a]">
                MALL OF ASIA
              </p>

              <div className="mt-7 inline-block rounded-full bg-green-100 px-5 py-2 text-xs font-bold text-green-800">
                REGISTRATION RECEIVED
              </div>

              <h2 className="mt-5 text-4xl font-extrabold">
                Thank You!
              </h2>

              <p className="mt-3 text-sm text-blue-100">
                Your registration has been successfully received.
              </p>
            </div>

            {/* Receipt Details */}
            <div className="p-7 sm:p-10">
              <div className="mb-6 flex items-center justify-between border-b border-[#d8b85a] pb-4">
                <h3 className="font-extrabold tracking-wider text-[#142b50]">
                  REGISTRATION RECEIPT
                </h3>

                <span className="text-xs font-semibold text-slate-400">
                  OFFICIAL COPY
                </span>
              </div>

              <div className="space-y-4">
                {[
                  ["Reference Number", receipt.referenceNumber],
                  ["Student Email", receipt.email],
                  ["Student ID", receipt.studentId],
                  ["College", receipt.college],
                  ["Program", receipt.program],
                  ["Year Level", receipt.yearLevel],
                  [
                    "Date Registered",
                    new Date(receipt.registeredAt).toLocaleString("en-PH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Manila",
                    }),
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-col justify-between gap-1 border-b border-dashed border-slate-200 pb-3 sm:flex-row"
                  >
                    <span className="text-sm text-slate-500">
                      {label}
                    </span>

                    <span className="break-words text-sm font-bold text-[#142b50] sm:text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Receipt Reminder */}
              <div className="mt-7 rounded-xl bg-[#f4f6fa] p-5 text-center">
                <p className="font-bold text-[#142b50]">
                  Keep this receipt for your reference.
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Registration confirmation does not yet mean your student
                  identity or voting eligibility has been verified.
                </p>
              </div>

              {/* Facebook Section */}
              <div className="mt-7 rounded-xl bg-[#142b50] p-6 text-center text-white print:bg-[#142b50]">
                <h3 className="text-lg font-bold">
                  Stay Updated!
                </h3>

                <p className="mt-2 text-sm text-blue-100">
                  Follow the official CSE Facebook page for student election
                  announcements and updates.
                </p>

                <a
                  href="https://www.facebook.com/numoacse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-lg bg-[#d8b85a] px-5 py-3 text-xs font-extrabold text-[#142b50] print:hidden"
                >
                  VISIT CSE FACEBOOK PAGE →
                </a>

                <p className="mt-6 text-xs font-bold tracking-widest text-[#d8b85a]">
                  BUMOTO NG TAMA. BUMOTO NANG TAMA.
                </p>
              </div>

              {/* Receipt Buttons */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 rounded-xl bg-[#142b50] px-5 py-4 font-bold text-white transition hover:bg-[#1d416f]"
                >
                  Print Receipt
                </button>

                <button
                  type="button"
                  onClick={handleBackToRegistration}
                  className="flex-1 rounded-xl border border-[#142b50] px-5 py-4 font-bold text-[#142b50] transition hover:bg-slate-50"
                >
                  Back to Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : registrationStatusLoading ? (
        <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-2xl">
          <h2 className="text-xl font-bold text-[#142b50]">
            Checking Registration Status...
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Please wait while we verify registration availability.
          </p>
        </div>
      ) : registrationStatusError ? (
        <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-2xl">
          <h2 className="text-xl font-bold text-red-700">
            Registration Status Unavailable
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            We cannot verify whether registration is open right now. Please
            try again later.
          </p>
        </div>
      ) : registrationLocked ? (
        <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-2xl">
          <Image
            src="/nu-logo.svg"
            alt="National University logo"
            width={120}
            height={120}
            className="mx-auto mb-5 h-28 w-28 object-contain"
          />

          <h2 className="text-2xl font-extrabold text-[#142b50]">
            Registration Closed
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            {registrationMessage}
          </p>

          <p className="mt-8 text-xs font-bold tracking-widest text-[#b18d36]">
            NATIONAL UNIVERSITY – MALL OF ASIA
          </p>
        </div>
      ) : (
        /* Registration Form */
        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <Image
                src="/nu-logo.svg"
                alt="National University logo"
                width={250}
                height={250}
                priority
                className="h-[180px] w-[180px] object-contain sm:h-[220px] sm:w-[220px]"
              />
            </div>

            <h1 className="text-xl font-extrabold tracking-[0.12em] text-[#142b50] sm:text-2xl">
              NATIONAL UNIVERSITY
            </h1>

            <p className="mt-1 text-xs font-semibold tracking-[0.55em] text-[#52617b]">
              MALL OF ASIA
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/90 p-7 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b18d36]">
                Student Election Portal
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#142b50]">
                Student Registration
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Register your student information to access the NU MOA Student
                Elections.
              </p>
            </div>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <div className="h-1.5 w-16 rounded-full bg-[#d4b35c]" />
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Student Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#263b5d]">
                  NU Student Email
                </label>

                <input
                  type="email"
                  required
                  pattern="^[a-zA-Z0-9._%+-]+@students\.nu-moa\.edu\.ph$"
                  title="Please use your NU MOA student email address."
                  placeholder="yourname@students.nu-moa.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-800 outline-none transition focus:border-[#183b70] focus:ring-2 focus:ring-[#183b70]/15"
                />
              </div>

              {/* Student ID */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#263b5d]">
                  Student ID
                </label>

                <input
                  required
                  value={studentId}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 14);
                    const formatted =
                      digits.length > 4
                        ? `${digits.slice(0, 4)}-${digits.slice(4)}`
                        : digits;

                    setStudentId(formatted);
                  }}
                  placeholder="2023-123456"
                  maxLength={15}
                  pattern="[0-9]{4}-[0-9]{6,10}"
                  title="Format: YYYY-XXXXXX (6–10 digits after the hyphen)"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-800 outline-none transition focus:border-[#183b70] focus:ring-2 focus:ring-[#183b70]/15"
                />
              </div>

              {/* College */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#263b5d]">
                  College
                </label>

                <select
                  required
                  value={collegeId}
                  onChange={(e) => {
                    setCollegeId(e.target.value);
                    setProgramId("");
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-700 outline-none focus:border-[#183b70] focus:ring-2 focus:ring-[#183b70]/15"
                >
                  <option value="">Select your college</option>

                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Program */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#263b5d]">
                  Program
                </label>

                <select
                  required
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  disabled={!selectedCollege}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-700 outline-none focus:border-[#183b70] focus:ring-2 focus:ring-[#183b70]/15 disabled:bg-slate-100"
                >
                  <option value="">Select your program</option>

                  {selectedCollege?.programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Level */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#263b5d]">
                  Year Level
                </label>

                <select
                  required
                  value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-700 outline-none focus:border-[#183b70] focus:ring-2 focus:ring-[#183b70]/15"
                >
                  <option value="">Select year level</option>

                  {[1, 2, 3, 4, 5, 6].map((year) => (
                    <option key={year} value={year}>
                      {year}
                      {year === 1
                        ? "st"
                        : year === 2
                          ? "nd"
                          : year === 3
                            ? "rd"
                            : "th"}{" "}
                      Year
                    </option>
                  ))}
                </select>
              </div>

              {/* COR Upload */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#263b5d]">
                  Certificate of Registration (COR)
                  <span className="ml-1 text-red-600">*</span>
                </label>

                <p className="mb-3 text-xs leading-5 text-slate-500">
                  Upload a clear copy of your current Certificate of
                  Registration. Accepted formats: PDF, JPG, and PNG. Maximum
                  file size: 4 MB.
                </p>

                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={(e) =>
                    handleCorFileChange(e.target.files?.[0] ?? null)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#142b50] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-[#1d416f]"
                />

                {corFile && (
                  <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <p className="break-all text-sm font-semibold text-green-800">
                      {corFile.name}
                    </p>

                    <p className="mt-1 text-xs text-green-700">
                      {(corFile.size / (1024 * 1024)).toFixed(2)} MB · Ready
                      to upload
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setCorFile(null);
                        setError("");
                        const fileInput = document.getElementById(
                          "corFile"
                        ) as HTMLInputElement | null;

                        if (fileInput) {
                          fileInput.value = "";
                        }
                      }}
                      className="mt-2 text-xs font-bold text-red-600 hover:underline"
                    >
                      Remove file
                    </button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || colleges.length === 0}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#142b50] px-5 py-4 font-bold text-white shadow-md transition hover:bg-[#1d416f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
                {!loading && <span className="text-xl">→</span>}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
              Registration is restricted to NU MOA student email addresses.
            </p>
          </div>

          <div className="mt-9 flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-[#142b50]/30" />

            <p className="whitespace-nowrap text-xs font-bold tracking-[0.22em] text-[#142b50]">
              BUMUTO NG TAMA.{" "}
              <span className="text-[#b18d36]">
                BUMOTO NANG TAMA.
              </span>
            </p>

            <div className="h-px flex-1 bg-[#142b50]/30" />
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            National University – Mall of Asia
          </p>

          <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-widest text-amber-700">
            Local demonstration mode — registration testing
          </p>
        </div>
      )}
    </main>
  );
}
