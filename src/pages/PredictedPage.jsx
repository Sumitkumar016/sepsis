import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle,
  Cpu,
  Droplets,
  HeartPulse,
  ShieldAlert,
  Thermometer,
  Wind,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { waitForAuth } from "../Auth/firebase";
import { addPatient } from "../store/doctor";
import { normalizeEmail } from "../store/firestoreUtils";
import { getPrediction } from "../store/aiSlice";
import { updateUserProfile } from "../store/user";
import ThemeToggle from "../components/ThemeToggle";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const SkeletonLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-6xl mx-auto space-y-6"
  >
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
        <div className="h-6 w-48 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
      </div>
      <div className="h-8 w-32 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-5">
      <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse"></div>
      <div className="grid grid-cols-1 gap-4">
        <div className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse"></div>
        <div className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse"></div>
      </div>
    </div>
  </motion.div>
);

const getNumericValue = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const parseBloodPressure = (bloodPressure = "") => {
  const [systolic = 0, diastolic = 0] = String(bloodPressure).split("/");

  return {
    systolic: getNumericValue(systolic),
    diastolic: getNumericValue(diastolic),
  };
};

const formatPrediction = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return value ?? "--";
  }

  const normalizedValue =
    numericValue >= 0 && numericValue <= 1 ? numericValue * 100 : numericValue;

  return Number(normalizedValue.toFixed(normalizedValue % 1 === 0 ? 0 : 1));
};

const getRiskConfig = (riskLevel = "") => {
  switch (String(riskLevel).toLowerCase()) {
    case "high":
      return {
        accent: "text-[#DC2626] dark:text-[#F87171]",
        badge: "bg-[#FEF2F2] text-[#DC2626] border-[#F5B5B5] dark:bg-[#2A1517] dark:text-[#F87171] dark:border-[#4C1D24]",
        card: "border-[#F5B5B5] dark:border-[#4C1D24]",
        glow: "bg-[#DC2626]/10",
        icon: AlertTriangle,
        label: "High Risk",
        scoreStroke: "#DC2626",
        summaryTitle: "Immediate clinical escalation recommended",
        summaryText:
          "AI detected an elevated probability of sepsis from submitted vital parameters. Rapid physician review, blood gas evaluation, and targeted observation are advised.",
      };
    case "medium":
      return {
        accent: "text-[#B45309] dark:text-[#FBBF24]",
        badge: "bg-[#FFF7E6] text-[#B45309] border-[#F5D08A] dark:bg-[#2A1F11] dark:text-[#FBBF24] dark:border-[#523B19]",
        card: "border-[#F5D08A] dark:border-[#523B19]",
        glow: "bg-[#B45309]/10",
        icon: ShieldAlert,
        label: "Medium Risk",
        scoreStroke: "#B45309",
        summaryTitle: "Elevated sepsis risk detected",
        summaryText:
          "AI detected concerning physiological deviations. Repeat vital sign assessments within 2 hours are advised.",
      };
    default:
      return {
        accent: "text-[#15803D] dark:text-[#34D399]",
        badge: "bg-[#ECFDF3] text-[#15803D] border-[#BBE7C8] dark:bg-[#102419] dark:text-[#34D399] dark:border-[#1E432E]",
        card: "border-[#BBE7C8] dark:border-[#1E432E]",
        glow: "bg-[#15803D]/10",
        icon: CheckCircle,
        label: "Low Risk",
        scoreStroke: "#15803D",
        summaryTitle: "Lower sepsis risk based on current vitals",
        summaryText:
          "AI returned a lower probability of sepsis for current parameters. Continue routine observation protocol.",
      };
  }
};

const getFactorTone = (status) => {
  if (status === "critical") {
    return "border-[#F5B5B5] dark:border-[#4C1D24] bg-[#FEF2F2]/50 dark:bg-[#2A1517]/40 text-[#DC2626] dark:text-[#F87171]";
  }

  if (status === "warning") {
    return "border-[#F5D08A] dark:border-[#523B19] bg-[#FFF7E6]/50 dark:bg-[#2A1F11]/40 text-[#B45309] dark:text-[#FBBF24]";
  }

  return "border-[#E2E8F0] dark:border-[#273449] bg-[#FFFFFF] dark:bg-[#172033] text-[#172033] dark:text-[#F8FAFC]";
};

