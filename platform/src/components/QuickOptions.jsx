import React, { useState } from "react";
import {
  Lightbulb,
  Rocket,
  TrendingUp,
  RefreshCw,
  GraduationCap,
  Briefcase,
  ShoppingBag,
  Code,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  Clock,
  AlertCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Building2
} from "lucide-react";

const ICON_MAP = {
  Lightbulb,
  Rocket,
  TrendingUp,
  RefreshCw,
  GraduationCap,
  Briefcase,
  ShoppingBag,
  Code,
  Building2
};

const UNKNOWN_CATEGORIES = [
  {
    id: "UNMEASURED_TIMING",
    label: "هنوز راه‌اندازی نشده / نسنجیده‌ایم",
    text: "هنوز شروع به کار نکرده‌ایم و این شاخص اندازه‌گیری نشده است (فرضیه تست)",
    icon: Clock
  },
  {
    id: "EXPLICIT_IGNORANCE",
    label: "آمار دقیق ندارم",
    text: "هنوز آمار و اطلاعات دقیق برای این بخش ندارم / مجهول رسمی ثبت شود",
    icon: AlertCircle
  },
  {
    id: "UNCERTAINTY",
    label: "نامشخص / متغیر وابسته",
    text: "هنوز درباره این موضوع مطمئن نیستم و وابسته به کشش اولیه بازار است",
    icon: HelpCircle
  },
  {
    id: "EXTERNAL_DEPENDENCY",
    label: "وابسته به عوامل بیرونی",
    text: "این بخش به نهادها، مجوزها یا تامین‌کنندگان وابسته است و فعلا قطعی نیست",
    icon: Layers
  }
];

export default function QuickOptions({
  options,
  visionAnchor,
  onSelectOption,
  onUnknownSelect,
  disabled,
  onOpenGuildSelector = null,
  showGuildSelector = false
}) {
  const [showCategoryChips, setShowCategoryChips] = useState(false);

  if (!options || options.length === 0) return null;

  return (
    <div className="pt-2 pb-1 space-y-3 w-full">
      {visionAnchor && (
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="leading-relaxed">
            <strong className="text-white font-bold">لنگر دیدگاه شما:</strong> «{visionAnchor}»
          </span>
        </div>
      )}

      {/* Prominent 753 Guild Selector Button */}
      {(showGuildSelector || onOpenGuildSelector) && (
        <button
          type="button"
          onClick={onOpenGuildSelector}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-purple-950/70 border border-blue-500/40 hover:border-blue-400 text-white flex items-center justify-between group shadow-cobalt-sm transition-all text-right"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                <span>جستجو و انتخاب از میان تمامی ۷۵۳ صنف کشور</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-mono">۳۱ صنعت کلان</span>
              </div>
              <p className="text-[11px] text-zinc-300 mt-0.5">
                برای جستجو، فیلتر یا انتخاب مستقیم صنف تخصصی خود از میان تمامی ۷۵۳ پیشه رسمی کلیک کنید
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-blue-300 font-mono text-xs font-bold shrink-0 pr-2">
            <span className="hidden sm:inline">مشاهده کاتالوگ ۷۵۳ صنف</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>
      )}

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>گزینه‌های استراتژیک پیشنهادی (یا تایپ مستقیم در کنسول زیر):</span>
        </div>
        <span className="text-[10px] text-zinc-600 font-mono hidden sm:inline">
          {options.length} موضع پیشنهادی
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map((opt, index) => {
          const Icon = opt.icon ? ICON_MAP[opt.icon] || ArrowLeft : ArrowLeft;
          const indexPersian = ["۰۱", "۰۲", "۰۳", "۰۴", "۰۵", "۰۶", "۰۷", "۰۸"][index] || `۰${index + 1}`;

          return (
            <button
              key={index}
              disabled={disabled}
              onClick={() => onSelectOption(opt)}
              className="text-right p-4 rounded-2xl obsidian-card obsidian-card-hover group flex items-start gap-3.5 shadow-glass disabled:opacity-40 disabled:pointer-events-none relative overflow-hidden"
            >
              <div className="p-2 rounded-xl bg-black border border-white/10 text-zinc-400 group-hover:text-blue-400 group-hover:border-blue-500/40 transition-colors shrink-0 mt-0.5 shadow-sm">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono text-zinc-500 group-hover:text-blue-400 transition-colors">
                    موضع {indexPersian}
                  </span>
                  {opt.badge && (
                    <span className="text-[10px] bg-white/10 text-zinc-200 border border-white/15 px-2 py-0.5 rounded-full shrink-0 font-mono">
                      {opt.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-white leading-snug transition-colors">
                  {opt.text}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Unknown / Research Section */}
      <div className="pt-2 border-t border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onUnknownSelect}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono border border-white/5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>نمی‌دانم / ثبت به عنوان مجهول رسمی و فرضیه تست</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCategoryChips(!showCategoryChips)}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 font-mono transition-colors"
          >
            <span>تفکیک جنس مجهول</span>
            {showCategoryChips ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {showCategoryChips && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {UNKNOWN_CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectOption({ text: cat.text, value: `unknown_${cat.id}` })}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10 hover:border-amber-500/40 text-right group transition-all text-xs"
                >
                  <CatIcon className="w-4 h-4 text-amber-400/80 group-hover:text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-zinc-300 group-hover:text-white block truncate">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 truncate block">
                      {cat.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
