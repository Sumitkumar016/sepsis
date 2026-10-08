import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Bot, Send, ShieldAlert, Stethoscope } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ChatBubble from "../components/ChatBubble";
import ThemeToggle from "../components/ThemeToggle";

const INITIAL_MESSAGE = "Hello 👋 I'm your Sepsis Assistant. Tell me your symptoms or latest vital readings.";

const buildAvatar = (name, from = "#14B87A", to = "#0F9F69") => {
  const cleanedName = name.replace(/^Dr\.?\s*/i, "").trim();
  const initials = cleanedName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="chat-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="40" fill="url(#chat-bg)" />
      <circle cx="80" cy="58" r="24" fill="rgba(255,255,255,0.18)" />
      <path d="M40 130c4-22 22-36 40-36s36 14 40 36" fill="rgba(255,255,255,0.18)" />
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#ffffff">
        ${initials || "DR"}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const DEFAULT_DOCTOR = {
  id: "default-sepsis-doctor",
  name: "On-Call Specialist",
  experience: "24/7 availability",
  avatar: buildAvatar("On-Call Specialist"),
};

const getBotReply = (message) => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("fever") || normalizedMessage.includes("temp")) {
    return "Fever (>38°C) or hypothermia (<36°C) can be an early biomarker of sepsis. If accompanied by confusion or rapid breathing, seek immediate medical care.";
  }

  if (normalizedMessage.includes("heart") || normalizedMessage.includes("pulse")) {
    return "Tachycardia (heart rate > 90 bpm) combined with low blood pressure is a significant clinical flag for sepsis.";
  }

  if (normalizedMessage.includes("oxygen") || normalizedMessage.includes("breath")) {
    return "Low oxygen saturation (< 92%) or high respiratory rate (> 20/min) indicates respiratory distress and potential sepsis.";
  }

  if (normalizedMessage.includes("infection") || normalizedMessage.includes("wound")) {
    return "Untreated localized infections (urinary, lung, abdominal, skin) can rapidly progress to sepsis. Consult a physician promptly.";
  }

  return "Thank you for sharing. For accurate risk assessment, monitor heart rate, temperature, BP, and oxygen. If you notice rapid breathing, dizziness, or fever with chills, request emergency care.";
};

