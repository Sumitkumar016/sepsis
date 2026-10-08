import React from "react";
import { BriefcaseMedical, Stethoscope } from "lucide-react";
import Button from "./Button";

const buildInitialsAvatar = (name, from = "#14B87A", to = "#0F9F69") => {
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
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="40" fill="url(#bg)" />
      <circle cx="80" cy="60" r="26" fill="rgba(255,255,255,0.2)" />
      <path d="M38 132c5-24 24-38 42-38s37 14 42 38" fill="rgba(255,255,255,0.2)" />
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#ffffff">
        ${initials || "DR"}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default function DoctorCard({ doctor, onConsult }) {
  const avatar = doctor.avatar || buildInitialsAvatar(doctor.name);

  return (
    <article className="rounded-2xl border border-[#E2E8F0] dark:border-[#273449] bg-white dark:bg-[#172033] p-5 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex items-center gap-3.5">
        <img
          src={avatar}
          alt={doctor.name}
          className="h-13 w-13 rounded-2xl object-cover ring-2 ring-[#A8E3CF] dark:ring-[#14B87A]/30"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-bold text-[#172033] dark:text-[#F8FAFC] truncate">
            {doctor.name}
          </h3>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#E8F8F2] dark:bg-[#14B87A]/15 border border-[#A8E3CF] dark:border-[#14B87A]/30 px-2.5 py-0.5 text-[11px] font-semibold text-[#0F9F69] dark:text-[#35D39A]">
            <Stethoscope className="h-3 w-3" />
            <span>Sepsis Consultant</span>
          </div>
        </div>
      </div>

      <div className="mt-3.5 flex items-center gap-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449] px-3 py-2 text-[#526174] dark:text-[#CBD5E1]">
        <BriefcaseMedical className="h-4 w-4 text-[#14B87A] dark:text-[#35D39A] shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A8798] dark:text-[#94A3B8]">
            Clinical Practice
          </p>
          <p className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC]">
            {doctor.experience}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => onConsult(doctor)}
        >
          Consult Specialist
        </Button>
      </div>
    </article>
  );
}
