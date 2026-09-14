import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import QuickOptions from "./QuickOptions";
import { Sparkles, Award, ArrowLeft, FileText, Bot, ShieldCheck } from "lucide-react";
import { PHASES_DATA } from "../data/phase1Templates";

export default function ChatContainer({
  messages,
  currentQuestion,
  isTyping,
  onSelectOption,
  onUnknownSelect,
  currentPhase = 1,
  completedPhases = {},
  onStartNextPhase,
  onOpenDeliverable,
  onOpenGuildSelector = null
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, currentQuestion]);

  const isCurrentCompleted = completedPhases[currentPhase];
  const hasNextPhase = currentPhase < 8;
  const nextPhaseMeta = PHASES_DATA.find(p => p.id === currentPhase + 1);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-6 space-y-5 max-w-4xl mx-auto w-full">
      {/* Executive Session Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl obsidian-card shadow-glass text-center space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>میز کار هوش استراتژیک هویت و برند • فاز {currentPhase}</span>
        </div>
        <h2 className="font-black text-white text-base sm:text-lg tracking-tight">
          {PHASES_DATA.find(p => p.id === currentPhase)?.title || `فاز ${currentPhase}`}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          {PHASES_DATA.find(p => p.id === currentPhase)?.description}
        </p>
      </div>

      {/* Messages List */}
      <div className="space-y-1">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* AI Precision Processing Indicator */}
      {isTyping && (
        <div className="flex items-center gap-3 my-4">
          <div className="w-8 h-8 rounded-xl bg-black border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-cobalt-sm">
            <Bot className="w-4 h-4 animate-spin" />
          </div>
          <div className="obsidian-card rounded-2xl px-4 py-3 text-xs text-zinc-300 flex items-center gap-2 shadow-glass">
            <span className="font-mono">در حال تحلیل متقابل و تدوین مواضع بر اساس ۱۶۵ منبع مرجع...</span>
            <span className="flex gap-1 mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
            </span>
          </div>
        </div>
      )}

      {/* Quick Interactive Options */}
      {!isTyping && currentQuestion && currentQuestion.options && (
        <div className="my-4">
          <QuickOptions
            options={currentQuestion.options}
            visionAnchor={currentQuestion.visionAnchor}
            onSelectOption={onSelectOption}
            onUnknownSelect={onUnknownSelect}
            disabled={isTyping}
            onOpenGuildSelector={onOpenGuildSelector}
            showGuildSelector={currentQuestion.id === "step0_description"}
          />
        </div>
      )}

      {/* Boardroom Milestone Card: Phase Completed & Next Phase Transition */}
      {!isTyping && isCurrentCompleted && hasNextPhase && nextPhaseMeta && (
        <div className="my-6 p-6 rounded-2xl obsidian-card border border-white/20 shadow-glass space-y-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-white-subtle shrink-0">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm sm:text-base">
                فاز {currentPhase} با موفقیت تصویب و در دوسیه راهبردی ثبت شد ✔️
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                سند رسمی این مرحله صادر گردید. جهت ورود به مرحله بعدی روی کلید زیر کلیک فرمایید:
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={onStartNextPhase}
              className="flex-1 py-3 px-5 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-white-subtle transition-all active:scale-[0.98]"
            >
              <span>ورود به {nextPhaseMeta.title}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenDeliverable(currentPhase)}
              className="py-3 px-4 rounded-xl obsidian-card obsidian-card-hover text-zinc-200 text-xs font-bold flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>مشاهده و دریافت سند رسمی فاز {currentPhase}</span>
            </button>
          </div>
        </div>
      )}

      {/* Grand Finale Card: All 8 Phases Completed */}
      {!isTyping && isCurrentCompleted && currentPhase === 8 && (
        <div className="my-8 p-7 rounded-3xl obsidian-surface border-2 border-white/30 shadow-glass space-y-5 max-w-2xl mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-blue-600/20 blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-black mx-auto shadow-white-subtle relative z-10">
            <Award className="w-7 h-7 text-blue-600" />
          </div>
          <div className="relative z-10">
            <h3 className="font-black text-white text-base sm:text-xl tracking-tight">
              فرآیند جامع پرسونال برندینگ با موفقیت ۱۰۰٪ نهایی گردید 🏆
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1.5 max-w-lg mx-auto leading-relaxed">
              تمامی ۸ سند راهبردی، شاخص‌های تصمیم‌گیری و ماشین اجرای تجاری در قالب کتابچه جامع استراتژی گردآوری شده‌اند:
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 relative z-10">
            <button
              onClick={() => onOpenDeliverable("master")}
              className="py-3.5 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-white-subtle active:scale-[0.98] transition-all"
            >
              <Award className="w-5 h-5 text-blue-600" />
              <span>مشاهده و دانلود کتابچه جامع (Master Brand Book)</span>
            </button>

            <button
              onClick={() => onOpenDeliverable(8)}
              className="py-3 px-5 rounded-xl obsidian-card obsidian-card-hover text-zinc-200 text-xs font-bold flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>دانلود سند فاز ۸</span>
            </button>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
