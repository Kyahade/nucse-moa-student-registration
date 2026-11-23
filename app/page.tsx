
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

export default function RegistrationPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegeId, setCollegeId] = useState("");
  const [programId, setProgramId] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/academic-data")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setColleges(data.colleges ?? []))
      .catch(() => setError("Unable to load colleges and programs."));
  }, []);

  const selectedCollege = colleges.find(
    (college) => college.id === Number(collegeId)
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          studentId: studentId.trim(),
          programId,
          yearLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }

      setMessage("Registration successful!");
      setEmail("");
      setStudentId("");
      setCollegeId("");
      setProgramId("");
      setYearLevel("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#e9edf5] px-5 py-12">
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
              Register your student information to access the NU MOA Student Elections.
            </p>
          </div>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="h-1.5 w-16 rounded-full bg-[#d4b35c]" />
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#263b5d]">
                Student ID
              </label>
              <input
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter your student ID"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-800 outline-none transition focus:border-[#183b70] focus:ring-2 focus:ring-[#183b70]/15"
              />
            </div>

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
                    {year}{year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th"} Year
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

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
            <span className="text-[#b18d36]">BUMOTO NANG TAMA.</span>
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
    </main>
  );
}
