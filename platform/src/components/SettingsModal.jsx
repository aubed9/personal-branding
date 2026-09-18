import React, { useState, useRef } from "react";
import { 
  X, 
  Key, 
  Cpu, 
  Check, 
  Globe, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  Upload, 
  RotateCcw,
  FileJson
} from "lucide-react";
import { validateEndpointUrl, SessionKeyManager } from "../services/endpointSecurity";

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
  setCustomEndpoint,
  onExportProject,
  onImportProject,
  onResetProject
}) {
  const [localKey, setLocalKey] = useState(apiKey || "");
  const [localModel, setLocalModel] = useState(model || "gemini-1.5-flash");
  const [localMode, setLocalMode] = useState(engineMode || "gemini");
  const [localEndpoint, setLocalEndpoint] = useState(customEndpoint || "");
  const [endpointError, setEndpointError] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setEndpointError("");

    // Strict validation of custom endpoint URL if provided
    if (localEndpoint && localEndpoint.trim()) {
      try {
        validateEndpointUrl(localEndpoint.trim());
      } catch (err) {
        setEndpointError(err.message || "آدرس سرور سفارشی نامعتبر است.");
        return;
      }
    }

    // Save API key strictly in Session Memory (Requirement R12)
    SessionKeyManager.setApiKey(localKey);
    setApiKey(localKey);

    // Save non-sensitive preferences
    setModel(localModel);
    setEngineMode(localMode);
    if (setCustomEndpoint) setCustomEndpoint(localEndpoint);

    localStorage.setItem("gemini_model", localModel);
    localStorage.setItem("engine_mode", localMode);
    localStorage.setItem("custom_api_endpoint", localEndpoint);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (onImportProject) {
          const result = onImportProject(text);
          if (result && result.success) {
            setImportStatus("دوسیه با موفقیت بازیابی شد.");
            setTimeout(() => {
              setImportStatus("");
              onClose();
            }, 1000);
          } else {
            setImportStatus(result?.error || "خطا در ساختار فایل پشتیبان");
          }
        }
      } catch (err) {
        setImportStatus(`خطا در پردازش فایل: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 select-text">
      <div className="w-full max-w-lg bg-[#09090B] border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
        
        {/* Header (Monochrome) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white text-black font-mono font-black text-sm">
              <Cpu className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-black text-base text-white tracking-tight">
                تنظیمات سیستم و پیکربندی داده‌ها
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                مدیریت حافظه نشست، مدل‌های زبانی و پشتیبان‌گیری
              </p>
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
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-300 block font-mono">حالت استدلال و تحلیل:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLocalMode("gemini")}
              className={`p-3 rounded-xl border text-right transition-all text-xs ${
                localMode === "gemini"
                  ? "bg-white text-black font-bold border-white"
                  : "bg-[#111111] border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 font-bold">
                <Key className="w-3.5 h-3.5" />
                <span>اتصال زنده هوش مصنوعی</span>
              </div>
              <span className={`text-[11px] leading-relaxed block ${localMode === "gemini" ? "text-zinc-700" : "text-zinc-500"}`}>
                Google Gemini API با استدلال بلادرنگ
              </span>
            </button>

            <button
              type="button"
              onClick={() => setLocalMode("simulator")}
              className={`p-3 rounded-xl border text-right transition-all text-xs ${
                localMode === "simulator"
                  ? "bg-white text-black font-bold border-white"
                  : "bg-[#111111] border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>موتور قواعد محلی (آفلاین)</span>
              </div>
              <span className={`text-[11px] leading-relaxed block ${localMode === "simulator" ? "text-zinc-700" : "text-zinc-500"}`}>
                مبتنی بر ماتریس‌های ۷۵۳ صنف و ۱۶۵ منبع
              </span>
            </button>
          </div>
        </div>

        {/* Gemini API Key (Session-Only BYOK) */}
        {localMode === "gemini" && (
          <div className="space-y-3 p-3.5 rounded-xl bg-[#0F0F12] border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 font-mono">
                <Key className="w-3.5 h-3.5 text-zinc-400" />
                <span>کلید Google Gemini API:</span>
              </label>
              <span className="text-[10px] text-zinc-400 font-mono">
                حفاظت شده در حافظه موقت نشست
              </span>
            </div>

            <input
              type="password"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white font-mono"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 block font-mono">مدل انتخابی:</label>
              <select
                value={localModel}
                onChange={(e) => setLocalModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs text-white focus:outline-none focus:border-white font-mono"
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (سریع‌ترین و جدیدترین)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (پایدار و استاندارد)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (عمیق‌ترین استدلال استراتژیک)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 block font-mono">آدرس سرور معکوس (اختیاری):</label>
              <input
                type="text"
                value={localEndpoint}
                onChange={(e) => setLocalEndpoint(e.target.value)}
                placeholder="https://my-proxy.com"
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white font-mono"
              />
              {endpointError && (
                <p className="text-[11px] text-red-400 mt-1">{endpointError}</p>
              )}
            </div>
          </div>
        )}

        {/* State Persistence & Project Transfer (Requirement R11) */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="text-xs font-bold text-zinc-300 block font-mono">
            پشتیبان‌گیری و انتقال دوسیه برند:
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onExportProject}
              className="py-2.5 px-3 rounded-xl bg-[#111111] hover:bg-[#161616] border border-white/15 text-xs text-white flex items-center justify-center gap-1.5 font-mono transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود پشتیبان (JSON)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 rounded-xl bg-[#111111] hover:bg-[#161616] border border-white/15 text-xs text-white flex items-center justify-center gap-1.5 font-mono transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>بارگذاری فایل (JSON)</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {importStatus && (
            <p className="text-[11px] text-zinc-300 font-mono py-1">{importStatus}</p>
          )}

          {onResetProject && (
            <button
              type="button"
              onClick={() => {
                if (onResetProject) onResetProject();
                onClose();
              }}
              className="w-full py-2 text-center text-xs text-zinc-400 hover:text-white transition-colors font-mono"
            >
              بازنشانی کامل دوسیه و شروع از فاز ۱
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 font-mono">
            پروتکل امنیتی نشست‌های دیجیتال مارکت
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="py-2 px-5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all"
          >
            {saved ? "ذخیره شد ✓" : "تأیید و ذخیره"}
          </button>
        </div>

      </div>
    </div>
  );
}