const formatDoctorName = (name = "") => {
  const cleaned = name.trim();
  return cleaned.startsWith("Dr.") ? cleaned : `Dr. ${cleaned}`;
};

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const endOfMessagesRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: "initial-bot-message",
      sender: "bot",
      text: INITIAL_MESSAGE,
    },
  ]);
  const [input, setInput] = useState("");

  const doctor = useMemo(() => {
    if (location.state && typeof location.state === "object" && "name" in location.state) {
      return {
        ...DEFAULT_DOCTOR,
        ...location.state,
        avatar: location.state.avatar || buildAvatar(location.state.name),
      };
    }
    return DEFAULT_DOCTOR;
  }, [location.state]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmedMessage = input.trim();
    if (!trimmedMessage) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmedMessage,
    };

    const botMessage = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: getBotReply(trimmedMessage),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage, botMessage]);
    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const displayName =
    formatDoctorName(doctor.name) !== "Dr. On-Call Specialist"
      ? formatDoctorName(doctor.name)
      : "Sepsis On-Call Assistant";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#172033] dark:text-[#F8FAFC] px-3 py-5 sm:px-6 md:px-8 transition-colors">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E2E8F0] dark:border-[#273449]">
          <div>
            <Link
              to="/doctor-consultant"
              className="mb-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#14B87A] dark:text-[#35D39A] hover:text-[#0F9F69] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Consultants
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172033] dark:text-[#F8FAFC]">
              Consulting {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-[#526174] dark:text-[#94A3B8] mt-0.5">
              Interactive sepsis guidance for symptom evaluation and clinical urgency cues.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => navigate("/doctor-consultant")}
              className="inline-flex items-center justify-center rounded-xl border border-[#E2E8F0] dark:border-[#273449] bg-[#FFFFFF] dark:bg-[#172033] px-3.5 py-1.5 text-xs font-semibold text-[#526174] dark:text-[#CBD5E1] shadow-xs hover:border-[#14B87A] dark:hover:border-[#35D39A] cursor-pointer"
            >
              View Specialists
            </button>
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* Chat Card */}
        <section className="overflow-hidden rounded-2xl bg-[#FFFFFF] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] shadow-xs">
          {/* Doctor Header Banner */}
          <div className="border-b border-[#E2E8F0] dark:border-[#273449] px-4 py-3.5 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-[#E8F8F2] dark:ring-[#14B87A]/30"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">{displayName}</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F8F2] dark:bg-[#14B87A]/20 border border-[#A8E3CF] dark:border-[#14B87A]/40 px-2 py-0.5 text-[10px] font-bold text-[#0F9F69] dark:text-[#35D39A]">
                      <ShieldAlert className="h-3 w-3" />
                      Sepsis Specialist
                    </span>
                  </div>
                  <p className="text-xs text-[#526174] dark:text-[#94A3B8]">{doctor.experience}</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449] px-3 py-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#172033] dark:text-[#CBD5E1]">
                  <Stethoscope className="h-3.5 w-3.5 text-[#14B87A]" />
                  Active Session
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_260px]">
            {/* Messages Area */}
            <div className="flex min-h-[480px] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto bg-[#F8FAFC]/70 dark:bg-[#0B1220]/70 p-4 sm:p-5">
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} doctorName={displayName} />
                ))}
                <div ref={endOfMessagesRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-[#E2E8F0] dark:border-[#273449] bg-[#FFFFFF] dark:bg-[#172033] p-3 sm:p-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <textarea
                      id="chat-message"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={2}
                      placeholder="Describe sepsis-related symptoms, vitals, or concerns..."
                      className="w-full resize-none rounded-xl border border-[#CBD5E1] dark:border-[#273449] bg-[#FFFFFF] dark:bg-[#1E293B] px-3.5 py-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] outline-none placeholder:text-[#94A3B8] focus:border-[#14B87A] focus:ring-1 focus:ring-[#14B87A]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSend}
                    className="inline-flex h-10 w-10 sm:h-11 sm:w-11 mb-1 shrink-0 items-center justify-center rounded-xl bg-[#14B87A] hover:bg-[#0F9F69] text-white shadow-xs transition active:scale-95 cursor-pointer"
                    aria-label="Send message"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Prompts Sidebar */}
            <aside className="border-t border-[#E2E8F0] dark:border-[#273449] bg-[#FFFFFF] dark:bg-[#172033] p-4 lg:border-l lg:border-t-0 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="rounded-xl bg-gradient-to-br from-[#14B87A] to-[#0F766E] p-4 text-white shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
                    <Bot className="h-3.5 w-3.5" />
                    Clinical Guidance
                  </div>
                  <p className="mt-2 text-xs font-semibold leading-relaxed">
                    Escalate immediately if heart rate &gt; 90 bpm, temp &gt; 38°C, or SpO2 &lt; 92%.
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8798] dark:text-[#94A3B8]">
                    Quick Prompts
                  </p>
                  <div className="mt-2 space-y-2">
                    {[
                      "I have fever and infection",
                      "My heart rate is high (110 bpm)",
                      "Low oxygen reading with chills",
                      "What are early signs of sepsis?",
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setInput(prompt)}
                        className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#273449] bg-[#F8FAFC] dark:bg-[#1E293B] p-2.5 text-left text-xs font-medium text-[#526174] dark:text-[#CBD5E1] hover:border-[#A8E3CF] dark:hover:border-[#14B87A]/50 hover:text-[#0F9F69] dark:hover:text-[#35D39A] transition-colors cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
