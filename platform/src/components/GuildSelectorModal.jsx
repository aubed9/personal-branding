import React, { useState, useMemo } from "react";
import { X, Search, Building2, Briefcase, Filter, CheckCircle2, ChevronRight, Tag, Sparkles } from "lucide-react";
import { BUSINESS_TYPES, MACRO_INDUSTRIES } from "../data/businessTaxonomy753.js";

export default function GuildSelectorModal({
  isOpen,
  onClose,
  onSelectGuild,
  selectedGuildId = null
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustryId, setSelectedIndustryId] = useState("ALL");
  const [displayLimit, setDisplayLimit] = useState(40);

  // Filter businesses by industry and search query
  const filteredBusinesses = useMemo(() => {
    let list = BUSINESS_TYPES;

    if (selectedIndustryId !== "ALL") {
      list = list.filter((b) => b.industryId === selectedIndustryId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((b) => {
        return (
          b.titleFa.toLowerCase().includes(q) ||
          (b.titleEn && b.titleEn.toLowerCase().includes(q)) ||
          b.id.toLowerCase().includes(q) ||
          (b.iranianGuildCode && b.iranianGuildCode.includes(q))
        );
      });
    }

    return list;
  }, [searchQuery, selectedIndustryId]);

  if (!isOpen) return null;

  const handleSelect = (guild) => {
    onSelectGuild(guild);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 select-text">
      <div className="w-full max-w-4xl h-[90vh] max-h-[820px] bg-[#09090b] border border-white/20 rounded-3xl shadow-glass flex flex-col overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-white">انتخاب‌گر جامع ۷۵۳ صنف و پیشه رسمی</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  ۳۱ صنعت کلان
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                صنف دقیق خود را جستجو فرمایید تا تمام سوالات و سنجه‌ها منحصراً متناسب با تخصص شما طراحی گردند.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Stats */}
        <div className="p-4 border-b border-white/10 bg-zinc-950/40 shrink-0 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayLimit(40);
              }}
              placeholder="جستجوی سریع در ۷۵۳ صنف (مثال: کارواش، کافی‌شاپ، تعویض‌روغنی، قنادی، حسابداری، قالب‌سازی، پوشاک...)"
              className="w-full pl-4 pr-11 py-3 rounded-2xl bg-zinc-900/80 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                پاک کردن
              </button>
            )}
          </div>

          {/* Industry Horizontal Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => {
                setSelectedIndustryId("ALL");
                setDisplayLimit(40);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-mono text-[11px] ${
                selectedIndustryId === "ALL"
                  ? "bg-blue-600 text-white font-bold shadow-cobalt-sm"
                  : "bg-zinc-900/90 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              همه صنایع ({BUSINESS_TYPES.length})
            </button>
            {MACRO_INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                onClick={() => {
                  setSelectedIndustryId(ind.id);
                  setDisplayLimit(40);
                }}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-mono text-[11px] flex items-center gap-1.5 ${
                  selectedIndustryId === ind.id
                    ? "bg-blue-600 text-white font-bold shadow-cobalt-sm"
                    : "bg-zinc-900/90 text-zinc-400 hover:text-white border border-white/10"
                }`}
              >
                <span>{ind.titleFa}</span>
                <span className="opacity-60 text-[10px]">({ind.businessCount})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="px-5 py-2.5 bg-zinc-900/30 border-b border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono shrink-0">
          <span>
            تعداد یافته‌ها: <strong className="text-white font-bold">{filteredBusinesses.length}</strong> صنف
          </span>
          {selectedIndustryId !== "ALL" && (
            <span>
              صنعت کلان انتخابی: {MACRO_INDUSTRIES.find((i) => i.id === selectedIndustryId)?.titleFa}
            </span>
          )}
        </div>

        {/* Guilds Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-zinc-400 text-sm">هیچ صنفی با عبارت جستجوی شما یافت نشد.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIndustryId("ALL");
                }}
                className="px-4 py-2 rounded-xl bg-blue-600/30 border border-blue-500/50 text-blue-300 text-xs font-bold"
              >
                نمایش همه ۷۵۳ صنف
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {filteredBusinesses.slice(0, displayLimit).map((guild) => {
                  const isSelected = selectedGuildId === guild.id;
                  const industry = MACRO_INDUSTRIES.find((i) => i.id === guild.industryId);

                  return (
                    <div
                      key={guild.id}
                      onClick={() => handleSelect(guild)}
                      className={`group p-3.5 rounded-2xl border transition-all cursor-pointer text-right flex flex-col justify-between ${
                        isSelected
                          ? "bg-blue-600/20 border-blue-500 shadow-cobalt-sm"
                          : "bg-zinc-900/60 border-white/10 hover:border-blue-500/50 hover:bg-zinc-800/80"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 border border-white/10">
                            {guild.id}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono truncate max-w-[180px]">
                            {industry?.titleFa || guild.industryId}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors leading-snug">
                          {guild.titleFa}
                        </h3>

                        {guild.titleEn && (
                          <p className="text-[11px] text-zinc-500 font-sans truncate">
                            {guild.titleEn}
                          </p>
                        )}
                      </div>

                      {/* 15 Axes Quick Badges */}
                      <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {guild.axes?.customerModel || "B2C"}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {guild.axes?.channelModel === "PHYSICAL_FIRST" ? "حضوری/فیزیکی" : "آنلاین/دیجیتال"}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {guild.axes?.scale || "MICRO"}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-blue-400 group-hover:translate-x-[-2px] transition-transform text-xs font-bold">
                          انتخاب <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {filteredBusinesses.length > displayLimit && (
                <div className="text-center pt-4 pb-2">
                  <button
                    onClick={() => setDisplayLimit((prev) => prev + 50)}
                    className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white border border-white/10 font-mono transition-all"
                  >
                    نمایش موارد بیشتر ({filteredBusinesses.length - displayLimit} صنف دیگر باقی‌مانده)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with quick tip */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-zinc-950/80 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-[11px]">با انتخاب هر صنف، تمامی شاخص‌ها، الزامات صنفی و استراتژی‌ها دقیقاً بومی‌سازی خواهند شد.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors"
          >
            انصراف
          </button>
        </div>

      </div>
    </div>
  );
}
