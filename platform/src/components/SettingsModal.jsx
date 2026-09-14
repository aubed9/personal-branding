import React, { useState } from "react";
import { X, Key, Cpu, Sparkles, Check, ExternalLink, Globe, ShieldCheck } from "lucide-react";

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  model,
  setModel,
  engineMode,
  setEngineMode,
  customEndpoint,
  setCustomEndpoint
}) {
  const [localKey, setLocalKey] = useState(apiKey || "");
  const [localModel, setLocalModel] = useState(model || "gemini-1.5-flash");
  const [localMode, setLocalMode] = useState(engineMode || "gemini");
  const [localEndpoint, setLocalEndpoint] = useState(customEndpoint || "");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(localKey);
    setModel(localModel);
    setEngineMode(localMode);
    if (setCustomEndpoint) setCustomEndpoint(localEndpoint);

    localStorage.setItem("gemini_api_key", localKey);
    localStorage.setItem("gemini_model", localModel);
    localStorage.setItem("engine_mode", localMode);
    localStorage.setItem("custom_api_endpoint", localEndpoint);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#08080a] border border-white/20 rounded-3xl p-6 shadow-glass space-y-5 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-white border border-blue-500/20 shadow-white-subtle">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-black text-base text-white tracking-tight">تنظیمات مغز هوش مصنوعی و API</h2>
              <p className="text-xs text-zinc-400 font-mono">اتصال به مدل با مقیدسازی به ۱۶۵ منبع دانشی</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Mode Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-zinc-300 block font-mono">حالت اجرایی سیستم:</label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setLocalMode("gemini")}
              className={`p-3.5 rounded-xl border text-right transition-all text-xs ${
                localMode === "gemini"
                  ? "bg-blue-950/40 border-blue-500 text-white ring-1 ring-blue-500/50 shadow-cobalt-sm"
                  : "bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>مغز هوش مصنوعی زنده</span>
              </div>
              <span className="text-[11px] text-zinc-400 leading-relaxed block">Google Gemini API با استدلال زنده</span>
            </button>

            <button
              type="button"
              onClick={() => setLocalMode("simulator")}
              className={`p-3.5 rounded-xl border text-right transition-all text-xs ${
                localMode === "simulator"
                  ? "bg-blue-950/40 border-blue-500 text-white ring-1 ring-blue-500/50 shadow-cobalt-sm"
                  : "bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>شبیه‌ساز داخلی ویکی</span>
              </div>
              <span className="text-[11px] text-zinc-400 leading-relaxed block">کامپایل آفلاین و بدون نیاز به اینترنت</span>
            </button>
          </div>
        </div>

        {/* API Key & Endpoint (Active if Gemini mode) */}
        {localMode === "gemini" && (
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-zinc-300">کلید Google Gemini API:</label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>دریافت کلید رایگان</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono"
            />

            {/* Custom Endpoint / Reverse Proxy Input */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>آدرس پروکسی یا سرور سفارشی (اختیاری):</span>
                </label>
              </div>
              <input
                type="text"
                value={localEndpoint}
                onChange={(e) => setLocalEndpoint(e.target.value)}
                placeholder="پیش‌فرض: generativelanguage.googleapis.com"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono text-left"
                dir="ltr"
              />
              <p className="text-[10px] text-zinc-500 font-mono">
                در صورت نیاز به ریورس‌پروکسی یا کلادفلر جهت عبور از محدودیت‌های شبکه، آدرس را وارد فرمایید.
              </p>
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-zinc-300 block">مدل هوش مصنوعی:</label>
              <select
                value={localModel}
                onChange={(e) => setLocalModel(e.target.value)}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (سریع، دقیق و کم‌مصرف)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (استدلال استراتژیک عمیق)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (جدیدترین مدل چندحالته)</option>
              </select>
            </div>

            {/* Wiki Grounding Guarantee badge */}
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-emerald-400 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-[11px] leading-tight">
                پرامپت سیستم به ۴۹ مقاله ویکی مقید شده و اصطلاحات نامربوط شرکتی مهار می‌شوند.
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-black transition-all shadow-white-subtle flex items-center gap-1.5 active:scale-[0.98]"
          >
            {saved ? <Check className="w-4 h-4 text-blue-600" /> : null}
            <span>{saved ? "ذخیره شد!" : "ذخیره و اعمال تنظیمات"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
