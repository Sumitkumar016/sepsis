import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Users,
  Search,
  Bell,
  LayoutDashboard,
  UserPlus,
  BrainCircuit,
  ShieldAlert,
  ChevronRight,
  HeartPulse,
  Thermometer,
  Clock,
  Info,
  Menu,
  X,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getAllPatients, getHighRiskPatients } from "../store/doctor";
import Logout from "./Logout";
import ThemeToggle from "../components/ThemeToggle";
import RiskBadge from "../components/RiskBadge";
import Button from "../components/Button";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Add Patient", icon: UserPlus, path: "/add-patient" },
  { name: "Alerts", icon: ShieldAlert, path: "/alerts" },
  { name: "History", icon: Clock, path: "/history" },
  { name: "Explain AI", icon: BrainCircuit, path: "/explain-ai" },
  { name: "About", icon: Info, path: "/about" },
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl shadow-xs transition-colors ${className}`}>
    {children}
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const chartRef = useRef(null);
  const { isDark } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { patients, highRiskPatients, loading } = useSelector((state) => state.doctor);
  const currentUser = useSelector((state) => state.user.profile || state.auth.user);

  useEffect(() => {
    dispatch(getAllPatients());
    dispatch(getHighRiskPatients());
  }, [dispatch]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return patients;
    }

    return patients.filter((patient) => {
      const name = (patient.patientName || "").toLowerCase();
      const email = (patient.email || "").toLowerCase();
      return name.includes(term) || email.includes(term) || patient.id.toLowerCase().includes(term);
    });
  }, [patients, searchTerm]);

  const stats = useMemo(() => {
    const high = patients.filter((patient) => patient.riskLevel === "High").length;
    const medium = patients.filter((patient) => patient.riskLevel === "Medium").length;
    const safe = patients.filter((patient) => patient.riskLevel === "Safe").length;

    return [
      { title: "Total Patients", value: patients.length, icon: Users, color: "text-[#14B87A] dark:text-[#35D39A]", bg: "bg-[#E8F8F2] dark:bg-[#14B87A]/15", border: "border-[#A8E3CF] dark:border-[#14B87A]/30" },
      { title: "High Risk", value: high, icon: AlertTriangle, color: "text-[#DC2626] dark:text-[#F87171]", bg: "bg-[#FEF2F2] dark:bg-[#2A1517]", border: "border-[#F5B5B5] dark:border-[#4C1D24]" },
      { title: "Medium Risk", value: medium, icon: Activity, color: "text-[#B45309] dark:text-[#FBBF24]", bg: "bg-[#FFF7E6] dark:bg-[#2A1F11]", border: "border-[#F5D08A] dark:border-[#523B19]" },
      { title: "Safe", value: safe, icon: CheckCircle, color: "text-[#15803D] dark:text-[#34D399]", bg: "bg-[#ECFDF3] dark:bg-[#102419]", border: "border-[#BBE7C8] dark:border-[#1E432E]" },
    ];
  }, [patients]);

  const chartData = useMemo(() => {
    const recent = [...patients]
      .sort((a, b) => new Date(a.updatedAt || a.createdAt || 0) - new Date(b.updatedAt || b.createdAt || 0))
      .slice(-7);

    return {
      labels: recent.map((patient) =>
        new Date(patient.updatedAt || patient.createdAt || Date.now()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      ),
      datasets: [
        {
          label: "Sepsis Risk Trend",
          data: recent.map((patient) => Number(patient.prediction ?? 0) / 100),
          borderColor: "#14B87A",
          backgroundColor: "rgba(20, 184, 122, 0.12)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: isDark ? "#172033" : "#ffffff",
          pointBorderColor: "#14B87A",
          pointBorderWidth: 2,
        },
      ],
    };
  }, [patients, isDark]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] font-sans flex transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="w-60 xl:w-64 border-r border-[#E2E8F0] dark:border-[#273449] bg-[#F8FAFC] dark:bg-[#0B1220] flex-col justify-between hidden lg:flex shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div>
          <div className="p-5 flex items-center gap-3 border-b border-[#E2E8F0] dark:border-[#273449]">
            <div className="w-9 h-9 rounded-xl bg-[#14B87A] flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight block">SepsisAI</span>
              <span className="text-[10px] font-semibold text-[#14B87A] dark:text-[#35D39A] uppercase tracking-widest block">Clinical Ward</span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider">
              Navigation
            </div>
            {MENU_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#E8F8F2] dark:bg-[#14B87A]/15 text-[#0F9F69] dark:text-[#35D39A] border border-[#A8E3CF] dark:border-[#14B87A]/30"
                      : "text-[#475569] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#111827]"
                  }`}
                >
                  <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#14B87A] dark:text-[#35D39A]" : ""}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-[#E2E8F0] dark:border-[#273449] space-y-2">
          <div className="flex items-center justify-between px-2 py-1 bg-white dark:bg-[#172033] rounded-xl border border-[#E2E8F0] dark:border-[#273449]">
            <span className="text-xs font-medium text-[#526174] dark:text-[#CBD5E1]">Theme</span>
            <ThemeToggle size="sm" />
          </div>
          <Logout />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#0B1220]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-[#172033] border-r border-[#E2E8F0] dark:border-[#273449] p-5 shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#273449]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#14B87A] flex items-center justify-center">
                  <BrainCircuit className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC] block">SepsisAI</span>
                  <span className="text-[10px] font-semibold text-[#14B87A] dark:text-[#35D39A] uppercase tracking-widest block">Clinical Ward</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#526174] hover:text-[#172033] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider">Menu</div>
              {MENU_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
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
                    <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#14B87A] dark:text-[#35D39A]" : ""}`} />
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

      {/* Main Ward Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden min-w-0">
        <header className="h-14 sm:h-16 border-b border-[#E2E8F0] dark:border-[#273449] bg-white/90 dark:bg-[#172033]/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#526174] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full max-w-xs sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8798] dark:text-[#94A3B8]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient name, email, ID..."
                className="w-full bg-white dark:bg-[#172033] border border-[#CBD5E1] dark:border-[#273449] rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#14B87A] focus:ring-2 focus:ring-[#14B87A]/20 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <ThemeToggle size="sm" />

            <button
              type="button"
              onClick={() => navigate("/alerts")}
              className="relative p-2 rounded-xl text-[#526174] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
              title="Alerts"
              aria-label="Alerts"
            >
              <Bell className="w-4.5 h-4.5" />
              {highRiskPatients.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
              )}
            </button>

            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#E2E8F0] dark:border-[#273449]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC] truncate max-w-[120px]">
                  {currentUser?.name || "Doctor"}
                </p>
                <p className="text-[10px] text-[#7A8798] dark:text-[#94A3B8]">Doctor Access</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#E8F8F2] dark:bg-[#14B87A]/20 border border-[#A8E3CF] dark:border-[#14B87A]/30 flex items-center justify-center text-[#0F9F69] dark:text-[#35D39A] font-bold text-xs">
                {(currentUser?.name || "D").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[#E2E8F0] dark:border-[#273449]">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
                Ward Overview
              </h1>
              <p className="text-xs sm:text-sm text-[#526174] dark:text-[#94A3B8] mt-0.5">
                Real-time sepsis risk monitoring, telemetry trends, and ICU alerts.
              </p>
            </div>
            <Link
              to="/add-patient"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#14B87A] hover:bg-[#0F9F69] active:bg-[#0c8255] text-white shadow-xs transition-colors self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Patient</span>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{stat.title}</p>
                    {loading ? (
                      <div className="h-7 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-1" />
                    ) : (
                      <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5">{stat.value}</p>
                    )}
                  </div>
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.bg} ${stat.color} border ${stat.border} flex items-center justify-center shrink-0`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Active Patients & Risk Trend Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patients Table Card */}
            <Card className="lg:col-span-2 p-4 sm:p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm sm:text-base font-bold text-[#172033] dark:text-[#F8FAFC]">Active Patients</h2>
                <button
                  type="button"
                  onClick={() => navigate("/history")}
                  className="text-xs text-[#14B87A] dark:text-[#35D39A] hover:text-[#0F9F69] flex items-center gap-1 font-semibold cursor-pointer"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] dark:border-[#273449] text-[#7A8798] dark:text-[#94A3B8] text-xs font-semibold">
                      <th className="pb-3 px-3">Patient</th>
                      <th className="pb-3 px-3">Age</th>
                      <th className="pb-3 px-3">Heart Rate</th>
                      <th className="pb-3 px-3">Temp (°C)</th>
                      <th className="pb-3 px-3">Risk Score</th>
                      <th className="pb-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm divide-y divide-[#E2E8F0] dark:divide-[#273449]">
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i}>
                          <td className="py-3 px-3"><div className="h-4 w-20 bg-[#F1F5F9] dark:bg-[#1E293B] rounded animate-pulse" /></td>
                          <td className="py-3 px-3"><div className="h-4 w-8 bg-[#F1F5F9] dark:bg-[#1E293B] rounded animate-pulse" /></td>
                          <td className="py-3 px-3"><div className="h-4 w-12 bg-[#F1F5F9] dark:bg-[#1E293B] rounded animate-pulse" /></td>
                          <td className="py-3 px-3"><div className="h-4 w-12 bg-[#F1F5F9] dark:bg-[#1E293B] rounded animate-pulse" /></td>
                          <td className="py-3 px-3"><div className="h-4 w-12 bg-[#F1F5F9] dark:bg-[#1E293B] rounded animate-pulse" /></td>
                          <td className="py-3 px-3"><div className="h-5 w-16 bg-[#F1F5F9] dark:bg-[#1E293B] rounded-full animate-pulse" /></td>
                        </tr>
                      ))
                    ) : filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => {
                        const riskVal = Number(patient.prediction ?? 0);
                        return (
                          <tr
                            key={patient.id}
                            onClick={() => navigate(`/patient/${patient.id}`)}
                            className="hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                          >
                            <td className="py-3 px-3">
                              <p className="font-semibold text-[#172033] dark:text-[#F8FAFC] truncate max-w-[130px]">{patient.patientName}</p>
                              <p className="text-[10px] text-[#7A8798] dark:text-[#94A3B8] truncate max-w-[130px]">{patient.email}</p>
                            </td>
                            <td className="py-3 px-3 text-[#526174] dark:text-[#CBD5E1]">{patient.age}</td>
                            <td className="py-3 px-3 text-[#526174] dark:text-[#CBD5E1]">
                              <span className="flex items-center gap-1">
                                <HeartPulse className="w-3.5 h-3.5 text-[#DC2626]" />
                                {patient.vitals?.heartRate || 0}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[#526174] dark:text-[#CBD5E1]">
                              <span className="flex items-center gap-1">
                                <Thermometer className="w-3.5 h-3.5 text-[#B45309]" />
                                {patient.vitals?.temperature || 0}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`font-mono font-bold ${riskVal >= 80 ? "text-[#DC2626] dark:text-[#F87171]" : riskVal >= 50 ? "text-[#B45309] dark:text-[#FBBF24]" : "text-[#15803D] dark:text-[#34D399]"}`}>
                                {riskVal}%
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <RiskBadge
                                level={patient.riskLevel}
                                size="xs"
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-10 px-3 text-center">
                          <Users className="w-7 h-7 text-[#7A8798] dark:text-[#94A3B8] mx-auto mb-1.5" />
                          <p className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC]">No matching patient records found</p>
                          <p className="text-[11px] text-[#7A8798] dark:text-[#94A3B8] mt-0.5">Try searching with a different term or register a new patient.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Sidebar Column: Trend + Alerts */}
            <div className="space-y-6 flex flex-col">
              <Card className="p-4 sm:p-5 flex-1 flex flex-col">
                <h2 className="text-sm sm:text-base font-bold text-[#172033] dark:text-[#F8FAFC] mb-3">
                  Sepsis Risk Trend
                </h2>
                <div className="relative w-full h-[200px]">
                  {loading ? (
                    <div className="w-full h-full bg-[#F1F5F9] dark:bg-[#1E293B] rounded-xl animate-pulse" />
                  ) : (
                    <Line
                      ref={chartRef}
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 1,
                            grid: { color: isDark ? "#273449" : "#E2E8F0" },
                            ticks: { color: isDark ? "#94A3B8" : "#64748B", font: { size: 10 } },
                          },
                          x: {
                            grid: { display: false },
                            ticks: { color: isDark ? "#94A3B8" : "#64748B", font: { size: 10 } },
                          },
                        },
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: isDark ? "#172033" : "#ffffff",
                            titleColor: isDark ? "#F8FAFC" : "#172033",
                            bodyColor: isDark ? "#F8FAFC" : "#172033",
                            borderColor: isDark ? "#273449" : "#E2E8F0",
                            borderWidth: 1,
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </Card>

              <Card className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4.5 h-4.5 text-[#DC2626]" />
                    <h2 className="text-sm sm:text-base font-bold text-[#172033] dark:text-[#F8FAFC]">Critical Alerts</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/alerts")}
                    className="text-xs text-[#14B87A] dark:text-[#35D39A] font-semibold hover:text-[#0F9F69] cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {loading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="h-16 bg-[#F1F5F9] dark:bg-[#1E293B] rounded-xl animate-pulse" />
                    ))
                  ) : highRiskPatients.length > 0 ? (
                    highRiskPatients.slice(0, 3).map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => navigate(`/patient/${patient.id}`)}
                        className="p-3 rounded-xl bg-[#FEF2F2] dark:bg-[#2A1517] border border-[#F5B5B5] dark:border-[#4C1D24] flex justify-between items-start cursor-pointer hover:bg-[#FEE2E2] dark:hover:bg-[#341A1D] transition-colors"
                      >
                        <div>
                          <p className="font-bold text-xs text-[#DC2626] dark:text-[#F87171]">{patient.patientName}</p>
                          <p className="text-[11px] text-[#526174] dark:text-[#94A3B8] mt-0.5">ICU Monitoring Advised</p>
                        </div>
                        <div className="bg-[#DC2626]/10 text-[#DC2626] dark:text-[#F87171] px-2 py-0.5 rounded text-[10px] font-bold">
                          {Number(patient.prediction ?? 0)}%
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449] text-center">
                      <CheckCircle className="w-4 h-4 text-[#15803D] mx-auto mb-1" />
                      <p className="text-xs font-medium text-[#172033] dark:text-[#F8FAFC]">Ward Acuity Normal</p>
                      <p className="text-[10px] text-[#7A8798] dark:text-[#94A3B8]">No active high-risk alerts.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
