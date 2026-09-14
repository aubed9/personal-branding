import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSendMessage, disabled, placeholder }) {
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex items-end gap-2.5 bg-[#0d0d12]/95 border border-white/[0.12] focus-within:border-blue-500/80 focus-within:ring-4 focus-within:ring-blue-500/15 rounded-2xl p-2 sm:p-2.5 shadow-glass transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputText}
          disabled={disabled}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "پاسخ یا تحلیل خود را بنویسید یا از گزینه‌های بالا انتخاب کنید..."}
          className="flex-1 bg-transparent text-white placeholder-zinc-500 text-xs sm:text-sm px-3 py-2 resize-none outline-none leading-relaxed max-h-36 min-h-[42px]"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || disabled}
          className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-cobalt-glow disabled:opacity-30 disabled:cursor-not-allowed shrink-0 active:scale-95 flex items-center justify-center"
          title="ثبت و ارسال تصمیم (Enter)"
        >
          <Send className="w-4 h-4 rotate-180" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-500 px-3 pt-2 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
          <span>پایش و ساختاردهی خودکار مبتنی بر فریم‌ورک‌های مرجع</span>
        </span>
        <span className="hidden sm:inline text-zinc-600">Enter ارسال • Shift + Enter سطر جدید</span>
      </div>
    </form>
  );
}
