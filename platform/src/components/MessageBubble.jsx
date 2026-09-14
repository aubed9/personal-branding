import React from "react";
import { User, Bot } from "lucide-react";

export default function MessageBubble({ message }) {
  const isUser = message.sender === "user";

  const renderFormattedText = (content) => {
    if (!content) return null;
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Bullet items
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const bulletText = line.trim().substring(2);
        return (
          <div key={idx} className="flex items-start gap-3 my-2 text-zinc-200">
            <span className="w-1.5 h-1.5 rounded-sm bg-blue-500 mt-2.5 shrink-0 shadow-cobalt-sm" />
            <span className="text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletText) }} />
          </div>
        );
      }
      // Blank lines
      if (!line.trim()) {
        return <div key={idx} className="h-2.5" />;
      }
      // Normal line
      return (
        <p
          key={idx}
          className="text-xs sm:text-sm leading-relaxed my-1 text-zinc-200"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
        />
      );
    });
  };

  const formatInlineMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black underline decoration-blue-500/50 underline-offset-4">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-[#050508] text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
  };

  if (isUser) {
    return (
      <div className="flex justify-start my-4 w-full">
        <div className="max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 bg-[#121216] border border-white/[0.14] shadow-glass">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 hairline-b text-zinc-400 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white">ورودی استراتژیک بنیان‌گذار</span>
            </div>
            <span>{message.timestamp || "اکنون"}</span>
          </div>
          <div className="text-white text-xs sm:text-sm leading-relaxed">
            {renderFormattedText(message.text)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-4 w-full">
      <div className="w-full rounded-2xl p-5 sm:p-6 obsidian-card shadow-glass">
        {/* Dossier Card Header */}
        <div className="flex items-center justify-between pb-3 mb-3 hairline-b">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-black border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-cobalt-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-white tracking-tight">
                موتور هوش استراتژیک دیجیتال مارکت
              </span>
              <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full mr-2 font-mono">
                تحلیل سیستماتیک
              </span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
            {message.timestamp || "اکنون"}
          </span>
        </div>

        {/* Message Body */}
        <div className="space-y-1.5">
          {renderFormattedText(message.text)}
        </div>
      </div>
    </div>
  );
}
