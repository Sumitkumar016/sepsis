import { Bot, Stethoscope } from "lucide-react";

export default function ChatBubble({ message, doctorName }) {
  const isBot = message.sender === "bot";

  return (
    <div className={`flex w-full ${isBot ? "justify-start" : "justify-end"}`}>
      <div className={`flex max-w-[85%] items-end gap-2.5 md:max-w-[70%] ${isBot ? "" : "flex-row-reverse"}`}>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-xs ${
            isBot
              ? "bg-[#14B87A] text-white"
              : "bg-[#E2E8F0] dark:bg-[#273449] text-[#172033] dark:text-[#F8FAFC]"
          }`}
        >
          {isBot ? <Bot className="h-4.5 w-4.5" /> : <Stethoscope className="h-4.5 w-4.5" />}
        </div>

        <div
          className={`rounded-2xl px-3.5 py-2.5 shadow-xs text-xs sm:text-sm ${
            isBot
              ? "rounded-bl-xs bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#273449] text-[#172033] dark:text-[#F8FAFC]"
              : "rounded-br-xs bg-[#14B87A] text-white"
          }`}
        >
          <p
            className={`mb-1 text-[10px] font-bold uppercase tracking-wider ${
              isBot ? "text-[#0F9F69] dark:text-[#35D39A]" : "text-white/80"
            }`}
          >
            {isBot ? doctorName : "You"}
          </p>
          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        </div>
      </div>
    </div>
  );
}
