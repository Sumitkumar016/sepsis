import React from "react";
import { Mail, Hash, Calendar, User, ShieldCheck } from "lucide-react";
import RiskBadge from "./RiskBadge";

export default function ProfileCard({ user }) {
  const avatarSrc =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "Patient"
    )}&background=14B87A&color=fff&size=128&bold=true`;

  return (
    <div className="w-full bg-white dark:bg-[#172033] rounded-2xl shadow-xs border border-[#E2E8F0] dark:border-[#273449] p-5 text-center relative transition-all duration-200">
      {/* Profile Image & Online Status */}
      <div className="relative inline-block mx-auto mb-1">
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-white dark:border-[#172033] shadow-sm bg-[#F8FAFC] dark:bg-[#1E293B] ring-2 ring-[#A8E3CF] dark:ring-[#14B87A]/30">
          <img
            src={avatarSrc}
            alt={user?.name || "Patient profile"}
            className="w-full h-full object-cover"
          />
        </div>
        <span
          className="absolute bottom-0 right-1 w-3.5 h-3.5 rounded-full bg-[#14B87A] border-2 border-white dark:border-[#172033] shadow-2xs"
          title="Active telemetry"
        />
      </div>

      {/* Name */}
      <h2 className="text-base sm:text-lg font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight truncate mt-2">
        {user?.name || "Patient"}
      </h2>

      {/* Role / Tag */}
      <div className="flex items-center justify-center gap-1.5 mt-1 mb-3">
        <span className="text-[10px] font-bold text-[#0F9F69] dark:text-[#35D39A] uppercase tracking-wider bg-[#E8F8F2] dark:bg-[#14B87A]/15 border border-[#A8E3CF] dark:border-[#14B87A]/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#14B87A] dark:text-[#35D39A]" />
          {user?.role || "Patient"} Record
        </span>
        {user?.riskLevel && (
          <RiskBadge level={user.riskLevel} size="xs" />
        )}
      </div>

      {/* Details List */}
      <div className="space-y-2 text-xs text-left">
        <div className="flex justify-between items-center bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449] px-3 py-2 rounded-xl">
          <span className="text-[10px] font-bold text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-[#64748B]" />
            Email
          </span>
          <span
            className="font-semibold text-[#172033] dark:text-[#F8FAFC] truncate max-w-[150px] sm:max-w-[170px]"
            title={user?.email || "N/A"}
          >
            {user?.email || "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449] px-3 py-2 rounded-xl">
          <span className="text-[10px] font-bold text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
            <Hash className="w-3 h-3 text-[#64748B]" />
            Patient ID
          </span>
          <span className="font-mono text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">
            #{user?.id ? user.id.substring(0, 8) : "N/A"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex justify-between items-center bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449] px-3 py-2 rounded-xl">
            <span className="text-[10px] font-bold text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#64748B]" />
              Age
            </span>
            <span className="font-semibold text-[#172033] dark:text-[#F8FAFC]">
              {user?.age ? `${user.age}y` : "--"}
            </span>
          </div>

          <div className="flex justify-between items-center bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449] px-3 py-2 rounded-xl">
            <span className="text-[10px] font-bold text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-1">
              <User className="w-3 h-3 text-[#64748B]" />
              Gender
            </span>
            <span className="font-semibold text-[#172033] dark:text-[#F8FAFC]">
              {user?.gender || "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}