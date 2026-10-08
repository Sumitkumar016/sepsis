import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { AlertTriangle, Activity, Thermometer, Droplets, HeartPulse, ArrowLeft, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedPatient, getPatient } from "../store/doctor";
import ThemeToggle from "../components/ThemeToggle";
import RiskBadge from "../components/RiskBadge";
import Button from "../components/Button";
import { useTheme } from "../context/ThemeContext";

const mockChartData = [
  { time: "00:00", risk: 12 },
  { time: "02:00", risk: 15 },
  { time: "04:00", risk: 18 },
  { time: "06:00", risk: 25 },
  { time: "08:00", risk: 45 },
  { time: "10:00", risk: 68 },
  { time: "12:00", risk: 85 },
];

export default function PatientDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isDark } = useTheme();

  const { selectedPatient, loading } = useSelector((state) => state.doctor);

  useEffect(() => {
    if (!id) return;
    dispatch(getPatient(id));
    return () => {
      dispatch(clearSelectedPatient());
    };
  }, [dispatch, id]);

  if (loading || !selectedPatient) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] flex items-center justify-center text-[#526174] dark:text-[#CBD5E1]">
        Loading patient data...
      </div>
    );
  }

  const patient = selectedPatient;
  const vitals = patient?.vitals || {};
  const isHigh = patient?.riskLevel === "High";
  const isMedium = patient?.riskLevel === "Medium";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[#E2E8F0] dark:border-[#273449]">
          <div>
            <Link
              to="/"
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#14B87A] dark:text-[#35D39A] hover:text-[#0F9F69] mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F8FAFC]">
              {patient.patientName}
            </h1>
            <p className="text-xs sm:text-sm text-[#526174] dark:text-[#94A3B8] mt-1">
              Age: {patient.age} | Gender: {patient.gender} | ID: #{patient.id ? patient.id.substring(0, 8) : "N/A"}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <RiskBadge level={patient?.riskLevel || "Low"} size="md" showDot />
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Risk Score Card */}
          <div className="bg-[#FFFFFF] dark:bg-[#172033] p-5 rounded-2xl shadow-xs border border-[#E2E8F0] dark:border-[#273449] flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#526174] dark:text-[#94A3B8]">
                Sepsis Risk Score
              </span>
              <ShieldAlert
                className={`w-4 h-4 ${
                  isHigh ? "text-[#DC2626]" : isMedium ? "text-[#B45309]" : "text-[#15803D]"
                }`}
              />
            </div>
            <div
              className={`text-4xl sm:text-5xl font-black tracking-tight my-1 ${
                isHigh
                  ? "text-[#DC2626] dark:text-[#F87171]"
                  : isMedium
                  ? "text-[#B45309] dark:text-[#FBBF24]"
                  : "text-[#15803D] dark:text-[#34D399]"
              }`}
            >
              {patient.prediction}
              <span className="text-2xl font-bold ml-0.5">%</span>
            </div>
            <div className="mt-2">
              <RiskBadge level={patient.riskLevel || "Assessment Pending"} size="sm" />
            </div>
          </div>

          {/* Vitals Card */}
          <div className="bg-[#FFFFFF] dark:bg-[#172033] p-5 rounded-2xl shadow-xs border border-[#E2E8F0] dark:border-[#273449] lg:col-span-2">
            <h2 className="text-xs sm:text-sm font-bold text-[#172033] dark:text-[#F8FAFC] mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-1.5 text-[#14B87A]" /> Current Vitals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
                <p className="text-xs text-[#526174] dark:text-[#94A3B8] font-medium flex items-center mb-1">
                  <HeartPulse className="w-3.5 h-3.5 mr-1 text-[#DC2626]" /> Heart Rate
                </p>
                <p className="text-xl sm:text-2xl font-bold text-[#172033] dark:text-[#F8FAFC]">
                  {vitals.heartRate || 0}
                  <span className="text-xs font-normal text-[#7A8798] dark:text-[#94A3B8] ml-1">bpm</span>
                </p>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
                <p className="text-xs text-[#526174] dark:text-[#94A3B8] font-medium flex items-center mb-1">
                  <Activity className="w-3.5 h-3.5 mr-1 text-[#14B87A]" /> Blood Pressure
                </p>
                <p className="text-xl sm:text-2xl font-bold text-[#172033] dark:text-[#F8FAFC]">
                  {vitals.bloodPressure || "0/0"}
                  <span className="text-xs font-normal text-[#7A8798] dark:text-[#94A3B8] ml-1">mmHg</span>
                </p>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
                <p className="text-xs text-[#526174] dark:text-[#94A3B8] font-medium flex items-center mb-1">
                  <Thermometer className="w-3.5 h-3.5 mr-1 text-[#B45309]" /> Temperature
                </p>
                <p className="text-xl sm:text-2xl font-bold text-[#172033] dark:text-[#F8FAFC]">
                  {vitals.temperature || 0}
                  <span className="text-xs font-normal text-[#7A8798] dark:text-[#94A3B8] ml-1">°C</span>
                </p>
              </div>
            </div>
          </div>

          {/* Lab Results Card */}
          <div className="bg-[#FFFFFF] dark:bg-[#172033] p-5 rounded-2xl shadow-xs border border-[#E2E8F0] dark:border-[#273449] lg:col-span-1 flex flex-col justify-between">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#172033] dark:text-[#F8FAFC] mb-3 flex items-center">
                <Droplets className="w-4 h-4 mr-1.5 text-[#14B87A]" /> Lab Results
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2.5 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
                  <span className="text-xs text-[#526174] dark:text-[#CBD5E1] font-semibold">WBC</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">{vitals.wbc || 0}</span>
                    <span className="text-[10px] text-[#7A8798] dark:text-[#94A3B8] ml-1">x10³/µL</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
                  <span className="text-xs text-[#526174] dark:text-[#CBD5E1] font-semibold">Oxygen (SpO2)</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">{vitals.oxygen || 0}</span>
                    <span className="text-[10px] text-[#7A8798] dark:text-[#94A3B8] ml-1">%</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full mt-4"
              onClick={() => navigate("/result", { state: patient })}
            >
              View Full Clinical Report
            </Button>
          </div>

          {/* Risk Timeline Chart */}
          <div className="bg-[#FFFFFF] dark:bg-[#172033] p-5 rounded-2xl shadow-xs border border-[#E2E8F0] dark:border-[#273449] lg:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs sm:text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">
                Risk Timeline (Last 12 Hours)
              </h2>
              <span className="text-[10px] text-[#526174] dark:text-[#94A3B8] bg-[#F1F5F9] dark:bg-[#1E293B] px-2 py-0.5 rounded-md">
                Telemetry record
              </span>
            </div>
            <div className="h-44 sm:h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData} margin={{ top: 10, right: 12, bottom: 0, left: -25 }}>
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
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 11 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: isDark ? "1px solid #273449" : "1px solid #E2E8F0",
                      backgroundColor: isDark ? "#172033" : "#FFFFFF",
                      color: isDark ? "#F8FAFC" : "#172033",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value}%`, "Risk Score"]}
                  />
                  <ReferenceLine
                    y={80}
                    stroke="#DC2626"
                    strokeDasharray="3 3"
                    label={{
                      position: "top",
                      value: "High Risk Threshold",
                      fill: "#DC2626",
                      fontSize: 10,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="#14B87A"
                    strokeWidth={2.5}
                    dot={{
                      r: 3.5,
                      fill: "#14B87A",
                      strokeWidth: 2,
                      stroke: isDark ? "#172033" : "#FFFFFF",
                    }}
                    activeDot={{ r: 5, strokeWidth: 0, fill: "#0F9F69" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
