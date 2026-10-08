import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TestTube,
  Activity,
  Thermometer,
  HeartPulse,
  Droplets,
  User,
  Calendar,
  PlusCircle,
  ArrowLeft,
  Wind,
} from "lucide-react";
import { useSelector } from "react-redux";
import ThemeToggle from "../components/ThemeToggle";

const initialForm = {
  name: "",
  age: "",
  gender: "Male",
  email: "",
  heartRate: "",
  dia_bloodPressure: "",
  temperature: "",
  wbc: "",
  Sys_bloodPressure: "",
  Resp_Rate: "",
  Oxygen: "",
  glucose: "",
};

const buildVitals = (formData) => ({
  heartRate: Number(formData.heartRate) || 0,
  bloodPressure: `${formData.Sys_bloodPressure}/${formData.dia_bloodPressure}`,
  temperature: Number(formData.temperature) || 0,
  wbc: Number(formData.wbc) || 0,
  oxygen: Number(formData.Oxygen) || 0,
  glucose: Number(formData.glucose) || 0,
  respiratoryRate: Number(formData.Resp_Rate) || 0,
});

export default function AddPatient() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const profileUser = useSelector((state) => state.user.profile);
  const currentRole = profileUser?.role || authUser?.role || "User";
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const vitals = buildVitals(formData);

    navigate("/predict", {
      state: {
        patientData: {
          name: formData.name.trim(),
          age: Number(formData.age),
          gender: formData.gender,
          email: formData.email.trim(),
        },
        vitals,
        role: currentRole,
      },
    });
  };

  const backUrl = currentRole === "Doctor" ? "/" : "/userdashboard";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] flex items-center justify-center p-3 sm:p-6 font-sans transition-colors">
      <div className="w-full max-w-3xl bg-white dark:bg-[#172033] rounded-2xl sm:rounded-3xl shadow-sm border border-[#E2E8F0] dark:border-[#273449] overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#14B87A] to-[#0F9F69] p-5 sm:p-7 text-center relative overflow-hidden text-white">
          <div className="flex items-center justify-between relative z-20 mb-2">
            <Link
              to={backUrl}
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Link>
            <ThemeToggle size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/20" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold flex items-center justify-center relative z-10">
            <PlusCircle className="w-6 h-6 mr-2" />
            Patient Vitals Assessment
          </h1>
          <p className="text-[#E8F8F2] text-xs sm:text-sm mt-1 opacity-90 relative z-10">
            Enter clinical parameters to calculate real-time sepsis risk
          </p>
        </div>

        <div className="p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#172033] dark:text-[#F8FAFC] border-b border-[#E2E8F0] dark:border-[#273449] pb-2 mb-4 flex items-center">
                <User className="w-4 h-4 mr-2 text-[#14B87A] dark:text-[#35D39A]" /> Personal Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8798] dark:text-[#94A3B8] pointer-events-none" />
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-9 w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all placeholder-[#94A3B8]"
                      placeholder="e.g. Rahul Kumar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8798] dark:text-[#94A3B8] pointer-events-none" />
                      <input
                        required
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="pl-9 w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all placeholder-[#94A3B8]"
                        placeholder="45"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all placeholder-[#94A3B8]"
                    placeholder="patient@hospital.org"
                  />
                </div>
              </div>
            </div>

            {/* Clinical Vitals */}
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#172033] dark:text-[#F8FAFC] border-b border-[#E2E8F0] dark:border-[#273449] pb-2 mb-4 flex items-center">
                <HeartPulse className="w-4 h-4 mr-2 text-[#14B87A] dark:text-[#35D39A]" /> Vital Signs & Laboratory Values
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Heart Rate (bpm)</label>
                  <div className="relative">
                    <HeartPulse className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DC2626] pointer-events-none" />
                    <input
                      required
                      type="number"
                      name="heartRate"
                      value={formData.heartRate}
                      onChange={handleChange}
                      className="pl-9 w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all placeholder-[#94A3B8]"
                      placeholder="85"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Sys BP (mmHg)</label>
                  <div className="relative">
                    <Wind className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#94A3B8] pointer-events-none" />
                    <input
                      required
                      type="number"
                      name="Sys_bloodPressure"
                      value={formData.Sys_bloodPressure}
                      onChange={handleChange}
                      className="pl-9 w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all placeholder-[#94A3B8]"
                      placeholder="120"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Dia BP (mmHg)</label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#94A3B8] pointer-events-none" />
                    <input
                      required
                      type="number"
                      name="dia_bloodPressure"
                      value={formData.dia_bloodPressure}
                      onChange={handleChange}
                      className="pl-9 w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all placeholder-[#94A3B8]"
                      placeholder="80"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Temp (°C)</label>
                  <div className="relative">
                    <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B45309] pointer-events-none" />
                    <input
                      required
                      type="number"
                      step="0.1"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleChange}
                      className="pl-9 w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all placeholder-[#94A3B8]"
                      placeholder="37.2"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">WBC (x10³/µL)</label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#14B87A] dark:text-[#35D39A] pointer-events-none" />
                    <input
                      required
                      type="number"
                      step="0.1"
                      name="wbc"
                      value={formData.wbc}
                      onChange={handleChange}
                      className="pl-9 w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all placeholder-[#94A3B8]"
                      placeholder="7.5"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Oxygen SpO2 (%)</label>
                  <div className="relative">
                    <Wind className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0F766E] pointer-events-none" />
                    <input
                      required
                      type="number"
                      step="1"
                      name="Oxygen"
                      value={formData.Oxygen}
                      onChange={handleChange}
                      className="pl-9 w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all placeholder-[#94A3B8]"
                      placeholder="98"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Glucose (mg/dL)</label>
                  <div className="relative">
                    <TestTube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B45309] pointer-events-none" />
                    <input
                      required
                      type="number"
                      step="1"
                      name="glucose"
                      value={formData.glucose}
                      onChange={handleChange}
                      className="pl-9 w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all placeholder-[#94A3B8]"
                      placeholder="140"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#526174] dark:text-[#CBD5E1]">Resp Rate (/min)</label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#15803D] pointer-events-none" />
                    <input
                      required
                      type="number"
                      step="1"
                      name="Resp_Rate"
                      value={formData.Resp_Rate}
                      onChange={handleChange}
                      className="pl-9 w-full rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] focus:ring-2 focus:ring-[#14B87A]/20 focus:border-[#14B87A] outline-none transition-all placeholder-[#94A3B8]"
                      placeholder="18"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center rounded-xl bg-[#14B87A] hover:bg-[#0F9F69] active:bg-[#0c8255] text-white font-bold text-sm py-3 px-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Run AI Risk Prediction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
