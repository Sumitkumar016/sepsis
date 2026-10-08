import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  HeartPulse,
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postSignup } from "../store/auth";
import { getUserData } from "../store/user";
import { normalizeEmail } from "../store/firestoreUtils";
import ThemeToggle from "../components/ThemeToggle";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);

      const resultAction = await dispatch(
        postSignup({
          name: formData.fullName,
          email: normalizeEmail(formData.email),
          password: formData.password,
          role: formData.role,
        })
      );

      if (postSignup.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        await dispatch(getUserData({ userId: user.id }));
        navigate(user.role === "Doctor" ? "/" : "/userdashboard");
      } else {
        setError(resultAction.payload);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] flex items-center justify-center p-4 relative font-sans transition-colors">
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle size="sm" />
      </div>

      <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] p-6 sm:p-8 rounded-2xl shadow-sm relative z-10 transition-all">
        {/* Header */}
        <div className="flex flex-col items-center mb-5 text-center">
          <div className="w-12 h-12 bg-[#14B87A] rounded-xl flex items-center justify-center shadow-xs mb-3">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] dark:text-[#F8FAFC]">
            Create SepsisAI Account
          </h1>
          <p className="text-[#526174] dark:text-[#94A3B8] text-xs sm:text-sm mt-1">
            Choose your account role to register
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-[#FEF2F2] dark:bg-[#2A1517] border border-[#F5B5B5] dark:border-[#4C1D24] rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <p className="text-xs text-[#DC2626] dark:text-[#F87171]">{error}</p>
          </div>
        )}

        {/* Role Selector */}
        <div className="mb-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleRoleSelect("User")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              formData.role === "User"
                ? "bg-[#E8F8F2] dark:bg-[#14B87A]/20 border-[#14B87A] dark:border-[#14B87A] text-[#0F9F69] dark:text-[#35D39A]"
                : "bg-[#F8FAFC] dark:bg-[#1E293B] border-[#CBD5E1] dark:border-[#273449] text-[#526174] dark:text-[#CBD5E1]"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Patient / User</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("Doctor")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              formData.role === "Doctor"
                ? "bg-[#E8F8F2] dark:bg-[#14B87A]/20 border-[#14B87A] dark:border-[#14B87A] text-[#0F9F69] dark:text-[#35D39A]"
                : "bg-[#F8FAFC] dark:bg-[#1E293B] border-[#CBD5E1] dark:border-[#273449] text-[#526174] dark:text-[#CBD5E1]"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC]">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8798] dark:text-[#94A3B8] pointer-events-none" />
              <input
                type="text"
                name="fullName"
                placeholder={formData.role === "Doctor" ? "Dr. Sarah Chen" : "Rahul Kumar"}
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-[#FFFFFF] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#273449] rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none focus:border-[#14B87A] focus:ring-2 focus:ring-[#14B87A]/20 transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8798] dark:text-[#94A3B8] pointer-events-none" />
              <input
                type="email"
                name="email"
                placeholder="user@hospital.org"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#FFFFFF] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#273449] rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none focus:border-[#14B87A] focus:ring-2 focus:ring-[#14B87A]/20 transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8798] dark:text-[#94A3B8] pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#FFFFFF] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#273449] rounded-xl py-2 pl-9 pr-9 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none focus:border-[#14B87A] focus:ring-2 focus:ring-[#14B87A]/20 transition-colors"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7A8798] hover:text-[#172033] dark:hover:text-[#F8FAFC] cursor-pointer"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC]">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8798] dark:text-[#94A3B8] pointer-events-none" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-[#FFFFFF] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#273449] rounded-xl py-2 pl-9 pr-9 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none focus:border-[#14B87A] focus:ring-2 focus:ring-[#14B87A]/20 transition-colors"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7A8798] hover:text-[#172033] dark:hover:text-[#F8FAFC] cursor-pointer"
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#14B87A] hover:bg-[#0F9F69] active:bg-[#0F9F69] text-white font-semibold py-2.5 px-4 rounded-xl shadow-xs transition duration-200 disabled:opacity-60 cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 mt-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-xs text-[#526174] dark:text-[#94A3B8]">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-[#14B87A] dark:text-[#35D39A] hover:underline">
              Sign In Instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
