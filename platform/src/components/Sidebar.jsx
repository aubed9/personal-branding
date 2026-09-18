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
  Check, 
  X,
  Layers,
  ArrowLeft,
  BookOpen,
  Award,
  ShieldCheck,
  RotateCcw
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
  onSelectPhase,
  onOpenDeliverable,
  onOpenSettings,
  onOpenWiki,
  onReset,
  onStartNextPhase
}) {
  const isCurrentCompleted = Boolean(completedPhases[currentPhase]);
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
        className={`fixed lg:static top-0 right-0 z-50 h-full w-80 bg-[#080808] border-l border-white/10 flex flex-col transition-transform duration-300 ease-in-out select-text text-white ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header / Brand Title */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0A0A0A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white text-black font-mono font-black text-sm flex items-center justify-center">
              DM
            </div>
            <div>
              <h1 className="font-black text-white text-sm tracking-tight leading-tight">دیجیتال مارکت</h1>
              <p className="text-[10px] text-zinc-400 font-mono tracking-wide">سامانه تخصصی تدوین استراتژی برند</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Counter */}
        <div className="p-3.5 border-b border-white/10 bg-[#0A0A0A] shrink-0">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2 font-mono px-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>پایش دوسیه برند</span>
            </span>
            <span className="text-zinc-200 font-bold">
              {isCurrentCompleted ? `فاز ${currentPhase} تایید شد` : `فاز ${currentPhase} جاری`}
            </span>
          </div>

          <div className="grid grid-cols-4 rounded-xl bg-[#111111] border border-white/10 divide-x divide-x-reverse divide-white/10 overflow-hidden">
            <div className="p-2 text-center" title="حقایق تایید شده">
              <span className="block text-white font-black text-xs sm:text-sm font-mono">{stats.facts || 0}</span>
              <span className="text-[10px] text-zinc-400">حقایق</span>
            </div>
            <div className="p-2 text-center" title="تصمیم‌های راهبردی">
              <span className="block text-white font-black text-xs sm:text-sm font-mono">{stats.decisions || 0}</span>
              <span className="text-[10px] text-zinc-400">تصمیم‌ها</span>
            </div>
            <div className="p-2 text-center" title="فرضیات">
              <span className="block text-white font-black text-xs sm:text-sm font-mono">{stats.assumptions || 0}</span>
              <span className="text-[10px] text-zinc-400">فرضیات</span>
            </div>
            <div className="p-2 text-center" title="مجهولات بحرانی">
              <span className="block text-white font-black text-xs sm:text-sm font-mono">{stats.unknowns || 0}</span>
              <span className="text-[10px] text-zinc-400">مجهولات</span>
            </div>
          </div>
        </div>

        {/* 8-Phase Navigation Tree */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            مراحل هشت‌گانه خلق برند
          </div>

          {PHASES_DATA.map((phase) => {
            const Icon = ICON_MAP[phase.icon] || Compass;
            const isCurrent = currentPhase === phase.id;
            const isCompleted = Boolean(completedPhases[phase.id]);
            const isLocked = phase.id > currentPhase && !isCompleted;

            return (
              <button
                key={phase.id}
                disabled={isLocked}
                onClick={() => {
                  if (onSelectPhase) {
                    onSelectPhase(phase.id);
                  } else {
                    onOpenDeliverable(phase.id);
                  }
                }}
                className={`w-full p-2.5 rounded-xl text-right transition-all flex items-center justify-between gap-3 border ${
                  isCurrent
                    ? "bg-white text-black font-bold border-white shadow-sm"
                    : isCompleted
                    ? "bg-[#111111] hover:bg-[#161616] text-zinc-200 border-white/15"
                    : "bg-transparent text-zinc-500 border-transparent hover:text-zinc-400 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    isCurrent ? "bg-black text-white" : isCompleted ? "bg-white/10 text-white" : "text-zinc-600"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate">{phase.title}</span>
                    </div>
                    <p className={`text-[10px] truncate ${isCurrent ? "text-zinc-700" : "text-zinc-400"}`}>
                      {phase.subtitle}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isCompleted ? (
                    <Check className={`w-4 h-4 stroke-[3] ${isCurrent ? "text-black" : "text-white"}`} />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-zinc-600" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-white/10 bg-[#0A0A0A] shrink-0 space-y-2">
          {canGoNext && (
            <button
              onClick={onStartNextPhase}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>ورود به فاز {currentPhase + 1}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={onOpenWiki}
              className="flex-1 py-2 px-2.5 rounded-lg border border-white/10 hover:border-white/25 text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>پایگاه دانش</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="py-2 px-2.5 rounded-lg border border-white/10 hover:border-white/25 text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center transition-colors"
              title="تنظیمات"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onReset}
              className="py-2 px-2.5 rounded-lg border border-white/10 hover:border-white/25 text-zinc-400 hover:text-white text-xs font-mono flex items-center justify-center transition-colors"
              title="شروع مجدد از فاز ۱"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