const getTrendIcon = (trend) => (trend === "up" ? ArrowUp : ArrowDown);

const buildVitalsFactors = (vitals) => {
  const { systolic, diastolic } = parseBloodPressure(vitals?.bloodPressure);
  const heartRate = getNumericValue(vitals?.heartRate);
  const temperature = getNumericValue(vitals?.temperature);
  const oxygen = getNumericValue(vitals?.oxygen);
  const respiratoryRate = getNumericValue(vitals?.respiratoryRate);
  const wbc = getNumericValue(vitals?.wbc);
  const glucose = getNumericValue(vitals?.glucose);

  return [
    {
      name: "Heart Rate",
      value: `${heartRate} bpm`,
      description: "Tachycardia above 100 bpm indicates systemic stress.",
      icon: HeartPulse,
      status:
        heartRate > 120 || heartRate < 50
          ? "critical"
          : heartRate > 100 || heartRate < 60
            ? "warning"
            : "normal",
      trend: heartRate > 100 ? "up" : "down",
    },
    {
      name: "Temperature",
      value: `${temperature} °C`,
      description: "Fever or hypothermia can indicate systemic infection.",
      icon: Thermometer,
      status:
        temperature >= 39 || temperature <= 35.5
          ? "critical"
          : temperature >= 38 || temperature <= 36
            ? "warning"
            : "normal",
      trend: temperature >= 38 ? "up" : "down",
    },
    {
      name: "Oxygen Saturation",
      value: `${oxygen}%`,
      description: "Low oxygen saturation signals respiratory distress.",
      icon: Wind,
      status: oxygen < 90 ? "critical" : oxygen < 95 ? "warning" : "normal",
      trend: oxygen < 95 ? "down" : "up",
    },
    {
      name: "Blood Pressure",
      value: `${systolic}/${diastolic} mmHg`,
      description: "Arterial hypotension is a key marker in septic shock.",
      icon: Activity,
      status:
        systolic < 90 || diastolic < 60
          ? "critical"
          : systolic < 100 || diastolic < 65
            ? "warning"
            : "normal",
      trend: systolic < 100 || diastolic < 65 ? "down" : "up",
    },
    {
      name: "Respiratory Rate",
      value: `${respiratoryRate} bpm`,
      description: "Tachypnea reflects metabolic compensation.",
      icon: Cpu,
      status:
        respiratoryRate >= 26 || respiratoryRate <= 8
          ? "critical"
          : respiratoryRate > 20
            ? "warning"
            : "normal",
      trend: respiratoryRate > 20 ? "up" : "down",
    },
    {
      name: "WBC Count",
      value: `${wbc}`,
      description: "Leukocytosis suggests active inflammatory cascade.",
      icon: Droplets,
      status: wbc > 15 || wbc < 3 ? "critical" : wbc > 12 || wbc < 4 ? "warning" : "normal",
      trend: wbc > 12 ? "up" : "down",
    },
    {
      name: "Glucose",
      value: `${glucose} mg/dL`,
      description: "Acute glycemic variance increases metabolic risk.",
      icon: Cpu,
      status:
        glucose > 220 || glucose < 60
          ? "critical"
          : glucose > 180 || glucose < 70
            ? "warning"
            : "normal",
      trend: glucose > 180 ? "up" : "down",
    },
  ];
};

const getSaveStatusConfig = (status) => {
  if (status === "saving") {
    return {
      className: "border-[#A8E3CF] dark:border-[#14B87A]/30 bg-[#E8F8F2] dark:bg-[#14B87A]/10 text-[#0F9F69] dark:text-[#35D39A]",
      label: "Saving to Firestore",
    };
  }

  if (status === "saved") {
    return {
      className: "border-[#BBE7C8] dark:border-[#1E432E] bg-[#ECFDF3] dark:bg-[#102419] text-[#15803D] dark:text-[#34D399]",
      label: "Saved to Database",
    };
  }

  if (status === "error") {
    return {
      className: "border-[#F5B5B5] dark:border-[#4C1D24] bg-[#FEF2F2] dark:bg-[#2A1517] text-[#DC2626] dark:text-[#F87171]",
      label: "Save Failed",
    };
  }

  return {
    className: "border-[#E2E8F0] dark:border-[#273449] bg-[#F8FAFC] dark:bg-[#1E293B] text-[#526174] dark:text-[#94A3B8]",
    label: "Processing Output",
  };
};

