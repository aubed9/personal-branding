import React, { useState } from "react";
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  FileText,
  Award,
  ArrowLeft,
  CheckCircle2,
  Shield
} from "lucide-react";

export default function DeliverableModal({
  isOpen,
  onClose,
  deliverableData,
  markdownContent,
  activeDeliverablePhase = 1,
  onSelectPhaseTab,
  completedPhases = {},
  onStartNextPhase,
  onReviewPhase
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !deliverableData) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("خطا در کپی متن:", err);
    }
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    const fileName = activeDeliverablePhase === "master"
      ? `Master-Brand-Book-${Date.now()}.md`
      : `Brand-Strategy-Phase-${activeDeliverablePhase}-${Date.now()}.md`;
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const handlePrint = () => {
    window.print();
  };

  const isCurrentNumeric = typeof activeDeliverablePhase === "number";
  const canGoNextFromModal = isCurrentNumeric && completedPhases[activeDeliverablePhase] && activeDeliverablePhase < 8;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="deliverable-title" className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white text-white">
      <div className="relative w-full max-w-4xl bg-[#08080a] border border-white/20 rounded-3xl shadow-glass overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 hairline-b bg-black/70 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20 shadow-white-subtle">
              {activeDeliverablePhase === "master" ? <Award className="w-5 h-5 text-blue-400" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 id="deliverable-title" className="text-sm sm:text-base font-black text-white tracking-tight">
                {deliverableData.title}
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                پرونده راهبردی {deliverableData.phase} • نسخه {deliverableData.version}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="بستن سند"
            className="p-2 text-zinc-400 hover:text-white obsidian-card obsidian-card-hover rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase Selector Tabs (1 to 8 + Master) */}
        <div className="px-4 py-2.5 hairline-b bg-black/90 flex items-center gap-2 overflow-x-auto no-print">
          <span className="text-[11px] text-zinc-400 font-mono shrink-0 ml-1">دوسیه‌ها:</span>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((pNum) => {
            const isCompleted = completedPhases[pNum];
            return (
              <button
                key={pNum}
                disabled={!isCompleted && activeDeliverablePhase !== pNum}
                onClick={() => onSelectPhaseTab(pNum)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 font-medium ${
                  activeDeliverablePhase === pNum
                    ? "bg-white text-black font-black shadow-white-subtle"
                    : isCompleted
                    ? "obsidian-surface text-zinc-200 hover:border-white/20"
                    : "bg-black/40 text-zinc-600 cursor-not-allowed opacity-40 border border-transparent"
                }`}
              >
                <span>فاز {pNum}</span>
                {isCompleted && <Check className="w-3 h-3 text-blue-600 font-bold" />}
              </button>
            );
          })}

          <div className="w-[1px] h-4 bg-white/15 mx-1 shrink-0" />

          {/* Master Book Tab */}
          <button
            onClick={() => onSelectPhaseTab("master")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeDeliverablePhase === "master"
                ? "bg-blue-600 text-white shadow-cobalt-glow border border-blue-400"
                : "obsidian-surface text-zinc-200 hover:border-white/20"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-blue-300" />
            <span>کتابچه جامع برند</span>
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-zinc-100 print:text-black print:p-0">
          
          {/* Header Title in Preview */}
          <div className="hairline-b pb-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-mono">
                <Shield className="w-3.5 h-3.5" />
                <span>{deliverableData.status === 'CONFIRMED' ? 'پاسخ‌های فاز تکمیل شده' : deliverableData.status === 'NEEDS_REVIEW' ? 'نیازمند بازبینی' : 'پیش‌نویس؛ فاز هنوز تأیید نشده'}</span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                REF: DM-STRAT-{activeDeliverablePhase}-2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white print:text-black tracking-tight">
              {deliverableData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 print:text-gray-600 mt-2.5 font-mono">
              <span>فاز سازمانی: {deliverableData.phase}</span>
              <span>•</span>
              <span>نسخه: {deliverableData.version}</span>
              <span>•</span>
              <span>تاریخ تولید: {deliverableData.date}</span>
            </div>
          </div>

          {activeDeliverablePhase !== 'master' && <button onClick={() => onReviewPhase?.(Number(activeDeliverablePhase))} className="px-4 py-2 border border-white/30 rounded-lg text-sm">ویرایش پاسخ‌های این فاز</button>}
          {/* Sections List */}
          <div className="space-y-6">
            {deliverableData.sections?.map((section) => (
              <div
                key={section.id}
                className="p-5 sm:p-6 rounded-2xl obsidian-card space-y-4 print:border-gray-300 print:bg-transparent"
              >
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 print:text-black">
                  <span className="w-2 h-2 rounded-sm bg-blue-500 shadow-cobalt-sm" />
                  {section.title}
                </h3>

                {section.content && typeof section.content === "object" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {Object.entries(section.content).map(([k, v]) => (
                      <div key={k} className="p-3.5 rounded-xl bg-black/70 border border-white/[0.07] print:border-gray-200">
                        <span className="text-[11px] text-zinc-400 block font-mono mb-1">{k}:</span>
                        <span className="text-xs sm:text-sm font-bold text-zinc-100 print:text-black leading-relaxed">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {section.flowchart && (
                  <div className="p-4 rounded-xl bg-black/90 border border-blue-500/20 font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed text-left dir-ltr print:border-gray-300 print:text-black">
                    <pre className="font-mono">{section.flowchart}</pre>
                  </div>
                )}

                {Array.isArray(section.checklist) && (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold text-zinc-400 font-mono mb-1">چک‌لیست عملیاتی و گیت‌های نظارتی:</div>
                    {section.checklist.map((chk, idx) => (
                      <label key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-black/50 border border-white/5 text-xs sm:text-sm text-zinc-200 cursor-pointer hover:border-white/10 print:border-gray-200 print:text-black">
                        <input type="checkbox" defaultChecked={false} className="mt-1 rounded accent-blue-500 cursor-pointer" />
                        <span className="leading-relaxed">{chk}</span>
                      </label>
                    ))}
                  </div>
                )}

                {Array.isArray(section.formulas) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {section.formulas.map((f, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/60 border border-white/10 print:border-gray-200">
                        <span className="text-[11px] text-blue-400 font-bold block">{f.name}</span>
                        <code className="text-xs font-mono text-white block mt-1 dir-ltr text-left print:text-black">{f.formula}</code>
                        <span className="text-[11px] text-zinc-400 block mt-1">{f.description}</span>
                      </div>
                    ))}
                  </div>
                )}

                {Array.isArray(section.kpis) && (
                  <div className="overflow-x-auto pt-1">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-zinc-400 font-mono text-[11px] print:border-gray-300">
                          <th className="py-2 px-2">شاخص ارزیابی</th>
                          <th className="py-2 px-2">فرمول / مبنا</th>
                          <th className="py-2 px-2 text-emerald-400">سبز (مطلوب)</th>
                          <th className="py-2 px-2 text-amber-400">زرد (هشدار)</th>
                          <th className="py-2 px-2 text-rose-400">قرمز (بحران)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-zinc-300 print:divide-gray-200 print:text-black">
                        {section.kpis.map((k, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="py-2.5 px-2 font-bold text-white print:text-black">{k.metric}</td>
                            <td className="py-2.5 px-2 font-mono text-zinc-400 dir-ltr text-right">{k.formula}</td>
                            <td className="py-2.5 px-2 text-emerald-400 font-semibold">{k.green}</td>
                            <td className="py-2.5 px-2 text-amber-400">{k.yellow}</td>
                            <td className="py-2.5 px-2 text-rose-400 font-semibold">{k.red}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {Array.isArray(section.items) && (
                  <ul className="space-y-2.5 pt-1">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-zinc-200 print:text-gray-800 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.omissionReason && (!section.items?.length && !section.checklist?.length) && (
                  <div className="text-xs text-zinc-500 border border-dashed border-white/10 rounded-xl p-3 print:text-gray-600">
                    {section.omissionReason}
                  </div>
                )}

                {Array.isArray(section.subsections) && section.subsections.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {section.subsections.map((subsection) => (
                      <div key={subsection.id} className="p-4 rounded-xl bg-black/50 border border-white/10 print:border-gray-200">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-zinc-100 print:text-black">{subsection.title}</h4>
                          {subsection.moduleId && <code className="text-[10px] text-zinc-500">{subsection.moduleId}</code>}
                        </div>
                        {subsection.activationReason && (
                          <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{subsection.activationReason}</p>
                        )}
                        {Array.isArray(subsection.items) && subsection.items.length > 0 && (
                          <ul className="mt-3 space-y-2">
                            {subsection.items.map((item, idx) => (
                              <li key={idx} className="text-xs text-zinc-200 print:text-gray-800 flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {Array.isArray(subsection.evidenceRequirements) && subsection.evidenceRequirements.length > 0 && (
                          <div className="mt-3 text-[11px] text-zinc-500">
                            Evidence موردنیاز: {subsection.evidenceRequirements.join(" • ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 hairline-t bg-black/85 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 text-xs font-black px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-cobalt-glow transition-all"
            >
              <Download className="w-4 h-4" />
              <span>دانلود Markdown (.md)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black shadow-white-subtle transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>پرینت رسمی / PDF A4</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl obsidian-card obsidian-card-hover text-zinc-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "کپی شد" : "کپی متن"}</span>
            </button>
          </div>

          {canGoNextFromModal && (
            <button
              onClick={() => {
                onClose();
                onStartNextPhase();
              }}
              className="flex items-center gap-1.5 text-xs font-black px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 shadow-white-subtle transition-all"
            >
              <span>ورود به فاز {activeDeliverablePhase + 1}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
