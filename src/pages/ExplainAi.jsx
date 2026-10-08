import { Link } from "react-router-dom";
import {
  Network,
  HeartPulse,
  Droplets,
  Thermometer,
  Info,
  BrainCircuit,
  ArrowLeft,
  Activity,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const features = [
  {
    id: 1,
    name: "Heart Rate",
    value: 35,
    icon: HeartPulse,
    barColor: "bg-[#DC2626]",
    fill: "#DC2626",
    description: "Elevated heart rate detected (>90 bpm)",
  },
  {
    id: 2,
    name: "Temperature",
    value: 20,
    icon: Thermometer,
    barColor: "bg-[#B45309]",
    fill: "#B45309",
    description: "Abnormal temperature detected",
  },
  {
    id: 3,
    name: "WBC Count",
    value: 15,
    icon: Activity,
    barColor: "bg-[#0F766E]",
    fill: "#0F766E",
    description: "Elevated WBC indicates infection",
  },
  {
    id: 4,
    name: "Blood Pressure",
    value: 10,
    icon: Activity,
    barColor: "bg-[#14B87A]",
    fill: "#14B87A",
    description: "Low arterial pressure detected",
  },
  {
    id: 5,
    name: "Oxygen",
    value: 10,
    icon: Droplets,
    barColor: "bg-[#15803D]",
    fill: "#15803D",
    description: "Oxygen saturation level is sub-optimal",
  },
  {
    id: 6,
    name: "Respiratory Rate",
    value: 5,
    icon: Activity,
    barColor: "bg-[#64748B]",
    fill: "#64748B",
    description: "Abnormal tachypnea breathing pattern",
  },
  {
    id: 7,
    name: "Glucose",
    value: 5,
    icon: Activity,
    barColor: "bg-[#94A3B8]",
    fill: "#94A3B8",
    description: "Glucose level elevation",
  },
];

const topFeature = features.reduce((highest, feature) => {
  if (!highest || feature.value > highest.value) {
    return feature;
  }
  return highest;
}, null);

export default function ExplainAi() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans transition-colors">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[#E2E8F0] dark:border-[#273449]">
          <div>
            <Link
              to="/"
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#14B87A] dark:text-[#35D39A] hover:text-[#0F9F69] mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center">
              <BrainCircuit className="w-7 h-7 text-[#14B87A] mr-2.5" />
              Explainable AI (XAI) Insight
            </h1>
            <p className="text-xs sm:text-sm text-[#526174] dark:text-[#94A3B8] mt-1 max-w-xl">
              Transparent biomarker breakdown illustrating which patient vitals drove the sepsis prediction.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="px-4 py-2 rounded-2xl bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] flex flex-col items-end shadow-xs">
              <span className="text-[10px] text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-widest font-bold">
                Benchmark Risk
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#DC2626] dark:text-[#F87171]">85%</span>
            </div>
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#172033] border border-[#A8E3CF] dark:border-[#14B87A]/30 shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-[#E8F8F2] dark:bg-[#14B87A]/20 rounded-xl text-[#0F9F69] dark:text-[#35D39A] shrink-0 border border-[#A8E3CF] dark:border-[#14B87A]/40">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#172033] dark:text-[#F8FAFC] mb-1">
                Clinical Finding Summary
              </h2>
              <p className="text-xs sm:text-sm text-[#526174] dark:text-[#CBD5E1] leading-relaxed">
                <strong className="text-[#DC2626] dark:text-[#F87171]">{topFeature?.name}</strong> is the principal driving factor for this prediction, accounting for{" "}
                <span className="font-bold text-[#172033] dark:text-[#F8FAFC]">{topFeature?.value}%</span> of the risk score calculation. Multi-parameter vital sign abnormalities collectively elevate the probability of systematic infection.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Factor Contribution List */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#526174] dark:text-[#94A3B8] flex items-center">
              <Network className="w-4 h-4 mr-2 text-[#14B87A]" /> Factor Contribution %
            </h3>

            <div className="flex flex-col gap-2.5">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isTopFactor = feature.id === topFeature?.id;

                return (
                  <div
                    key={feature.id}
                    className={`p-3.5 rounded-2xl transition-all duration-200 border ${
                      isTopFactor
                        ? "bg-[#FEF2F2]/40 dark:bg-[#2A1517]/30 border-[#F5B5B5] dark:border-[#4C1D24] shadow-xs"
                        : "bg-[#FFFFFF] dark:bg-[#172033] border-[#E2E8F0] dark:border-[#273449]"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
                            isTopFactor
                              ? "bg-[#FEF2F2] dark:bg-[#2A1517] text-[#DC2626] dark:text-[#F87171]"
                              : "bg-[#F1F5F9] dark:bg-[#1E293B] text-[#526174] dark:text-[#CBD5E1]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-[#172033] dark:text-[#F8FAFC] truncate">
                              {feature.name}
                            </h4>
                            {isTopFactor && (
                              <span className="rounded-full bg-[#FEF2F2] dark:bg-[#2A1517] text-[#DC2626] dark:text-[#F87171] border border-[#F5B5B5] dark:border-[#4C1D24] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0">
                                Top Driver
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#526174] dark:text-[#94A3B8] block truncate">
                            {feature.description}
                          </span>
                        </div>
                      </div>

                      <div className="text-base sm:text-lg font-bold font-mono text-[#172033] dark:text-[#F8FAFC] shrink-0 ml-2">
                        {feature.value}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#273449] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${feature.barColor}`}
                        style={{ width: `${feature.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Weights Donut Chart */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] flex flex-col items-center justify-center relative shadow-xs">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#526174] dark:text-[#94A3B8] mb-4 w-full text-center">
              Biomarker Weight Distribution
            </h3>

            <div className="w-full aspect-square max-h-72 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={features}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {features.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#172033" : "#FFFFFF",
                      border: isDark ? "1px solid #273449" : "1px solid #E2E8F0",
                      borderRadius: "12px",
                      color: isDark ? "#F8FAFC" : "#172033",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value}% Contribution`, ""]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: "15px",
                      fontSize: "11px",
                      color: isDark ? "#94A3B8" : "#526174",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-9">
                <span className="text-[10px] font-bold text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider">Total</span>
                <span className="text-xl sm:text-2xl font-black text-[#172033] dark:text-[#F8FAFC]">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
