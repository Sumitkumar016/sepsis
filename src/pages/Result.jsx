import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  Activity,
  Thermometer,
  Wind,
  ArrowUp,
  ArrowDown,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const mockChartData = [
  { time: "10:00", heartRate: 85, temp: 37.2 },
  { time: "11:00", heartRate: 90, temp: 37.5 },
  { time: "12:00", heartRate: 98, temp: 37.8 },
  { time: "13:00", heartRate: 105, temp: 38.2 },
  { time: "14:00", heartRate: 115, temp: 38.9 },
  { time: "15:00", heartRate: 128, temp: 39.5 },
];

const SkeletonLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-5xl mx-auto space-y-6"
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
      <div className="w-40 h-6 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="h-56 bg-slate-200/80 dark:bg-slate-800/50 rounded-2xl animate-pulse md:col-span-1"></div>
      <div className="h-56 bg-slate-200/80 dark:bg-slate-800/50 rounded-2xl animate-pulse md:col-span-2"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="h-64 bg-slate-200/80 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>
      <div className="h-64 bg-slate-200/80 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>
    </div>
  </motion.div>
);

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const patient = location.state;
  const factors = [
    {
      name: "Heart Rate",
      value: `${patient?.vitals?.heartRate || 0} bpm`,
      icon: Activity,
      status: (patient?.vitals?.heartRate || 0) > 100 ? "critical" : "normal",
      trend: (patient?.vitals?.heartRate || 0) > 100 ? "up" : "down",
      description: "Tachycardia telemetry analysis",
    },
    {
      name: "Temperature",
      value: `${patient?.vitals?.temperature || 0} °C`,
      icon: Thermometer,
      status: (patient?.vitals?.temperature || 0) > 38 ? "high" : "normal",
      trend: (patient?.vitals?.temperature || 0) > 38 ? "up" : "down",
      description: "Febrile state observation",
    },
    {
      name: "Oxygen Level",
      value: `${patient?.vitals?.oxygen || 0}%`,
      icon: Wind,
      status: (patient?.vitals?.oxygen || 0) < 95 ? "low" : "normal",
      trend: (patient?.vitals?.oxygen || 0) < 95 ? "down" : "up",
      description: "SpO2 saturation telemetry",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans transition-colors">
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <SkeletonLoader key="skeleton" />
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full space-y-6 sm:space-y-8"
            >
              {/* Header */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E2E8F0] dark:border-[#273449] pb-4"
              >
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center text-[#526174] hover:text-[#172033] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <div className="p-1.5 bg-[#FFFFFF] dark:bg-[#172033] rounded-xl mr-2.5 border border-[#E2E8F0] dark:border-[#273449] shadow-xs">
                    <ArrowLeft className="w-4 h-4 text-[#14B87A]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">
                    Back to Patient Details
                  </span>
                </button>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="flex items-center bg-[#E8F8F2] dark:bg-[#14B87A]/20 border border-[#A8E3CF] dark:border-[#14B87A]/40 px-3 py-1 rounded-full">
                    <Cpu className="w-3.5 h-3.5 text-[#14B87A] mr-1.5" />
                    <span className="text-xs font-bold text-[#0F9F69] dark:text-[#35D39A] tracking-wider uppercase">
                      AI Diagnostic Result
                    </span>
                  </div>
                  <ThemeToggle size="sm" />
                </div>
              </motion.div>

              {/* Top Row: Probability & Suggested Action */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Main Risk Score Card */}
                <motion.div variants={itemVariants} className="md:col-span-1">
                  <div className="h-full bg-[#FFFFFF] dark:bg-[#172033] border border-[#F5B5B5] dark:border-[#4C1D24] rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-xs">
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#FEF2F2] dark:bg-[#2A1517] text-[#DC2626] dark:text-[#F87171] font-bold text-xs tracking-wider uppercase mb-3 border border-[#F5B5B5] dark:border-[#4C1D24]">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                      {patient?.riskLevel || "High"} Risk
                    </div>

                    <div className="py-2">
                      <span className="text-5xl sm:text-6xl font-black text-[#DC2626] dark:text-[#F87171] tracking-tight">
                        {patient?.prediction || 0}
                        <span className="text-2xl text-[#7A8798] dark:text-[#94A3B8] ml-1">%</span>
                      </span>
                    </div>

                    <h2 className="text-xs sm:text-sm font-semibold text-[#526174] dark:text-[#94A3B8] tracking-wide mt-1">
                      Sepsis Risk Probability
                    </h2>
                  </div>
                </motion.div>

                {/* Right Side: Action & Details */}
                <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col gap-4">
                  {/* Action Banner */}
                  <div className="bg-[#DC2626] rounded-2xl p-5 text-white shadow-xs flex items-start gap-3.5">
                    <div className="p-2.5 bg-white/20 rounded-xl mt-0.5 shrink-0">
                      <ShieldAlert className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white/80 text-[11px] font-bold uppercase tracking-widest">
                        Clinical Recommendation
                      </h3>
                      <p className="text-lg sm:text-xl font-bold text-white mt-0.5 leading-snug">
                        Immediate ICU Monitoring Recommended
                      </p>
                      <p className="text-white/90 text-xs mt-1 leading-relaxed">
                        Initiate broad-spectrum antibiotic protocol and verify lactic acid laboratory panels.
                      </p>
                    </div>
                  </div>

                  {/* Secondary Stats */}
                  <div className="grid grid-cols-2 gap-3.5 flex-1">
                    <div className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl p-4 flex flex-col justify-center shadow-xs">
                      <div className="flex items-center text-[#7A8798] dark:text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-1">
                        <Cpu className="w-3.5 h-3.5 mr-1 text-[#14B87A]" />
                        Confidence Score
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-[#0F9F69] dark:text-[#35D39A]">
                        92<span className="text-base text-[#7A8798] ml-0.5">%</span>
                      </div>
                      <p className="text-[11px] text-[#526174] dark:text-[#94A3B8] mt-1">
                        Model evaluation across multi-vital parameters
                      </p>
                    </div>

                    <div className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl p-4 flex flex-col justify-center shadow-xs">
                      <div className="flex items-center text-[#7A8798] dark:text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-1">
                        <Activity className="w-3.5 h-3.5 mr-1 text-[#B45309]" />
                        Progression Trend
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-[#B45309] dark:text-[#FBBF24] flex items-center">
                        Rapid <ArrowUp className="w-5 h-5 ml-1" />
                      </div>
                      <p className="text-[11px] text-[#526174] dark:text-[#94A3B8] mt-1">
                        Recent escalation in temperature & heart rate
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Row: Contributing Factors & Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Contributing Factors */}
                <motion.div
                  variants={itemVariants}
                  className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl p-5 shadow-xs"
                >
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#172033] dark:text-[#F8FAFC] mb-4">
                    Key Contributing Biomarkers
                  </h3>

                  <div className="space-y-3">
                    {factors.map((factor, index) => {
                      const Icon = factor.icon;
                      const isCritical = factor.status === "critical";

                      return (
                        <div
                          key={index}
                          className={`flex items-center p-3 rounded-xl border transition-colors ${
                            isCritical
                              ? "bg-[#FEF2F2]/50 dark:bg-[#2A1517]/30 border-[#F5B5B5] dark:border-[#4C1D24]"
                              : "bg-[#F8FAFC] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#273449]"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg mr-3 shrink-0 ${
                              isCritical
                                ? "bg-[#FEF2F2] dark:bg-[#2A1517] text-[#DC2626] dark:text-[#F87171]"
                                : "bg-[#F1F5F9] dark:bg-[#273449] text-[#526174] dark:text-[#CBD5E1]"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-[#172033] dark:text-[#F8FAFC] truncate">
                              {factor.name}
                            </h4>
                            <p className="text-[11px] text-[#526174] dark:text-[#94A3B8] truncate">
                              {factor.description}
                            </p>
                          </div>

                          <div className="text-right pl-2">
                            <span
                              className={`text-xs sm:text-sm font-bold flex items-center justify-end ${
                                isCritical
                                  ? "text-[#DC2626] dark:text-[#F87171]"
                                  : factor.status === "high"
                                  ? "text-[#B45309] dark:text-[#FBBF24]"
                                  : "text-[#14B87A] dark:text-[#35D39A]"
                              }`}
                            >
                              {factor.value}
                              {factor.trend === "up" ? (
                                <ArrowUp className="w-3.5 h-3.5 ml-0.5" />
                              ) : (
                                <ArrowDown className="w-3.5 h-3.5 ml-0.5" />
                              )}
                            </span>
                            {isCritical && (
                              <span className="text-[10px] font-bold text-[#DC2626] dark:text-[#F87171] uppercase tracking-wider block">
                                Primary Driver
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Vitals Trend Chart */}
                <motion.div
                  variants={itemVariants}
                  className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#172033] dark:text-[#F8FAFC]">
                      Vitals Trend (Last 6 Hours)
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-[#526174] dark:text-[#94A3B8]">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-[#DC2626] mr-1.5" /> HR
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-[#B45309] mr-1.5" /> Temp
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-48 sm:h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#DC2626" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#B45309" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#B45309" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke={isDark ? "#273449" : "#E2E8F0"}
                        />
                        <XAxis
                          dataKey="time"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 11 }}
                          dy={8}
                        />
                        <YAxis
                          yAxisId="left"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 11 }}
                          domain={[60, 140]}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 11 }}
                          domain={[36, 40]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#172033" : "#FFFFFF",
                            border: isDark ? "1px solid #273449" : "1px solid #E2E8F0",
                            borderRadius: "10px",
                            color: isDark ? "#F8FAFC" : "#172033",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="heartRate"
                          stroke="#DC2626"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorHr)"
                        />
                        <Area
                          yAxisId="right"
                          type="monotone"
                          dataKey="temp"
                          stroke="#B45309"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorTemp)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
