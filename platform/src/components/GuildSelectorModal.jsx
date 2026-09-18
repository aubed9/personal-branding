import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  X, 
  Search, 
  Building2, 
  Check, 
  ChevronLeft, 
  Tag, 
  ArrowRight,
  Sparkles,
  Layers,
  CornerDownLeft
} from "lucide-react";
import { BUSINESS_TYPES, MACRO_INDUSTRIES } from "../data/businessTaxonomy753.js";
import { filterAndRankGuilds } from "../services/persianSearchNormalizer.js";

const POPULAR_SEARCH_SUGGESTIONS = [
  "رستوران سنتی",
  "کافی‌شاپ",
  "کارواش دستی و اتوماتیک",
  "تولیدی پوشاک",
  "طراحی و برنامه‌نویسی نرم‌افزار",
  "کلینیک پوست و مو",
  "تعمیرگاه تخصصی خودرو",
  "فروشگاه آنلاین زیورآلات",
  "قنادی و شیرینی‌پزی",
  "مشاوره مدیریت و کسب‌وکار"
];

export default function GuildSelectorModal({
  isOpen,
  onClose,
  onSelectGuild,
  selectedGuildId = null
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustryId, setSelectedIndustryId] = useState("ALL");
  const [displayLimit, setDisplayLimit] = useState(50);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewGuild, setPreviewGuild] = useState(null);

  const searchInputRef = useRef(null);
  const listContainerRef = useRef(null);

  // Fast filtered & ranked businesses via Persian search normalizer (<20ms)
  const filteredBusinesses = useMemo(() => {
    return filterAndRankGuilds(BUSINESS_TYPES, searchQuery, selectedIndustryId);
  }, [searchQuery, selectedIndustryId]);

  // Reset active index when query or industry changes
  useEffect(() => {
    setActiveIndex(0);
    if (filteredBusinesses.length > 0) {
      setPreviewGuild(filteredBusinesses[0]);
    } else {
      setPreviewGuild(null);
    }
  }, [searchQuery, selectedIndustryId, filteredBusinesses]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard navigation: Arrow Up/Down, Enter to select, Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = Math.min(prev + 1, filteredBusinesses.length - 1);
          setPreviewGuild(filteredBusinesses[next]);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          setPreviewGuild(filteredBusinesses[next]);
          return next;
        });
      } else if (e.key === "Enter" && filteredBusinesses.length > 0) {
        e.preventDefault();
        const target = filteredBusinesses[activeIndex] || filteredBusinesses[0];
        if (target) {
          handleSelect(target);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredBusinesses, activeIndex]);

  if (!isOpen) return null;

  const handleSelect = (guild) => {
    onSelectGuild(guild);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 select-text">
      <div className="w-full max-w-5xl h-[92vh] max-h-[860px] bg-[#09090B] border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Header (Monochrome, editorial) */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0C0C0E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white text-black">
              <Building2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-sm sm:text-base text-white">
                  کاتالوگ جامع ۷۵۳ صنف و پیشه تخصصی
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                  ۳۱ صنعت کلان
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                صنف دقیق خود را انتخاب کنید تا کلیه سوالات، سنجه‌ها و ادبیات برندسازی منحصراً متناسب با تخصص شما بارگذاری شوند.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="بستن (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar with Quick Suggestions */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-[#0B0B0D] shrink-0 space-y-2.5">
          <div className="relative">
            <Search className="w-5 h-5 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی سریع صنف با پشتیبانی از نیم‌فاصله و ارقام فارسی (مثال: کارواش، کافی‌شاپ، پوشاک، کلینیک...)"
              className="w-full pl-20 pr-11 py-2.5 sm:py-3 rounded-xl bg-[#141417] border border-white/15 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white font-mono"
              >
                پاک کردن
              </button>
            )}
          </div>

          {/* Quick Popular Suggestions if no search */}
          {!searchQuery && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-[11px] text-zinc-400">
              <span className="shrink-0 text-zinc-500 font-mono">پیشنهادات رایج:</span>
              {POPULAR_SEARCH_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(item)}
                  className="shrink-0 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* Industry Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
            <button
              onClick={() => setSelectedIndustryId("ALL")}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all border ${
                selectedIndustryId === "ALL"
                  ? "bg-white text-black font-bold border-white"
                  : "bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              تمام صنایع (۷۵۳)
            </button>
            {MACRO_INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustryId(ind.id)}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all border ${
                  selectedIndustryId === ind.id
                    ? "bg-white text-black font-bold border-white"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {ind.titleFa}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Body: List of Guilds + Detailed Confirmation Preview */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Guild List (7 cols) */}
          <div 
            ref={listContainerRef}
            className="md:col-span-7 overflow-y-auto p-3 sm:p-4 space-y-1.5 border-b md:border-b-0 md:border-l border-white/10"
          >
            {filteredBusinesses.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                <p className="text-sm font-semibold">صنفی با این عنوان یافت نشد.</p>
                <p className="text-xs mt-1">عنوان دیگری را جستجو کنید یا فیلتر صنعت را تغییر دهید.</p>
              </div>
            ) : (
              filteredBusinesses.slice(0, displayLimit).map((guild, idx) => {
                const isSelected = selectedGuildId === guild.id;
                const isActive = activeIndex === idx;

                return (
                  <div
                    key={guild.id}
                    onMouseEnter={() => {
                      setActiveIndex(idx);
                      setPreviewGuild(guild);
                    }}
                    onClick={() => handleSelect(guild)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-white text-black border-white font-bold"
                        : isActive
                        ? "bg-[#16161A] text-white border-white/30"
                        : "bg-[#0E0E10] text-zinc-200 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                          isSelected ? "bg-black text-white border-black" : "bg-white/10 text-zinc-400 border-white/10"
                        }`}>
                          {guild.id}
                        </span>
                        <span className="text-xs sm:text-sm font-bold truncate">
                          {guild.titleFa}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 mt-1 text-[11px] font-mono ${
                        isSelected ? "text-zinc-700" : "text-zinc-400"
                      }`}>
                        <span className="truncate">{guild.industryTitleFa || guild.industryId}</span>
                        {guild.titleEn && <span className="truncate opacity-70">({guild.titleEn})</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isSelected ? "border-black text-black" : "border-white/10 text-zinc-400"
                      }`}>
                        انتخاب
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {filteredBusinesses.length > displayLimit && (
              <button
                onClick={() => setDisplayLimit((prev) => prev + 50)}
                className="w-full py-2.5 text-xs text-zinc-400 hover:text-white border border-dashed border-white/20 rounded-xl hover:border-white/40 transition-all font-mono"
              >
                بارگذاری ۵۰ صنف دیگر ({filteredBusinesses.length - displayLimit} مورد باقی‌مانده)
              </button>
            )}
          </div>

          {/* Right Column: Specialization Confirmation Preview Card (5 cols) */}
          <div className="md:col-span-5 p-4 sm:p-5 bg-[#0C0C0E] flex flex-col justify-between overflow-y-auto">
            {previewGuild ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                    پیش‌نمایش پیکربندی تخصصی صنف
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">
                    {previewGuild.titleFa}
                  </h3>
                  {previewGuild.titleEn && (
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      {previewGuild.titleEn}
                    </p>
                  )}
                </div>

                {/* Specs Grid */}
                <div className="space-y-2 text-xs divide-y divide-white/5 bg-[#121214] p-3 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-zinc-400">شناسه سیستم:</span>
                    <span className="font-mono text-white font-bold">{previewGuild.id}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5">
                    <span className="text-zinc-400">صنعت کلان:</span>
                    <span className="text-white font-medium">{previewGuild.industryTitleFa || previewGuild.industryId}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5">
                    <span className="text-zinc-400">آرکتایپ پایه:</span>
                    <span className="font-mono text-white">{previewGuild.primaryArchetype || "استاندارد صنف"}</span>
                  </div>
                  {previewGuild.iranianGuildCode && (
                    <div className="flex items-center justify-between pt-1.5">
                      <span className="text-zinc-400">کد آیسیک / صنفی:</span>
                      <span className="font-mono text-white">{previewGuild.iranianGuildCode}</span>
                    </div>
                  )}
                </div>

                {/* Specialization Guarantee Box */}
                <div className="p-3 rounded-xl bg-[#141416] border border-white/15 space-y-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-white" />
                    <span>تضمین عدم نشت اصناف و بومی‌سازی کامل</span>
                  </span>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    با انتخاب این صنف، کلیه پرسش‌های ۸ فاز، واژگان تخصصی و سنجه‌های استراتژیک منحصراً بر اساس ویژگی‌های <strong>{previewGuild.titleFa}</strong> پیکربندی شده و ادبیات اصناف نامرتبط به طور کامل مسدود می‌گردد.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-12">
                <Building2 className="w-8 h-8 stroke-1 mb-2" />
                <p className="text-xs">یک صنف را از فهرست انتخاب کنید تا مشخصات آن نمایش داده شود.</p>
              </div>
            )}

            {/* Quick Confirm CTA in Preview */}
            {previewGuild && (
              <div className="pt-4 border-t border-white/10 mt-4">
                <button
                  onClick={() => handleSelect(previewGuild)}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <span>تأیید و آغاز تدوین برند برای {previewGuild.titleFa}</span>
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer / Keyboard Hint */}
        <div className="p-3 border-t border-white/10 bg-[#0C0C0E] shrink-0 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <span>کلیدهای جهت‌نما ↑↓ : پیمایش</span>
            <span>Enter : انتخاب و تأیید</span>
            <span>Esc : بستن</span>
          </div>
          <span>{filteredBusinesses.length} صنف منطبق</span>
        </div>

      </div>
    </div>
  );
}
