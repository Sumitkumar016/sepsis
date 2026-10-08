import React, { useState } from "react";
import { Mail, Lock, HeartPulse, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postLogin } from "../store/auth";
import { getUserData } from "../store/user";
import { normalizeEmail } from "../store/firestoreUtils";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);

      const resultAction = await dispatch(
        postLogin({
          email: normalizeEmail(formData.email),
          password: formData.password,
        })
      );

      if (postLogin.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        await dispatch(getUserData({ userId: user.id }));

        if (user.role === "Doctor") {
          navigate("/");
        } else {
          navigate("/userdashboard");
        }
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] flex items-center justify-center p-4 relative font-sans transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle size="sm" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] p-6 sm:p-8 rounded-2xl shadow-sm relative z-10 transition-all">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 bg-[#14B87A] rounded-xl flex items-center justify-center shadow-xs mb-3">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] dark:text-[#F8FAFC]">
            SepsisAI Portal
          </h1>
          <p className="text-[#526174] dark:text-[#94A3B8] text-xs sm:text-sm mt-1">
            Sign in to access patient monitoring
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-[#FEF2F2] dark:bg-[#2A1517] border border-[#F5B5B5] dark:border-[#4C1D24] rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <p className="text-xs text-[#DC2626] dark:text-[#F87171]">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8798] dark:text-[#94A3B8] pointer-events-none" />
              <input
                type="email"
                name="email"
                placeholder="doctor@hospital.org"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#FFFFFF] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#273449] rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none focus:border-[#14B87A] focus:ring-2 focus:ring-[#14B87A]/20 transition-colors"
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
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#FFFFFF] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#273449] rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none focus:border-[#14B87A] focus:ring-2 focus:ring-[#14B87A]/20 transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#14B87A] hover:bg-[#0F9F69] active:bg-[#0F9F69] text-white font-semibold py-2.5 px-4 rounded-xl shadow-xs transition duration-200 disabled:opacity-60 cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-[#526174] dark:text-[#94A3B8]">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#14B87A] dark:text-[#35D39A] hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
