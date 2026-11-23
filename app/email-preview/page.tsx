
import { createRegistrationEmail } from "@/lib/registration-email";

export default function EmailPreviewPage() {
  const email = createRegistrationEmail({
    studentEmail: "student@students.nu-moa.edu.ph",
    referenceNumber: "NUREG-2026-00001",
    registeredAt: new Date("2026-11-23T00:00:00.000Z"),
    appUrl: "http://localhost:3000",
  });

  return (
    <main className="min-h-screen bg-[#F4F6FA] p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[#142B50]">
            Registration Email Preview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sample NU MOA registration confirmation email.
          </p>
        </div>

        <div className="mb-4 rounded-lg border bg-white p-4">
          <p className="text-sm text-slate-500">Subject</p>
          <p className="font-semibold text-slate-800">
            {email.subject}
          </p>
        </div>

        <iframe
          title="Registration email preview"
          srcDoc={email.html}
          className="min-h-[1000px] w-full rounded-xl border bg-white shadow-lg"
        />
      </div>
    </main>
  );
}
