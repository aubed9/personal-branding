import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  Edit3, 
  Sparkles, 
  CornerDownLeft,
  FileText,
  AlertCircle,
  Layers,
  ChevronLeft
} from "lucide-react";

export default function QuestionCard({
  currentQuestion,
  currentPhase = 1,
  totalQuestions = 5,
  questionIndex = 0,
  isPhaseCompleted = false,
  phaseGateStatus = null,
  onSelectOption,
  onSubmitCustomAnswer,
  onUnknownSelect,
  onNavigateBack,
  canNavigateBack = false,
  onStartNextPhase,
  onOpenDeliverable,
  isProcessing = false
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // Reset local state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsCustomOpen(false);
    setCustomText("");
    setSearchFilter("");
  }, [currentQuestion?.id, currentQuestion?.text]);

  // Keyboard shortcut listener: 1-4 for options, Enter to submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPhaseCompleted || isProcessing) return;

      // Don't intercept if user is typing in textarea or input
      if (["TEXTAREA", "INPUT"].includes(e.target?.tagName)) {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          handleCustomSubmit();
        }
        return;
      }

      const options = currentQuestion?.options || [];
      if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (options[idx]) {
          setSelectedOption(options[idx]);
        }
      } else if (e.key === "Enter" && selectedOption) {
        handleConfirmContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOption, currentQuestion, isPhaseCompleted, isProcessing, customText]);

  const handleConfirmContinue = () => {
    if (selectedOption) {
      onSelectOption(selectedOption);
    }
  };

  const handleCustomSubmit = () => {
    if (customText.trim()) {
      onSubmitCustomAnswer(customText.trim());
    }
  };

  // Phase Completion Screen (R7: No chatbot feel, R8: Minimal, checkmark + concise summary, zero confetti)
  if (isPhaseCompleted) {
    return (
      <div className="h-full flex flex-col justify-center items-center p-6 sm:p-10 max-w-2xl mx-auto text-center select-text">
        <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center mb-6 shadow-2xl">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-zinc-300 border border-white/20 mb-3">
          دروازه ارزیابی فاز {currentPhase} تصویب شد
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
          تمام پرسش‌های این فاز با موفقیت تدوین گردید
        </h2>

        <p className="text-sm text-zinc-400 max-w-lg mb-8 leading-relaxed">
          داده‌های گردآوری‌شده با اصول راهبردی فاز {currentPhase} اعتبارسنجی شده و سند مدون این مرحله آماده استخراج است.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <button
            onClick={() => onOpenDeliverable(currentPhase)}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-white/20 hover:border-white/40 bg-[#111111] hover:bg-[#161616] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>مشاهده سند خروجی فاز</span>
          </button>

          {currentPhase < 8 ? (
            <button
              onClick={onStartNextPhase}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
            >
              <span>ورود به فاز {currentPhase + 1}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onOpenDeliverable("master")}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
            >
              <span>مشاهده کتابچه جامع استراتژی</span>
              <FileText className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const options = currentQuestion?.options || [];
  const hasManyOptions = options.length > 4;

  const filteredOptions = hasManyOptions && searchFilter.trim()
    ? options.filter(opt => {
        const text = (opt.text || opt.label || "").toLowerCase();
        return text.includes(searchFilter.trim().toLowerCase());
      })
    : options;

  return (
    <div 
      className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-4xl mx-auto w-full select-text overflow-y-auto"
      role="region"
      aria-labelledby="strategic-question-heading"
    >
      
      {/* Top Question Header */}
      <div className="space-y-3">
        
        {/* Meta Bar */}
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-white/10 text-white font-bold border border-white/15">
              فاز {currentPhase}
            </span>
            <span>
              پرسش {questionIndex + 1} از {totalQuestions || 5}
            </span>
          </div>

          {currentQuestion?.isDynamic && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/20 text-zinc-300">
              <Sparkles className="w-3 h-3" />
              <span>انطباق پویا</span>
            </span>
          )}
        </div>

        {/* Question Title & Text */}
        <div className="space-y-2">
          {currentQuestion?.title && (
            <span className="text-xs font-mono text-zinc-400 block">
              {currentQuestion.title}
            </span>
          )}
          <h1 
            id="strategic-question-heading"
            aria-live="polite"
            className="text-lg sm:text-xl md:text-2xl font-black text-white leading-snug"
          >
            {currentQuestion?.text || "در حال بارگذاری پرسش استراتژیک..."}
          </h1>
        </div>

        {/* Why this matters card */}
        {currentQuestion?.whyItMatters && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#0C0C0C] border border-white/10 text-xs text-zinc-400 flex items-start gap-2.5 leading-relaxed">
            <HelpCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <div>
              <span className="text-zinc-200 font-semibold ml-1">هدف راهبردی:</span>
              <span>{currentQuestion.whyItMatters}</span>
            </div>
          </div>
        )}

      </div>

      {/* Center: Answer Options / Custom Textarea */}
      <div className="my-4 sm:my-6 space-y-4">
        
        {!isCustomOpen ? (
          <>
            {/* Filter for >4 options */}
            {hasManyOptions && (
              <div className="mb-2">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="فیلتر در میان گزینه‌ها..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#0D0D0D] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                />
              </div>
            )}

            {/* Options Grid (2x2 on desktop for <= 4 options, compact grid for > 4) */}
            <div 
              role="radiogroup"
              aria-labelledby="strategic-question-heading"
              className={`grid gap-2.5 sm:gap-3 ${hasManyOptions ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}
            >
              {filteredOptions.map((option, idx) => {
                const isSelected = selectedOption?.value === option.value;
                return (
                  <button
                    key={option.value || idx}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${option.text || option.label}${option.description ? `: ${option.description}` : ""}`}
                    onClick={() => setSelectedOption(option)}
                    onDoubleClick={() => onSelectOption(option)}
                    className={`p-3.5 sm:p-4 rounded-xl text-right transition-all flex items-start justify-between gap-3 border ${
                      isSelected
                        ? "bg-white text-black border-white shadow-lg font-bold"
                        : "bg-[#0D0D0D] hover:bg-[#141414] text-white border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                          isSelected ? "bg-black text-white border-black" : "bg-white/10 text-zinc-400 border-white/10"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold truncate">
                          {option.text || option.label}
                        </span>
                      </div>
                      {option.description && (
                        <p className={`text-[11px] leading-normal ${isSelected ? "text-zinc-800" : "text-zinc-400"}`}>
                          {option.description}
                        </p>
                      )}
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? "border-black bg-black text-white" : "border-white/30 bg-transparent"
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Toggle Custom Answer Button */}
            <button
              onClick={() => setIsCustomOpen(true)}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 py-1 transition-colors font-mono"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>پاسخ اختصاصی خودم را می‌نویسم...</span>
            </button>
          </>
        ) : (
          /* Inline Custom Answer Textarea */
          <div className="space-y-3 p-4 rounded-2xl bg-[#0D0D0D] border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-white" />
                <span>نگارش پاسخ یا تحلیل اختصاصی شما</span>
              </span>
              <button
                onClick={() => setIsCustomOpen(false)}
                className="text-[11px] text-zinc-400 hover:text-white font-mono"
              >
                انصراف و بازگشت به گزینه‌ها
              </button>
            </div>

            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              aria-label="دیدگاه، توضیحات یا راهبرد مدنظرتان"
              placeholder="دیدگاه، توضیحات یا راهبرد مدنظرتان را بنویسید (با فشردن Ctrl+Enter ثبت می‌شود)..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl bg-black border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-all resize-none leading-relaxed"
              autoFocus
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">
                {customText.length} کاراکتر
              </span>
              <button
                onClick={handleCustomSubmit}
                disabled={!customText.trim() || isProcessing}
                aria-label="ثبت پاسخ اختصاصی و ادامه"
                className="py-2 px-4 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-30 text-black text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <span>ثبت و ادامه</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Action Dock */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
        
        {/* Left Side: Unknown & Back */}
        <div className="flex items-center gap-2">
          {canNavigateBack && (
            <button
              onClick={onNavigateBack}
              disabled={isProcessing}
              aria-label="بازگشت به پرسش قبلی"
              className="py-2.5 px-3 rounded-xl border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-all"
              title="بازگشت به پرسش قبلی"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span className="hidden sm:inline">پرسش قبلی</span>
            </button>
          )}

          <button
            onClick={onUnknownSelect}
            disabled={isProcessing}
            aria-label="ثبت این سنجه به عنوان مجهول یا نیازمند بررسی"
            className="py-2.5 px-3 rounded-xl border border-white/10 hover:border-white/25 bg-[#0D0D0D] text-zinc-400 hover:text-white text-xs flex items-center gap-1.5 transition-all font-mono"
            title="ثبت این سنجه به عنوان مجهول یا نیازمند بررسی"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>نمی‌دانم / ثبت مجهول</span>
          </button>
        </div>

        {/* Right Side: Continue CTA */}
        <div>
          <button
            onClick={handleConfirmContinue}
            disabled={!selectedOption || isProcessing}
            aria-label="تأیید پاسخ و ادامه به گام بعدی"
            className="py-2.5 px-6 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-25 text-black text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-md active:scale-98"
          >
            <span>{isProcessing ? "در حال ثبت..." : "تأیید و ادامه"}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
