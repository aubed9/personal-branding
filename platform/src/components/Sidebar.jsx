import React from "react";
import { 
  Compass, 
  Search, 
  Target, 
  Sparkles, 
  MessageSquareText, 
  Flame, 
  Palette, 
  TrendingUp,
  Lock, 
  CheckCircle2, 
  X,
  Layers,
  ArrowLeft,
  BookOpen,
  Award
} from "lucide-react";
import { PHASES_DATA } from "../data/phase1Templates";

const ICON_MAP = {
  Compass,
  Search,
  Target,
  Sparkles,
  MessageSquareText,
  Flame,
  Palette,
  TrendingUp
};

export default function Sidebar({
  isOpen,
  onClose,
  stats,
  currentPhase = 1,
  completedPhases = {},
  onOpenDeliverable,
  onOpenSettings,
  onOpenWiki,
  onReset,
  onStartNextPhase
}) {
  const isCurrentCompleted = completedPhases[currentPhase];
  const canGoNext = isCurrentCompleted && currentPhase < 8;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-md transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 right-0 z-50 h-full w-80 bg-[#08080a] hairline-l flex flex-col transition-transform duration-300 ease-in-out backdrop-blur-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header / Brand with Bespoke Insignia */}
        <div className="p-4 sm:p-5 hairline-b flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black border border-white/20 p-1.5 shadow-cobalt-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <path d="M12 4L19 12L12 20L5 12Z" fill="#2563eb" />
                <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <h1 className="font-black text-white text-base tracking-tight leading-tight">دیجیتال مارکت</h1>
              <p className="text-[10px] text-zinc-400 font-mono tracking-wide">سامانه جامع استراتژی و هویت</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive HUD Telemetry Bar */}
        <div className="p-3.5 hairline-b bg-black/70">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2 font-mono px-0.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>پایش دوسیه راهبردی</span>
            </span>
            <span className="text-blue-400 font-bold">
              {isCurrentCompleted ? `فاز ${currentPhase} تایید شد` : `تحلیل فاز ${currentPhase}`}
            </span>
          </div>

          <div className="grid grid-cols-4 rounded-xl obsidian-surface overflow-hidden divide-x divide-x-reverse divide-white/[0.08]">
            <div className="p-2 text-center" title="حقایق تایید شده">
              <span className="block text-white font-black text-sm font-mono">{stats.facts || 0}</span>
              <span className="text-[10px] text-zinc-400 font-medium">حقایق</span>
            </div>
            <div className="p-2 text-center bg-blue-950/20" title="تصمیمات راهبردی مصوب">
              <span className="block text-blue-400 font-black text-sm font-mono">{stats.decisions || 0}</span>
              <span className="text-[10px] text-blue-300 font-bold">تصمیم</span>
            </div>
            <div className="p-2 text-center" title="فرضیات باز">
              <span className="block text-zinc-300 font-black text-sm font-mono">{stats.assumptions || 0}</span>
              <span className="text-[10px] text-zinc-400 font-medium">فرضیه</span>
            </div>
            <div className="p-2 text-center bg-amber-950/20" title="مجهولات رسمی">
              <span className="block text-amber-400 font-black text-sm font-mono">{stats.unknowns || 0}</span>
              <span className="text-[10px] text-amber-400/90 font-bold">مجهول</span>
            </div>
          </div>
        </div>

        {/* Phase Transition Callout Button */}
        {canGoNext && (
          <div className="p-3 bg-blue-950/30 hairline-b text-center">
            <button
              onClick={onStartNextPhase}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-black flex items-center justify-center gap-1.5 shadow-white-subtle transition-all active:scale-[0.98]"
            >
              <span>ورود به فاز {currentPhase + 1}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Phases Roadmap Timeline (1 to 8) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 px-1 mb-2 font-mono uppercase tracking-wider">
            <span>نقشه راه مراحل ۸ گانه</span>
            <span className="text-zinc-600">۱۰۰٪ پوشش</span>
          </div>

          <div className="space-y-2 relative">
            {PHASES_DATA.map((phase) => {
              const Icon = ICON_MAP[phase.icon] || Compass;
              const pId = phase.id;

              const isCurrent = currentPhase === pId;
              const isCompleted = completedPhases[pId];
              const isUnlocked = isCompleted || isCurrent || completedPhases[pId - 1];

              return (
                <div
                  key={pId}
                  onClick={() => {
                    if (isCompleted) {
                      onOpenDeliverable(pId);
                    } else if (isUnlocked && !isCurrent && pId === currentPhase + 1 && completedPhases[currentPhase]) {
                      onStartNextPhase();
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all duration-200 relative ${
                    isCurrent
                      ? "bg-[#121217] border-blue-500/80 text-white shadow-cobalt-glow ring-1 ring-blue-500/40"
                      : isCompleted
                      ? "obsidian-surface text-zinc-200 cursor-pointer hover:border-white/20 hover:bg-[#121216]"
                      : isUnlocked
                      ? "bg-black/40 border-white/[0.05] text-zinc-400 cursor-pointer hover:bg-[#101014] hover:text-zinc-200"
                      : "bg-transparent border-transparent text-zinc-600 opacity-40 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 p-1.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isCurrent
                          ? "bg-blue-600 text-white shadow-cobalt-sm"
                          : isCompleted
                          ? "bg-white/10 text-white"
                          : isUnlocked
                          ? "bg-zinc-800/80 text-zinc-400"
                          : "bg-zinc-900 text-zinc-600"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs font-bold truncate text-white">{phase.title}</h3>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-white bg-white/10 px-1.5 py-0.5 rounded-full font-mono">
                            <CheckCircle2 className="w-3 h-3 text-blue-400" /> تایید
                          </span>
                        ) : isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-300 bg-blue-500/20 border border-blue-500/30 px-1.5 py-0.5 rounded-full font-mono font-bold">
                            فعال
                          </span>
                        ) : isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded-full font-mono">
                            آماده
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-zinc-600">
                            <Lock className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 hairline-t bg-black/60 space-y-2">
          <button
            onClick={onOpenWiki}
            className="w-full py-2.5 px-3 rounded-xl obsidian-card obsidian-card-hover text-zinc-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>پایگاه دانش ۱۶۵ منبع</span>
          </button>

          <button
            onClick={onReset}
            className="w-full py-2 px-3 rounded-xl bg-transparent hover:bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-white/[0.06] text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all"
          >
            <span>بازنشانی فرآیند از نقطه صفر</span>
          </button>
        </div>
      </aside>
    </>
  );
}
