import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldAlert,
  Cpu,
  HeartPulse,
  Users,
  Code,
  BrainCircuit,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  ArrowLeft,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const teamMembers = [
    { name: "Risham Soni", role: "React Engineer", initials: "RS", color: "bg-[#14B87A]" },
    { name: "Khushi Suryawanshi", role: "AI/ML Engineer", initials: "KS", color: "bg-[#0F766E]" },
    { name: "Vaishnavi Kumari", role: "AI/ML Engineer", initials: "VK", color: "bg-[#0F9F69]" },
    { name: "Sumit Kumar", role: "React Engineer", initials: "SK", color: "bg-[#15803D]" },
  ];

  const techStack = [
    { name: "React 19", category: "Frontend" },
    { name: "Tailwind CSS v4", category: "Styling" },
    { name: "Redux Toolkit", category: "State Management" },
    { name: "Firebase", category: "Auth & Firestore" },
    { name: "Recharts & Chart.js", category: "Data Visualization" },
    { name: "Python / ML API", category: "Prediction Engine" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] py-8 px-4 sm:px-6 md:px-10 font-sans transition-colors">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto space-y-10"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="space-y-3 relative pb-2 border-b border-[#E2E8F0] dark:border-[#273449]">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#14B87A] dark:text-[#35D39A] hover:text-[#0F9F69] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
            </Link>
            <ThemeToggle size="sm" />
          </div>

          <div className="text-center pt-2">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#E8F8F2] dark:bg-[#14B87A]/20 text-[#0F9F69] dark:text-[#35D39A] border border-[#A8E3CF] dark:border-[#14B87A]/40 mb-3 shadow-xs">
              <BrainCircuit className="w-8 h-8 text-[#14B87A]" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
              Early Sepsis Risk Prediction Platform
            </h1>
            <p className="text-[#526174] dark:text-[#94A3B8] text-xs sm:text-sm max-w-2xl mx-auto mt-2 leading-relaxed">
              Clinical decision-support system applying machine learning to proactively detect sepsis biomarkers and alert care teams before rapid physiological deterioration.
            </p>
          </div>
        </motion.div>

        {/* Section 1 & 2: What & Why (Grid) */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card: What is Sepsis */}
          <div className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center mb-3">
              <div className="p-2.5 rounded-xl bg-[#FEF2F2] dark:bg-[#2A1517] text-[#DC2626] dark:text-[#F87171] border border-[#F5B5B5] dark:border-[#4C1D24] mr-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#172033] dark:text-[#F8FAFC]">What is Sepsis?</h2>
            </div>
            <p className="text-[#526174] dark:text-[#CBD5E1] text-xs sm:text-sm leading-relaxed">
              Sepsis is a medical emergency caused by the body's dysregulated response to an infection. It damages tissues and organs, standing as one of the leading causes of inpatient mortality without prompt identification and targeted antimicrobial therapy.
            </p>
          </div>

          {/* Card: Why Early Prediction */}
          <div className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center mb-3">
              <div className="p-2.5 rounded-xl bg-[#ECFDF3] dark:bg-[#102419] text-[#15803D] dark:text-[#34D399] border border-[#BBE7C8] dark:border-[#1E432E] mr-3">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#172033] dark:text-[#F8FAFC]">Why Early Prediction?</h2>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { text: "Prevents irreversible multiple organ dysfunction syndrome", icon: ShieldAlert, color: "text-[#B45309]" },
                { text: "Significantly decreases ICU admission duration and mortality", icon: Activity, color: "text-[#DC2626]" },
                { text: "Accelerates targeted antibiotic administration within the golden hour", icon: Stethoscope, color: "text-[#14B87A]" },
              ].map((item, i) => (
                <li key={i} className="flex items-start text-[#526174] dark:text-[#CBD5E1]">
                  <item.icon className={`w-4 h-4 mr-2 mt-0.5 shrink-0 ${item.color}`} />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Section 3 & 4: How AI Works & Key Features */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card: How AI Works */}
          <div className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center mb-4">
              <div className="p-2.5 rounded-xl bg-[#E8F8F2] dark:bg-[#14B87A]/20 text-[#0F9F69] dark:text-[#35D39A] border border-[#A8E3CF] dark:border-[#14B87A]/40 mr-3">
                <Cpu className="w-5 h-5 text-[#14B87A]" />
              </div>
              <h2 className="text-lg font-bold text-[#172033] dark:text-[#F8FAFC]">Predictive Pipeline</h2>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449]">
                <h3 className="font-bold text-[#172033] dark:text-[#F8FAFC]">1. Real-time Telemetry</h3>
                <p className="text-[#526174] dark:text-[#94A3B8] mt-0.5">Captures heart rate, arterial pressure, temperature, WBC, oxygen saturation, and glucose.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449]">
                <h3 className="font-bold text-[#172033] dark:text-[#F8FAFC]">2. Microservice Inference</h3>
                <p className="text-[#526174] dark:text-[#94A3B8] mt-0.5">Evaluates complex non-linear clinical feature combinations via remote REST API endpoint.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449]">
                <h3 className="font-bold text-[#172033] dark:text-[#F8FAFC]">3. Explainable AI Scoring</h3>
                <p className="text-[#526174] dark:text-[#94A3B8] mt-0.5">Generates probability risk rating with biomarker weight contributions for clinical transparency.</p>
              </div>
            </div>
          </div>

          {/* Card: Key Features */}
          <div className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center mb-4">
              <div className="p-2.5 rounded-xl bg-[#E8F8F2] dark:bg-[#14B87A]/20 text-[#0F9F69] dark:text-[#35D39A] border border-[#A8E3CF] dark:border-[#14B87A]/40 mr-3">
                <CheckCircle2 className="w-5 h-5 text-[#14B87A]" />
              </div>
              <h2 className="text-lg font-bold text-[#172033] dark:text-[#F8FAFC]">Core Capabilities</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Early Prediction", desc: "Flags physiological deviation hours before severe shock.", icon: Clock, color: "text-[#B45309]" },
                { title: "Live Ward Telemetry", desc: "Centralized doctor dashboard with patient acuity queues.", icon: Activity, color: "text-[#DC2626]" },
                { title: "Transparent XAI", desc: "Biomarker contribution charts to avoid black-box mistrust.", icon: BrainCircuit, color: "text-[#14B87A]" },
                { title: "Specialist Chat", desc: "Instant clinical consultation channel for rapid triage.", icon: ShieldAlert, color: "text-[#0F766E]" },
              ].map((feature, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449]">
                  <feature.icon className={`w-4 h-4 mb-1.5 ${feature.color}`} />
                  <h3 className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC]">{feature.title}</h3>
                  <p className="text-[11px] text-[#526174] dark:text-[#94A3B8] mt-0.5 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Section 5 & 6: Team & Tech Stack */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
          {/* Team */}
          <div className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center mb-4">
              <div className="p-2.5 rounded-xl bg-[#E8F8F2] dark:bg-[#14B87A]/20 text-[#0F9F69] dark:text-[#35D39A] border border-[#A8E3CF] dark:border-[#14B87A]/40 mr-3">
                <Users className="w-5 h-5 text-[#14B87A]" />
              </div>
              <h2 className="text-lg font-bold text-[#172033] dark:text-[#F8FAFC]">Engineering Team</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teamMembers.map((member, i) => (
                <div key={i} className="flex items-center p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449]">
                  <div className={`w-9 h-9 rounded-full ${member.color} text-white flex items-center justify-center font-bold text-xs mr-3 shrink-0`}>
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC] truncate">{member.name}</h3>
                    <p className="text-[11px] text-[#526174] dark:text-[#94A3B8] truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center mb-4">
              <div className="p-2.5 rounded-xl bg-[#E8F8F2] dark:bg-[#14B87A]/20 text-[#0F9F69] dark:text-[#35D39A] border border-[#A8E3CF] dark:border-[#14B87A]/40 mr-3">
                <Code className="w-5 h-5 text-[#14B87A]" />
              </div>
              <h2 className="text-lg font-bold text-[#172033] dark:text-[#F8FAFC]">Technology Stack</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <div key={i} className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449] text-xs">
                  <span className="font-bold text-[#172033] dark:text-[#F8FAFC] block">{tech.name}</span>
                  <span className="text-[10px] text-[#7A8798] dark:text-[#94A3B8] uppercase tracking-wider block">{tech.category}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
