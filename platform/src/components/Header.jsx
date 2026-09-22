import React from "react";
import { 
  Menu, 
  FileDown, 
  BookOpen, 
  Award, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Building2,
  Layers
} from "lucide-react";
import { PHASES_DATA } from "../data/phase1Templates";

export default function Header({
  onToggleSidebar,
  currentPhase = 1,
  completedPhases = {},
  onOpenDeliverable,
  onOpenSettings,
  onOpenWiki,
  onStartNextPhase,
  engineMode = "simulator",
  onOpenGuildSelector = null,
  activeGuildTitle = null
}) {
  const isCurrentCompleted = Boolean(completedPhases[currentPhase]);
  const allCompleted = Object.values(completedPhases).filter(Boolean).length >= 8;
  const currentPhaseMeta = PHASES_DATA.find(p => p.id === currentPhase) || PHASES_DATA[0];

  return (
    <header className="h-14 sm:h-16 border-b border-white/10 bg-[#000000] px-3 sm:px-6 flex items-center justify-between shrink-0 select-text text-white z-20">
      
      {/* Left: Sidebar Toggle + Brand Title + Phase Meta */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-white/10"
          aria-label="نمایش منوی فازها"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-mono font-black text-xs">
            DM
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                فضای تدوین برند • فاز {currentPhase} از ۸
              </span>
              {activeGuildTitle && (
                <>
                  <span className="text-[10px] text-zinc-600 hidden sm:inline">•</span>
                  <span className="text-[10px] text-zinc-300 hidden sm:inline font-mono truncate max-w-[140px]">
                    {activeGuildTitle}
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs sm:text-sm font-black text-white tracking-tight">
                {currentPhaseMeta.title}
              </span>
              {isCurrentCompleted ? (
                <span className="text-[9px] bg-white text-black font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> مصوب شد
                </span>
              ) : (
                <span className="text-[9px] bg-white/10 text-zinc-300 border border-white/20 px-2 py-0.5 rounded font-mono">
                  در حال ارزیابی
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Action Buttons (Monochrome, no color accents) */}
      <div className="flex items-center gap-2">
        
        {/* Next Phase CTA if current phase completed */}
        {isCurrentCompleted && currentPhase < 8 && (
          <button
            onClick={onStartNextPhase}
            className="flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black transition-all shadow-md active:scale-95"
          >
            <span>ورود به فاز {currentPhase + 1}</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Master Deliverable button if all completed */}
        {allCompleted && (
          <button
            onClick={() => onOpenDeliverable("master")}
            className="flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 border border-white transition-all active:scale-95"
          >
            <Award className="w-4 h-4 text-black" />
            <span>کتابچه جامع استراتژی</span>
          </button>
        )}

        {/* 753 Guild Selector Trigger */}
        {onOpenGuildSelector && (
          <button
            onClick={onOpenGuildSelector}
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white px-3 py-2 rounded-xl border border-white/15 hover:border-white/30 bg-[#0C0C0C] font-mono transition-all"
            title="انتخاب و جستجو در فهرست ۷۵۳ صنف"
          >
            <Building2 className="w-3.5 h-3.5 text-white" />
            <span>۷۵۳ صنف</span>
          </button>
        )}

        {/* Knowledge Wiki Trigger */}
        <button
          onClick={onOpenWiki}
          className="hidden md:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white px-3 py-2 rounded-xl border border-white/15 hover:border-white/30 bg-[#0C0C0C] transition-all"
          title="پایگاه دانش برندینگ و بازاریابی"
        >
          <BookOpen className="w-3.5 h-3.5 text-white" />
          <span>پایگاه دانش</span>
        </button>

        {/* Deliverable Modal Trigger */}
        <button
          onClick={() => onOpenDeliverable(currentPhase)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all border ${
            isCurrentCompleted
              ? "bg-white text-black border-white shadow-sm"
              : "bg-[#0C0C0C] hover:bg-[#141414] text-zinc-300 hover:text-white border-white/15 hover:border-white/30"
          }`}
          title="مشاهده پیش‌نویس یا سند رسمی فاز"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">سند فاز {currentPhase}</span>
        </button>

        {/* Settings Modal Trigger */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-zinc-400 hover:text-white rounded-xl border border-white/15 hover:border-white/30 bg-[#0C0C0C] transition-all"
          title="تنظیمات سیستم و کلید ارتباطی"
        >
          <ShieldCheck className="w-4 h-4 text-zinc-300" />
        </button>
      </div>

    </header>
  );
}