export default function PredictedPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, vitals, role } = location.state || {};
  const { loading } = useSelector((state) => state.ai);
  const [predictionResult, setPredictionResult] = useState(null);
  const [pageError, setPageError] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const runPrediction = async () => {
      try {
        if (!formData || !vitals || !role) {
          throw new Error("Missing prediction vitals data");
        }

        const aiResult = await dispatch(getPrediction(vitals));

        if (getPrediction.rejected.match(aiResult)) {
          throw new Error(aiResult.payload || "Prediction service error");
        }

        const predictionData = aiResult.payload;
        setPredictionResult(predictionData);
        setSaveStatus("saving");

        const firebaseUser = await waitForAuth();
        const email =
          role === "User"
            ? normalizeEmail(firebaseUser?.email || "")
            : normalizeEmail(formData.email);

        if (!email) {
          throw new Error("Patient email required");
        }

        if (role === "Doctor") {
          await dispatch(
            addPatient({
              patientName: formData.name,
              age: Number(formData.age) || 0,
              gender: formData.gender,
              email,
              vitals,
              prediction: predictionData.prediction,
              riskLevel: predictionData.riskLevel,
            })
          ).unwrap();
        } else if (role === "User") {
          await dispatch(
            updateUserProfile({
              updatedData: {
                name: formData.name,
                email,
                age: Number(formData.age) || 0,
                gender: formData.gender,
                vitals,
                prediction: predictionData.prediction,
                riskLevel: predictionData.riskLevel,
              },
            })
          ).unwrap();
        }

        setSaveStatus("saved");
      } catch (err) {
        setPageError(err.message || "Failed to process prediction");
        setSaveStatus("error");
      }
    };

    runPrediction();
  }, [dispatch, formData, role, vitals]);

  const predictionScore = formatPrediction(predictionResult?.prediction);
  const riskConfig = getRiskConfig(predictionResult?.riskLevel);
  const RiskIcon = riskConfig.icon;
  const saveStatusConfig = getSaveStatusConfig(saveStatus);
  const factors = buildVitalsFactors(vitals);
  const patientMeta = [
    { label: "Patient", value: formData?.name || "Unknown" },
    { label: "Age", value: formData?.age ? `${formData.age} yrs` : "--" },
    { label: "Gender", value: formData?.gender || "--" },
    { label: "Role", value: role || "--" },
  ];

  if (pageError) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] p-4 sm:p-8 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-[#FFFFFF] dark:bg-[#172033] rounded-2xl border border-[#F5B5B5] dark:border-[#4C1D24] p-6 shadow-sm text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FEF2F2] dark:bg-[#2A1517] text-[#DC2626] dark:text-[#F87171] border border-[#F5B5B5] dark:border-[#4C1D24] px-3 py-1 text-xs font-bold mb-3">
            <AlertTriangle className="h-4 w-4" />
            Prediction Notice
          </div>
          <h1 className="text-xl font-bold text-[#172033] dark:text-[#F8FAFC]">Unable to complete prediction</h1>
          <p className="mt-2 text-xs sm:text-sm text-[#526174] dark:text-[#94A3B8]">{pageError}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-[#273449] text-[#526174] dark:text-[#CBD5E1] text-xs font-semibold hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => navigate("/add-patient", { replace: true })}
              className="px-4 py-2 rounded-xl bg-[#14B87A] hover:bg-[#0F9F69] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              Retry Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !predictionResult) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] p-4 sm:p-8 font-sans">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans transition-colors">
      <div className="relative w-full max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key="prediction-content"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-[#273449] pb-3"
            >
              <button
                type="button"
                onClick={() => navigate(-2)}
                className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#14B87A] dark:text-[#35D39A] hover:text-[#0F9F69] transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Dashboard
              </button>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${saveStatusConfig.className}`}>
                  {saveStatusConfig.label}
                </div>
                <ThemeToggle size="sm" />
              </div>
            </motion.div>

            {/* Main Result & Recommended Action */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1.3fr]">
              {/* Score Box */}
              <motion.div variants={itemVariants}>
                <div className={`rounded-2xl border bg-[#FFFFFF] dark:bg-[#172033] p-6 shadow-xs ${riskConfig.card}`}>
                  <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${riskConfig.badge}`}>
                    <RiskIcon className="mr-1.5 h-3.5 w-3.5" />
                    {predictionResult?.riskLevel || riskConfig.label}
                  </div>

                  <div className="mt-6 flex justify-center">
                    <div className="relative h-48 w-48">
                      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
                        <circle
                          cx="110"
                          cy="110"
                          r="94"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          className="text-[#E2E8F0] dark:text-[#273449]"
                        />
                        <circle
                          cx="110"
                          cy="110"
                          r="94"
                          stroke={riskConfig.scoreStroke}
                          strokeWidth="12"
                          fill="transparent"
                          strokeLinecap="round"
                          strokeDasharray={590.6}
                          strokeDashoffset={590.6 - (590.6 * Math.min(getNumericValue(predictionScore), 100)) / 100}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-5xl font-black tracking-tight text-[#172033] dark:text-[#F8FAFC]">
                          {predictionScore}
                          <span className="text-2xl text-[#7A8798] dark:text-[#94A3B8]">%</span>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A8798] dark:text-[#94A3B8] mt-1">
                          Sepsis Risk
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-2.5">
                    {patientMeta.map((item) => (
                      <div key={item.label} className="rounded-xl border border-[#E2E8F0] dark:border-[#273449] bg-[#F8FAFC] dark:bg-[#1E293B] p-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A8798] dark:text-[#94A3B8]">
                          {item.label}
                        </div>
                        <div className="mt-0.5 text-xs sm:text-sm font-bold text-[#172033] dark:text-[#F8FAFC] truncate">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Action Banner & Details */}
              <div className="grid grid-cols-1 gap-4">
                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl border border-[#E2E8F0] dark:border-[#273449] bg-[#FFFFFF] dark:bg-[#172033] p-5 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-xl p-2.5 ${riskConfig.badge}`}>
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A8798] dark:text-[#94A3B8]">
                        Clinical Recommendation
                      </div>
                      <h2 className={`mt-1 text-lg sm:text-xl font-bold ${riskConfig.accent}`}>
                        {riskConfig.summaryTitle}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-[#526174] dark:text-[#CBD5E1] leading-relaxed">
                        {riskConfig.summaryText}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl border border-[#E2E8F0] dark:border-[#273449] bg-[#FFFFFF] dark:bg-[#172033] p-5 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A8798] dark:text-[#94A3B8]">
                      Machine Learning Engine
                    </div>
                    <h3 className="mt-1 text-base sm:text-lg font-bold text-[#172033] dark:text-[#F8FAFC]">
                      {predictionResult?.prediction}% risk with {predictionResult?.riskLevel} severity
                    </h3>
                  </div>
                  <div className={`rounded-xl border px-3 py-1.5 text-center ${riskConfig.badge}`}>
                    <div className="text-[10px] font-bold uppercase">Classification</div>
                    <div className="text-sm font-black">{predictionResult?.riskLevel}</div>
                  </div>
                </motion.div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(role === "Doctor" ? "/" : "/userdashboard")}
                    className="flex-1 rounded-xl bg-[#14B87A] hover:bg-[#0F9F69] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition cursor-pointer"
                  >
                    Go to Portal Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/explain-ai")}
                    className="rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-[#FFFFFF] dark:bg-[#172033] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#526174] dark:text-[#CBD5E1] cursor-pointer"
                  >
                    Explain AI
                  </button>
                </div>
              </div>
            </div>

            {/* Submitted Vitals Grid */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl border border-[#E2E8F0] dark:border-[#273449] bg-[#FFFFFF] dark:bg-[#172033] p-5 shadow-xs"
            >
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#172033] dark:text-[#F8FAFC] mb-3">
                Parameters Analyzed in Inference
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {factors.map((factor) => {
                  const Icon = factor.icon;
                  const TrendIcon = getTrendIcon(factor.trend);

                  return (
                    <div
                      key={factor.name}
                      className={`rounded-xl border p-3.5 transition-colors ${getFactorTone(factor.status)}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Icon className="h-4 w-4" />
                          <span>{factor.name}</span>
                        </div>
                        <span className="inline-flex items-center text-[11px] font-bold capitalize">
                          <TrendIcon className="mr-0.5 h-3 w-3" />
                          {factor.status}
                        </span>
                      </div>
                      <div className="text-lg font-black">{factor.value}</div>
                      <p className="text-[11px] opacity-80 mt-1 leading-snug">{factor.description}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
