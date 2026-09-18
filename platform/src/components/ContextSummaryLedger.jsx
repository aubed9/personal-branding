import React, { useState } from "react";
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Compass, 
  FileText,
  Tag,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export default function ContextSummaryLedger({
  businessContext,
  facts = [],
  decisions = [],
  unknowns = [],
  contradictions = [],
  currentPhase = 1,
  onOpenGuildSelector,
  onOpenDeliverable
}) {
  const [isFactsOpen, setIsFactsOpen] = useState(true);
  const [isDecisionsOpen, setIsDecisionsOpen] = useState(true);
  const [isUnknownsOpen, setIsUnknownsOpen] = useState(true);

  const activeGuild = businessContext?.resolvedType || null;
  const axes = businessContext?.axes || {};

  return (
    <div className="h-full flex flex-col bg-[#080808] border-l border-white/10 overflow-hidden select-text text-white">
      {/* Dossier Header */}
      <div className="p-4 border-b border-white/10 shrink-0 bg-[#0A0A0A]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
              پرونده استراتژیک
            </span>
          </div>
          <button
            onClick={onOpenDeliverable}
            className="text-[11px] flex items-center gap-1 text-zinc-400 hover:text-white px-2 py-1 rounded-md border border-white/10 hover:border-white/30 transition-all font-mono"
            title="مشاهده پیش‌نویس سند خروجی"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>سند فاز {currentPhase}</span>
          </button>
        </div>

        {/* Guild Info Card */}
        <div className="p-3 rounded-xl bg-[#111111] border border-white/10 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-mono">صنف و رسته فعال</span>
            <button
              onClick={onOpenGuildSelector}
              className="text-[10px] text-white underline underline-offset-2 hover:text-zinc-300 font-mono"
            >
              {activeGuild ? "تغییر صنف" : "انتخاب صنف"}
            </button>
          </div>
          {activeGuild ? (
            <div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-white shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white truncate">
                  {activeGuild.titleFa}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400 font-mono">
                <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                  {activeGuild.id}
                </span>
                <span className="truncate">{activeGuild.industryTitleFa || activeGuild.industryId}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenGuildSelector}
              className="py-2 text-center text-xs text-zinc-400 hover:text-white border border-dashed border-white/20 rounded-lg hover:border-white/40 transition-all"
            >
              + انتخاب از ۷۵۳ صنف رسمی
            </button>
          )}
        </div>

        {/* 15 Context Axes Mini-Pills */}
        {businessContext && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {axes.customerModel && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                {axes.customerModel}
              </span>
            )}
            {axes.channel && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                {axes.channel}
              </span>
            )}
            {axes.businessStage && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                {axes.businessStage}
              </span>
            )}
            {axes.geographicScale && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                {axes.geographicScale}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Contradictions Warning Banner */}
      {contradictions && contradictions.length > 0 && (
        <div className="p-3 bg-[#160b0b] border-b border-red-950 text-white shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>هشدار تناقض در داده‌های ورودی</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            {contradictions[0]?.descriptionFa || "تناقض در اظهارات نیازمند بازبینی و یکپارچه‌سازی است."}
          </p>
        </div>
      )}

      {/* Scrollable Dossier Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-white/[0.06]">
        
        {/* Section 1: Confirmed Facts */}
        <div>
          <button
            onClick={() => setIsFactsOpen(!isFactsOpen)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-zinc-200 hover:text-white"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>حقایق و داده‌های قطعی ({facts.length})</span>
            </div>
            {isFactsOpen ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
          </button>
          
          {isFactsOpen && (
            <div className="mt-1 space-y-1.5 pl-1">
              {facts.length === 0 ? (
                <p className="text-[11px] text-zinc-500 italic py-1">هنوز داده قطعی ثبت نشده است.</p>
              ) : (
                facts.slice(-6).map((fact, idx) => (
                  <div 
                    key={idx} 
                    className="p-2 rounded-lg bg-[#0E0E0E] border border-white/5 text-[11px] leading-relaxed text-zinc-300"
                  >
                    <span className="font-mono text-zinc-500 text-[10px] ml-1.5">#{idx + 1}</span>
                    {typeof fact === "string" ? fact : fact.text || fact.statement || JSON.stringify(fact)}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Section 2: Strategic Decisions */}
        <div className="pt-3">
          <button
            onClick={() => setIsDecisionsOpen(!isDecisionsOpen)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-zinc-200 hover:text-white"
          >
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-white" />
              <span>تصمیم‌های راهبردی ({decisions.length})</span>
            </div>
            {isDecisionsOpen ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
          </button>
          
          {isDecisionsOpen && (
            <div className="mt-1 space-y-1.5 pl-1">
              {decisions.length === 0 ? (
                <p className="text-[11px] text-zinc-500 italic py-1">هنوز تصمیمی نهایی نشده است.</p>
              ) : (
                decisions.slice(-6).map((dec, idx) => (
                  <div 
                    key={idx} 
                    className="p-2 rounded-lg bg-[#0E0E0E] border border-white/5 text-[11px] leading-relaxed text-zinc-200"
                  >
                    <span className="font-mono text-white text-[10px] ml-1.5">●</span>
                    {typeof dec === "string" ? dec : dec.decision || dec.text || JSON.stringify(dec)}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Section 3: Registered Unknowns */}
        <div className="pt-3">
          <button
            onClick={() => setIsUnknownsOpen(!isUnknownsOpen)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-zinc-200 hover:text-white"
          >
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-white" />
              <span>مجهولات و فرضیات ({unknowns.length})</span>
            </div>
            {isUnknownsOpen ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
          </button>
          
          {isUnknownsOpen && (
            <div className="mt-1 space-y-1.5 pl-1">
              {unknowns.length === 0 ? (
                <p className="text-[11px] text-zinc-500 italic py-1">مجهول بحرانی ثبت نشده است.</p>
              ) : (
                unknowns.slice(-5).map((unk, idx) => {
                  const isBlocking = unk.severity === "BLOCKING_UNKNOWN" || unk.blocking;
                  return (
                    <div 
                      key={idx} 
                      className={`p-2 rounded-lg border text-[11px] leading-relaxed ${
                        isBlocking 
                          ? "bg-[#141414] border-white/30 text-white" 
                          : "bg-[#0E0E0E] border-white/5 text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border border-white/20">
                          {isBlocking ? "مجهول بحرانی" : "فرضیه کاری"}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-mono">
                          {unk.status || "ثبت‌شده"}
                        </span>
                      </div>
                      <p>{unk.descriptionFa || unk.description || (typeof unk === "string" ? unk : JSON.stringify(unk))}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

      </div>

      {/* Ledger Footer */}
      <div className="p-3 border-t border-white/10 bg-[#0A0A0A] shrink-0 text-center">
        <span className="text-[10px] text-zinc-500 font-mono">
          سامانه پایش پیوسته دوسیه برند دیجیتال مارکت
        </span>
      </div>
    </div>
  );
}
