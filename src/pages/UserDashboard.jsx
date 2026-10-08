import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  LayoutDashboard,
  BrainCircuit,
  Info,
  ArrowLeft,
  Droplets,
  ScanLine,
  HeartPulse,
  Thermometer,
  BriefcaseMedical,
  Bot,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";
import ProfileCard from "../components/UserCard";
import RiskBadge from "../components/RiskBadge";
import Button from "../components/Button";
import Logout from "./Logout";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { selectUser } from "../store/user";

const MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/userdashboard" },
  { name: "Check Self", icon: ScanLine, path: "/add-patient" },
  { name: "Doctor Consultant", icon: BriefcaseMedical, path: "/doctor-consultant" },
  { name: "Explain AI", icon: BrainCircuit, path: "/explain-ai" },
  { name: "About", icon: Info, path: "/about" },
];

export default function UserDashboard() {
  const user = useSelector((state) => selectUser(state) || state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const chartData = useMemo(() => {
    const prediction = Number(user?.prediction ?? 0);
    const points = [
      Math.max(prediction - 25, 0),
      Math.max(prediction - 15, 0),
      Math.max(prediction - 5, 0),
      prediction,
    ];

    return ["6h", "4h", "2h", "Now"].map((label, index) => ({
      time: label,
      risk: points[index],
    }));
  }, [user?.prediction]);

  const riskLevel = user?.riskLevel || "Low";
  const riskTone =
    riskLevel === "High" ? "red" : riskLevel === "Medium" ? "amber" : "emerald";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] flex transition-colors duration-200">
      {/* Floating AI Chat Bot Button */}
      <button
        type="button"
        onClick={() => navigate("/chat")}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-30 flex h-12 w-12 sm:h-13 sm:w-13 cursor-pointer items-center justify-center rounded-2xl bg-[#14B87A] hover:bg-[#0F9F69] active:bg-[#0c8255] text-white shadow-lg shadow-[#14B87A]/25 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#14B87A]"
        aria-label="Open Sepsis AI Assistant Chat"
        title="Open Sepsis AI Assistant Chat"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-64 border-r border-[#E2E8F0] dark:border-[#273449] bg-[#F8FAFC] dark:bg-[#0B1220] shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-5 border-b border-[#E2E8F0] dark:border-[#273449] flex items-center justify-between">
          <Link to="/userdashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#14B87A] flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight block">
                SepsisAI
              </span>
              <span className="text-[10px] font-semibold text-[#14B87A] dark:text-[#35D39A] uppercase tracking-widest block">
                Patient Portal
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider">
            Navigation
          </div>
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#E8F8F2] dark:bg-[#14B87A]/15 text-[#0F9F69] dark:text-[#35D39A] border border-[#A8E3CF] dark:border-[#14B87A]/30 shadow-xs"
                    : "text-[#475569] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#111827]"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#14B87A] dark:text-[#35D39A]" : ""}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#E2E8F0] dark:border-[#273449] space-y-2">
          <div className="flex items-center justify-between px-2 py-1 bg-white dark:bg-[#172033] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
            <span className="text-xs font-medium text-[#526174] dark:text-[#CBD5E1]">Theme</span>
            <ThemeToggle size="sm" />
          </div>
          <Logout />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0B1220]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-[#172033] border-r border-[#E2E8F0] dark:border-[#273449] p-5 shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#273449]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#14B87A] flex items-center justify-center">
                  <BrainCircuit className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight block">
                    SepsisAI
                  </span>
                  <span className="text-[10px] font-semibold text-[#14B87A] dark:text-[#35D39A] uppercase tracking-widest block">
                    Patient Portal
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#526174] hover:text-[#172033] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] focus:outline-none"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-bold text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider">
                Menu
              </div>
              {MENU_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-[#E8F8F2] dark:bg-[#14B87A]/15 text-[#0F9F69] dark:text-[#35D39A] border border-[#A8E3CF] dark:border-[#14B87A]/30"
                        : "text-[#475569] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#111827]"
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#14B87A] dark:text-[#35D39A]" : ""}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#273449] space-y-3">
              <div className="flex items-center justify-between px-3 py-2 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
                <span className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC]">Appearance</span>
                <ThemeToggle size="sm" />
              </div>
              <Logout />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-14 sm:h-16 border-b border-[#E2E8F0] dark:border-[#273449] bg-white/90 dark:bg-[#172033]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Left: Mobile hamburger & breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#526174] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] focus:outline-none"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="lg:hidden w-7 h-7 rounded-lg bg-[#14B87A] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm sm:text-base text-[#172033] dark:text-[#F8FAFC] truncate">
                Dashboard
              </span>
            </div>
          </div>

          {/* Right: Theme Toggle & Quick Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/add-patient"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#E8F8F2] hover:bg-[#A8E3CF]/40 dark:bg-[#14B87A]/15 text-[#0F9F69] dark:text-[#35D39A] border border-[#A8E3CF] dark:border-[#14B87A]/30 transition-colors"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Check Vitals</span>
            </Link>
            <ThemeToggle size="sm" />
          </div>
        </header>

        {/* Dashboard Main View */}
        <main className="p-4 sm:p-5 lg:p-6 space-y-5 max-w-7xl w-full mx-auto">
          {/* Patient Overview Title & Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[#E2E8F0] dark:border-[#273449]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#526174] dark:text-[#94A3B8] mb-0.5">
                <Link
                  to="/add-patient"
                  className="inline-flex items-center hover:text-[#14B87A] dark:hover:text-[#35D39A] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Re-check latest vitals
                </Link>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
                {user?.name || "Patient Record"}
              </h1>
            </div>

            <div className="self-start sm:self-auto">
              <RiskBadge level={user?.riskLevel || "Assessment Pending"} size="md" showDot />
            </div>
          </div>

          {/* Responsive Layout Grid: 8 Cols Main Content + 4 Cols Profile Card on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left & Center Analytics Column */}
            <div className="lg:col-span-8 space-y-5">
              {/* Top Row: Risk Score + Current Vitals */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Sepsis Risk Score Card */}
                <div className="sm:col-span-5 bg-white dark:bg-[#172033] p-4 sm:p-5 rounded-2xl shadow-xs border border-[#E2E8F0] dark:border-[#273449] flex flex-col justify-between text-center transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A8798] dark:text-[#94A3B8]">
                      Sepsis Risk Score
                    </span>
                    <ShieldAlert
                      className={`w-4 h-4 ${
                        riskTone === "red"
                          ? "text-[#DC2626]"
                          : riskTone === "amber"
                          ? "text-[#B45309]"
                          : "text-[#15803D]"
                      }`}
                    />
                  </div>

                  <div className="py-2">
                    <div
                      className={`text-4xl sm:text-5xl font-black tracking-tight ${
                        riskTone === "red"
                          ? "text-[#DC2626] dark:text-[#F87171]"
                          : riskTone === "amber"
                          ? "text-[#B45309] dark:text-[#FBBF24]"
                          : "text-[#15803D] dark:text-[#34D399]"
                      }`}
                    >
                      {Number(user?.prediction ?? 0)}
                      <span className="text-xl sm:text-2xl font-bold ml-0.5">%</span>
                    </div>
                  </div>

                  <div className="mt-1 flex justify-center">
                    <RiskBadge
                      level={user?.riskLevel || "Low"}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Current Vitals Card */}
                <div className="sm:col-span-7 bg-white dark:bg-[#172033] p-4 sm:p-5 rounded-2xl shadow-xs border border-[#E2E8F0] dark:border-[#273449] flex flex-col justify-between transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs sm:text-sm font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center">
                      <Activity className="w-4 h-4 mr-1.5 text-[#14B87A]" /> Current Vitals
                    </h2>
                    <span className="text-[10px] font-semibold text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider">
                      Live Telemetry
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Heart Rate */}
                    <div className="p-3 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
                      <p className="text-[11px] text-[#526174] dark:text-[#CBD5E1] font-medium flex items-center mb-1">
                        <HeartPulse className="w-3.5 h-3.5 mr-1 text-[#DC2626] shrink-0" />
                        <span className="truncate">Heart Rate</span>
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-[#172033] dark:text-[#F8FAFC]">
                        {user?.vitals?.heartRate || 0}
                        <span className="text-xs font-normal text-[#7A8798] dark:text-[#94A3B8] ml-1">bpm</span>
                      </p>
                    </div>

                    {/* Blood Pressure */}
                    <div className="p-3 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
                      <p className="text-[11px] text-[#526174] dark:text-[#CBD5E1] font-medium flex items-center mb-1">
                        <Activity className="w-3.5 h-3.5 mr-1 text-[#64748B] dark:text-[#94A3B8] shrink-0" />
                        <span className="truncate">Blood Press.</span>
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-[#172033] dark:text-[#F8FAFC] truncate">
                        {user?.vitals?.bloodPressure || "0/0"}
                        <span className="text-[10px] font-normal text-[#7A8798] dark:text-[#94A3B8] ml-1">mmHg</span>
                      </p>
                    </div>

                    {/* Temperature */}
                    <div className="p-3 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
                      <p className="text-[11px] text-[#526174] dark:text-[#CBD5E1] font-medium flex items-center mb-1">
                        <Thermometer className="w-3.5 h-3.5 mr-1 text-[#B45309] shrink-0" />
                        <span className="truncate">Temp</span>
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-[#172033] dark:text-[#F8FAFC]">
                        {user?.vitals?.temperature || 0}
                        <span className="text-xs font-normal text-[#7A8798] dark:text-[#94A3B8] ml-1">°C</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Lab Results + Risk Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Lab Results Card */}
                <div className="sm:col-span-4 bg-white dark:bg-[#172033] p-4 sm:p-5 rounded-2xl shadow-xs border border-[#E2E8F0] dark:border-[#273449] flex flex-col justify-between transition-colors">
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-[#172033] dark:text-[#F8FAFC] mb-3 flex items-center">
                      <Droplets className="w-4 h-4 mr-1.5 text-[#14B87A]" /> Lab Results
                    </h2>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2.5 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
                        <span className="text-xs text-[#526174] dark:text-[#CBD5E1] font-semibold">WBC</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">
                            {user?.vitals?.wbc || 0}
                          </span>
                          <span className="text-[10px] text-[#7A8798] dark:text-[#94A3B8] ml-1">x10³/µL</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-2.5 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
                        <span className="text-xs text-[#526174] dark:text-[#CBD5E1] font-semibold">Oxygen (SpO2)</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">
                            {user?.vitals?.oxygen || 0}
                          </span>
                          <span className="text-[10px] text-[#7A8798] dark:text-[#94A3B8] ml-1">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => navigate("/result", { state: user })}
                  >
                    View Result Report
                  </Button>
                </div>

                {/* Risk Timeline Chart Card */}
                <div className="sm:col-span-8 bg-white dark:bg-[#172033] p-4 sm:p-5 rounded-2xl shadow-xs border border-[#E2E8F0] dark:border-[#273449] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h2 className="text-xs sm:text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">
                      Risk Timeline
                    </h2>
                    <span className="text-[10px] text-[#526174] dark:text-[#94A3B8] bg-[#F8FAFC] dark:bg-[#1E293B] px-2 py-0.5 rounded-md self-start sm:self-auto border border-[#E2E8F0] dark:border-[#273449]">
                      Trend from recent telemetry
                    </span>
                  </div>

                  <div className="h-44 sm:h-48 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 12, bottom: 0, left: -25 }}
                      >
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
                            backgroundColor: isDark ? "#172033" : "#ffffff",
                            color: isDark ? "#F8FAFC" : "#172033",
                            fontSize: "12px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
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
                            stroke: isDark ? "#172033" : "#fff",
                          }}
                          activeDot={{ r: 5, strokeWidth: 0 }}
                          animationDuration={1200}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: User Profile Card */}
            <div className="lg:col-span-4 w-full">
              <ProfileCard user={user} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
