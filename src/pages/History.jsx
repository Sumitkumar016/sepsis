import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Calendar,
  Activity,
  Database,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPatients } from "../store/doctor";
import ThemeToggle from "../components/ThemeToggle";
import RiskBadge from "../components/RiskBadge";

export default function History() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patients, loading } = useSelector((state) => state.doctor);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  useEffect(() => {
    dispatch(getAllPatients());
  }, [dispatch]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setStatusFilter(e.target.value);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    let filteredData = [...patients];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (patient) =>
          (patient.patientName || "").toLowerCase().includes(lowercasedTerm) ||
          patient.id.toLowerCase().includes(lowercasedTerm)
      );
    }

    if (statusFilter !== "all") {
      filteredData = filteredData.filter(
        (patient) => patient.riskLevel?.toLowerCase() === statusFilter
      );
    }

    if (sortConfig !== null) {
      filteredData.sort((a, b) => {
        const left = a[sortConfig.key] ?? "";
        const right = b[sortConfig.key] ?? "";
        if (left < right) return sortConfig.direction === "asc" ? -1 : 1;
        if (left > right) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [patients, searchTerm, statusFilter, sortConfig]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    return <RiskBadge level={status || "Unknown"} size="xs" />;
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey)
      return <ArrowDown className="w-3.5 h-3.5 ml-1 opacity-20 group-hover:opacity-50 transition-opacity" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 ml-1 text-[#14B87A] dark:text-[#35D39A]" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 ml-1 text-[#14B87A] dark:text-[#35D39A]" />
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0] dark:border-[#273449]">
          <div>
            <Link
              to="/"
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#14B87A] dark:text-[#35D39A] hover:text-[#0F9F69] mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center tracking-tight">
              <Database className="w-7 h-7 mr-2.5 text-[#14B87A]" />
              Patient Clinical History
            </h1>
            <p className="text-xs sm:text-sm text-[#526174] dark:text-[#94A3B8] mt-1">
              Historical records of telemetry, sepsis predictions, and vitals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => dispatch(getAllPatients())}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] dark:bg-[#172033] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] text-[#526174] dark:text-[#CBD5E1] rounded-xl text-xs font-semibold border border-[#E2E8F0] dark:border-[#273449] shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8798] dark:text-[#94A3B8] pointer-events-none" />
            <input
              type="text"
              className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#273449] rounded-xl text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none focus:border-[#14B87A] focus:ring-2 focus:ring-[#14B87A]/20 transition-colors"
              placeholder="Search by Patient Name or ID..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="relative min-w-[180px]">
            <Filter className="absolute inset-y-0 left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#7A8798] dark:text-[#94A3B8] pointer-events-none z-10" />
            <select
              value={statusFilter}
              onChange={handleFilterChange}
              className="w-full pl-8 pr-8 py-2 bg-[#FFFFFF] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#273449] rounded-xl text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] outline-none focus:border-[#14B87A] focus:ring-2 focus:ring-[#14B87A]/20 cursor-pointer appearance-none transition-colors"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="safe">Normal / Safe</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#7A8798] dark:text-[#94A3B8] pointer-events-none" />
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl shadow-xs overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8FAFC] dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#273449] text-[11px] font-bold text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Patient ID</th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      className="flex items-center cursor-pointer group uppercase text-[11px] font-bold"
                      onClick={() => requestSort("patientName")}
                    >
                      Patient Name <SortIcon columnKey="patientName" />
                    </button>
                  </th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      className="flex items-center cursor-pointer group uppercase text-[11px] font-bold"
                      onClick={() => requestSort("prediction")}
                    >
                      Risk Score <SortIcon columnKey="prediction" />
                    </button>
                  </th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      className="flex items-center cursor-pointer group uppercase text-[11px] font-bold"
                      onClick={() => requestSort("createdAt")}
                    >
                      Recorded Date <SortIcon columnKey="createdAt" />
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#273449] text-xs sm:text-sm">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3"><div className="h-4 w-16 bg-[#E2E8F0] dark:bg-[#273449] rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-28 bg-[#E2E8F0] dark:bg-[#273449] rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-8 bg-[#E2E8F0] dark:bg-[#273449] rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-12 bg-[#E2E8F0] dark:bg-[#273449] rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-16 bg-[#E2E8F0] dark:bg-[#273449] rounded-full animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-24 bg-[#E2E8F0] dark:bg-[#273449] rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : processedData.length > 0 ? (
                  processedData.map((patient) => {
                    const riskVal = Number(patient.prediction ?? 0);
                    return (
                      <tr
                        key={patient.id}
                        onClick={() => navigate(`/patient/${patient.id}`)}
                        className="hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-[#526174] dark:text-[#94A3B8] bg-[#F1F5F9] dark:bg-[#1E293B] px-1.5 py-0.5 rounded">
                            #{patient.id ? patient.id.substring(0, 8) : "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#E8F8F2] dark:bg-[#14B87A]/20 text-[#0F9F69] dark:text-[#35D39A] flex items-center justify-center font-bold text-xs shrink-0">
                              {(patient.patientName || "P").charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-[#172033] dark:text-[#F8FAFC] truncate max-w-[140px]">
                              {patient.patientName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#526174] dark:text-[#CBD5E1]">
                          {patient.age} yrs
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 font-mono font-bold">
                            <Activity
                              className={`w-3.5 h-3.5 ${
                                riskVal >= 80 ? "text-[#DC2626]" : riskVal >= 50 ? "text-[#B45309]" : "text-[#15803D]"
                              }`}
                            />
                            <span
                              className={
                                riskVal >= 80
                                  ? "text-[#DC2626] dark:text-[#F87171]"
                                  : riskVal >= 50
                                  ? "text-[#B45309] dark:text-[#FBBF24]"
                                  : "text-[#15803D] dark:text-[#34D399]"
                              }
                            >
                              {riskVal}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(patient.riskLevel)}</td>
                        <td className="px-4 py-3 text-[#7A8798] dark:text-[#94A3B8] text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 opacity-60" />
                            {formatDate(patient.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-[#7A8798] dark:text-[#94A3B8] text-xs sm:text-sm">
                      No matching patient records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {processedData.length > 0 && (
            <div className="bg-[#F8FAFC] dark:bg-[#1E293B]/60 px-4 py-3 border-t border-[#E2E8F0] dark:border-[#273449] flex items-center justify-between text-xs text-[#526174] dark:text-[#94A3B8]">
              <span>
                Total records: <strong className="text-[#172033] dark:text-[#F8FAFC]">{processedData.length}</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
