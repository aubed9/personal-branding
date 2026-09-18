import React from "react";
import { Check, AlertTriangle } from "lucide-react";

export const PHASES_CONFIG = [
  { id: 1, shortTitle: "بنیاد", title: "فاز ۱: بنیاد کسب‌وکار" },
  { id: 2, shortTitle: "تحقیقات", title: "فاز ۲: هوش بازار و مخاطب" },
  { id: 3, shortTitle: "استراتژی", title: "فاز ۳: جهت‌گیری استراتژیک" },
  { id: 4, shortTitle: "هویت", title: "فاز ۴: شخصیت و روان‌شناسی برند" },
  { id: 5, shortTitle: "پیام", title: "فاز ۵: کلامی و روایت برند" },
  { id: 6, shortTitle: "نام‌گذاری", title: "فاز ۶: نام و شعار سازمانی" },
  { id: 7, shortTitle: "بصری", title: "فاز ۷: نظام هویت بصری" },
  { id: 8, shortTitle: "فعال‌سازی", title: "فاز ۸: ماشین اجرایی و اعتبار" }
];

export default function PhaseProgressRail({
  currentPhase = 1,
  completedPhases = {},
  phaseStatus = {},
  onSelectPhase,
  canNavigateBack = true
}) {
  return (
    <div className="w-full bg-[#050505] border-b border-white/10 px-3 sm:px-6 py-2 overflow-x-auto select-none no-scrollbar">
      <div className="flex items-center justify-between min-w-[640px] max-w-5xl mx-auto gap-1 sm:gap-2">
        {PHASES_CONFIG.map((phase) => {
          const isCurrent = currentPhase === phase.id;
          const isCompleted = Boolean(completedPhases[phase.id]);
          const isInvalidated = phaseStatus[phase.id] === "INVALIDATED";
          const isClickable = isCompleted || isCurrent || (phase.id < currentPhase && canNavigateBack);

          return (
            <button
              key={phase.id}
              disabled={!isClickable}
              onClick={() => isClickable && onSelectPhase && onSelectPhase(phase.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-mono transition-all border ${
                isCurrent
                  ? "bg-white text-black font-bold border-white shadow-sm"
                  : isCompleted
                  ? "bg-[#111111] text-zinc-200 border-white/20 hover:border-white/40"
                  : isInvalidated
                  ? "bg-[#140a0a] text-zinc-300 border-dashed border-red-500/50"
                  : "bg-transparent text-zinc-600 border-transparent cursor-not-allowed"
              }`}
              title={phase.title}
            >
              <span className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] shrink-0 font-mono">
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                ) : isInvalidated ? (
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                ) : (
                  <span>{phase.id}</span>
                )}
              </span>

              <span className="truncate hidden md:inline">{phase.shortTitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
