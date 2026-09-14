import React from "react";
import { Menu, FileDown, BookOpen, Award, ArrowLeft, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";
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
  onOpenGuildSelector = null
}) {
  const isCurrentCompleted = completedPhases[currentPhase];
  const allCompleted = Object.values(completedPhases).filter(Boolean).length >= 8;
  const currentPhaseMeta = PHASES_DATA.find(p => p.id === currentPhase) || PHASES_DATA[0];

  return (
    <header className="h-16 hairline-b bg-black/85 backdrop-blur-2xl px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-[#121216] rounded-xl transition-colors border border-white/[0.08]"
          aria-label="باز کردن منو"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-cobalt-sm"></span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                رادار تصمیم‌گیری • مرحله {currentPhase} از ۸
              </span>
              <span className="text-[10px] text-zinc-600 hidden md:inline">•</span>
              <span className="text-[10px] text-zinc-400 hidden md:inline font-mono">
                ۱۶۵ منبع فعال
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs sm:text-sm font-black text-white tracking-tight">
                {currentPhaseMeta.title}
              </span>
              {isCurrentCompleted ? (
                <span className="text-[10px] bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-blue-400" /> مصوب و تایید شد
                </span>
              ) : (
                <span className="text-[10px] bg-blue-950/60 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-bold">
                  تحلیل و ثبت مواضع
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Next Phase Quick Button */}
        {isCurrentCompleted && currentPhase < 8 && (
          <button
            onClick={onStartNextPhase}
            className="flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black shadow-white-subtle transition-all active:scale-95"
          >
            <span>ورود به فاز {currentPhase + 1}</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Master Brand Book button if all completed */}
        {allCompleted && (
          <button
            onClick={() => onOpenDeliverable("master")}
            className="flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl bg-white text-black hover:bg-zinc-100 shadow-white-subtle border border-white transition-all active:scale-95"
          >
            <Award className="w-4 h-4 text-blue-600" />
            <span>کتابچه جامع استراتژی</span>
          </button>
        )}

        {/* 753 Guilds Catalog Button */}
        {onOpenGuildSelector && (
          <button
            onClick={onOpenGuildSelector}
            className="hidden sm:flex items-center gap-1.5 text-xs obsidian-card obsidian-card-hover text-blue-300 hover:text-white px-3 py-2 rounded-xl border border-blue-500/30 font-mono"
            title="کاتالوگ و جستجوی جامع ۷۵۳ صنف"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold">۷۵۳ صنف</span>
          </button>
        )}

        {/* Marketing Wiki Button */}
        <button
          onClick={onOpenWiki}
          className="hidden md:flex items-center gap-1.5 text-xs obsidian-card obsidian-card-hover text-zinc-200 hover:text-white px-3 py-2 rounded-xl"
          title="پایگاه ۱۶۵ منبع و فریم‌ورک‌های تصمیم‌گیری بازاریابی"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold">پایگاه دانش</span>
        </button>

        {/* Deliverable button */}
        <button
          onClick={() => onOpenDeliverable(currentPhase)}
          className={`flex items-center gap-2 text-xs font-black px-3.5 py-2 rounded-xl transition-all ${
            isCurrentCompleted
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-cobalt-glow border border-blue-400/50"
              : "obsidian-card obsidian-card-hover text-zinc-300"
          }`}
        >
          <FileDown className="w-4 h-4 text-blue-300" />
          <span className="hidden sm:inline">سند رسمی فاز {currentPhase}</span>
          <span className="sm:hidden">سند {currentPhase}</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-zinc-400 hover:text-white obsidian-card obsidian-card-hover rounded-xl"
          title="تنظیمات سامانه و اتصال مدل"
        >
          <ShieldCheck className="w-4 h-4 text-zinc-300" />
        </button>
      </div>
    </header>
  );
}
