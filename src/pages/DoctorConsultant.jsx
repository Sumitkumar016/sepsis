import { ArrowLeft, BriefcaseMedical, MessageSquare, ShieldAlert, Stethoscope } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import ThemeToggle from "../components/ThemeToggle";

const buildAvatar = (name, from, to) => {
  const cleanedName = name.replace(/^Dr\.?\s*/i, "").trim();
  const initials = cleanedName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="card-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="40" fill="url(#card-bg)" />
      <circle cx="80" cy="58" r="24" fill="rgba(255,255,255,0.18)" />
      <path d="M40 130c4-22 22-36 40-36s36 14 40 36" fill="rgba(255,255,255,0.18)" />
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#ffffff">
        ${initials || "DR"}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const DOCTORS = [
  {
    id: 1,
    name: "Dr. Risham",
    experience: "10 years",
    avatar: buildAvatar("Dr. Risham", "#14B87A", "#0F9F69"),
  },
  {
    id: 2,
    name: "Dr. Suryanwanshi",
    experience: "7 years",
    avatar: buildAvatar("Dr. Suryanwanshi", "#14B87A", "#0F9F69"),
  },
  {
    id: 3,
    name: "Dr. Vaishnavi",
    experience: "12 years",
    avatar: buildAvatar("Dr. Verma", "#14B87A", "#0F9F69"),
  },
  {
    id: 4,
    name: "Dr. Priyanshu",
    experience: "5 years",
    avatar: buildAvatar("Dr. Priyanshu", "#14B87A", "#0F9F69"),
  },
  {
    id: 5,
    name: "Dr. Sumit",
    experience: "4 years",
    avatar: buildAvatar("Dr. Sumit", "#14B87A", "#0F9F69"),
  },
  {
    id: 6,
    name: "Dr. Ansh",
    experience: "3 years",
    avatar: buildAvatar("Dr. Ansh", "#14B87A", "#0F9F69"),
  },
];

export default function DoctorConsultant() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] px-4 py-6 sm:px-6 md:px-10 transition-colors">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        {/* Top bar with back link, title, and theme toggle */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center justify-between">
              <Link
                to="/userdashboard"
                className="mb-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#526174] hover:text-[#14B87A] dark:text-[#94A3B8] dark:hover:text-[#35D39A] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172033] dark:text-[#F8FAFC]">
              Doctor Consultant
            </h1>
            <p className="mt-1 max-w-2xl text-xs sm:text-sm text-[#526174] dark:text-[#94A3B8]">
              Connect with sepsis-focused specialists for fast guidance on symptoms, monitoring, and triage recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#273449] bg-white dark:bg-[#172033] px-4 py-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#E8F8F2] dark:bg-[#14B87A]/15 p-2 text-[#14B87A] dark:text-[#35D39A]">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8798] dark:text-[#94A3B8]">
                  Specialty
                </p>
                <p className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">
                  Sepsis Care
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#273449] bg-white dark:bg-[#172033] px-4 py-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#E8F8F2] dark:bg-[#14B87A]/15 p-2 text-[#14B87A] dark:text-[#35D39A]">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8798] dark:text-[#94A3B8]">
                  Mode
                </p>
                <p className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">
                  Instant Chat
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#273449] bg-white dark:bg-[#172033] px-4 py-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#E8F8F2] dark:bg-[#14B87A]/15 p-2 text-[#14B87A] dark:text-[#35D39A]">
                <BriefcaseMedical className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8798] dark:text-[#94A3B8]">
                  Availability
                </p>
                <p className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">
                  On-call Support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <section className="overflow-hidden rounded-2xl bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] shadow-xs">
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1.35fr_0.85fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F8F2] dark:bg-[#14B87A]/15 border border-[#A8E3CF] dark:border-[#14B87A]/30 px-3.5 py-1 text-xs font-bold text-[#0F9F69] dark:text-[#35D39A]">
                <Stethoscope className="h-3.5 w-3.5" />
                Sepsis-Only Consultant Network
              </div>
              <h2 className="mt-4 text-xl sm:text-2xl font-bold text-[#172033] dark:text-[#F8FAFC]">
                Choose a specialist and start a focused sepsis consultation.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#526174] dark:text-[#94A3B8]">
                Each consultant is configured for sepsis-related screening guidance, symptom discussion, and urgent-risk prompts.
              </p>
              <button
                type="button"
                onClick={() => navigate("/chat")}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#14B87A] hover:bg-[#0F9F69] active:bg-[#0c8255] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition duration-200 hover:shadow-sm cursor-pointer"
              >
                Start Quick Chat with AI Assistant
              </button>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#14B87A] to-[#0F9F69] p-5 sm:p-6 text-white shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#E8F8F2]">Sepsis Support</p>
                <h3 className="mt-2 text-lg sm:text-xl font-bold">Act early when symptoms escalate.</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#E8F8F2]/90">
                  Fever, infection, falling blood pressure, abnormal heart rate, and low oxygen can all require urgent clinical attention.
                </p>
              </div>
              <div className="mt-4 rounded-xl bg-white/15 p-3.5 backdrop-blur-xs">
                <p className="text-[11px] font-medium text-white/80">Recommended action</p>
                <p className="mt-0.5 text-xs font-semibold">Use chat for triage guidance, then seek immediate emergency care for severe symptoms.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Doctor Grid */}
        <section className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {DOCTORS.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onConsult={(selectedDoctor) => navigate("/chat", { state: selectedDoctor })}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
