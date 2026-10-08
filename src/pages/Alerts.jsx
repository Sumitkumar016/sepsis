import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Clock, Activity, ArrowRight, User, ArrowLeft, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getHighRiskPatients } from "../store/doctor";
import ThemeToggle from "../components/ThemeToggle";

export default function AlertPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { highRiskPatients } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(getHighRiskPatients());
  }, [dispatch]);

  const getSeverity = (prediction) => {
    if (prediction >= 85) return "critical";
    if (prediction >= 60) return "high";
    return "moderate";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] p-4 sm:p-6 lg:p-8 font-sans text-[#172033] dark:text-[#F8FAFC] transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0] dark:border-[#273449]">
          <div>
            <Link
              to="/"
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#14B87A] dark:text-[#35D39A] hover:text-[#0F9F69] mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center">
              <AlertCircle className="w-7 h-7 text-[#DC2626] mr-2.5 animate-pulse" />
              Active Clinical Alerts
            </h1>
            <p className="text-xs sm:text-sm text-[#526174] dark:text-[#94A3B8] mt-1">
              Real-time sepsis risk alert queue for intensive monitoring
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2 bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] px-3 py-1.5 rounded-xl shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B87A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#14B87A]"></span>
              </span>
              <span className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Live Updates</span>
            </div>
            <ThemeToggle size="sm" />
          </div>
        </div>

        <div className="space-y-4 flex flex-col items-stretch w-full">
          {highRiskPatients?.length > 0 ? (
            highRiskPatients.map((patient) => {
              const severity = getSeverity(Number(patient.prediction ?? 0));
              return (
                <div
                  key={patient.id}
                  onClick={() => navigate(`/patient/${patient.id}`)}
                  className={`relative overflow-hidden group transition-all duration-200 rounded-2xl p-4 sm:p-5 cursor-pointer bg-[#FFFFFF] dark:bg-[#172033] border shadow-xs hover:shadow-md ${
                    severity === "critical"
                      ? "border-[#F5B5B5] dark:border-[#4C1D24] bg-[#FEF2F2]/30 dark:bg-[#2A1517]/30"
                      : severity === "high"
                      ? "border-[#F5D08A] dark:border-[#523B19] bg-[#FFF7E6]/30 dark:bg-[#2A1F11]/30"
                      : "border-[#E2E8F0] dark:border-[#273449]"
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 w-full">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 relative">
                        {severity === "critical" && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#DC2626] rounded-full animate-ping"></span>
                        )}
                        <div
                          className={`flex items-center justify-center w-13 h-13 rounded-2xl border font-black text-lg ${
                            severity === "critical"
                              ? "border-[#F5B5B5] dark:border-[#4C1D24] bg-[#FEF2F2] dark:bg-[#2A1517] text-[#DC2626] dark:text-[#F87171]"
                              : severity === "high"
                              ? "border-[#F5D08A] dark:border-[#523B19] bg-[#FFF7E6] dark:bg-[#2A1F11] text-[#B45309] dark:text-[#FBBF24]"
                              : "border-[#BBE7C8] dark:border-[#1E432E] bg-[#ECFDF3] dark:bg-[#102419] text-[#15803D] dark:text-[#34D399]"
                          }`}
                        >
                          {Number(patient.prediction ?? 0)}%
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center">
                            <User className="w-4 h-4 mr-1 text-[#7A8798] dark:text-[#94A3B8]" />
                            {patient.patientName}
                          </h2>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                              severity === "critical"
                                ? "bg-[#FEF2F2] dark:bg-[#2A1517] text-[#DC2626] dark:text-[#F87171] border-[#F5B5B5] dark:border-[#4C1D24]"
                                : "bg-[#FFF7E6] dark:bg-[#2A1F11] text-[#B45309] dark:text-[#FBBF24] border-[#F5D08A] dark:border-[#523B19]"
                            }`}
                          >
                            {severity === "critical" ? "Critical Risk" : "High Risk"}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-[#526174] dark:text-[#94A3B8]">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Flagged from recent vital changes
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto md:max-w-md p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449] text-xs">
                      <div className="flex items-center text-[11px] font-bold text-[#526174] dark:text-[#94A3B8] mb-1 uppercase tracking-wider">
                        <Activity className="w-3.5 h-3.5 mr-1.5 text-[#14B87A]" />
                        Suggested Action
                      </div>
                      <p className="font-medium text-[#172033] dark:text-[#CBD5E1] leading-relaxed">
                        {Number(patient.prediction ?? 0) >= 85
                          ? "Immediate ICU transfer & start broad-spectrum antibiotics protocol."
                          : Number(patient.prediction ?? 0) >= 60
                          ? "Review lactic acid lab results and monitor vitals closely."
                          : "Standard monitoring protocol."}
                      </p>
                    </div>

                    <div className="hidden md:flex items-center text-[#7A8798] group-hover:text-[#14B87A] transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#273449] bg-[#FFFFFF] dark:bg-[#172033] p-10 text-center shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#ECFDF3] dark:bg-[#102419] text-[#15803D] dark:text-[#34D399] flex items-center justify-center mx-auto mb-3 border border-[#BBE7C8] dark:border-[#1E432E]">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">No Critical Sepsis Alerts</h3>
              <p className="text-xs text-[#526174] dark:text-[#94A3B8] max-w-sm mx-auto mt-1">
                All monitored patients in this ward currently register within acceptable physiological vital thresholds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
