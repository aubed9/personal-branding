import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PhaseProgressRail from "./components/PhaseProgressRail";
import ContextSummaryLedger from "./components/ContextSummaryLedger";
import QuestionCard from "./components/QuestionCard";

const DeliverableModal = lazy(() => import("./components/DeliverableModal"));
const SettingsModal = lazy(() => import("./components/SettingsModal"));
const WikiModal = lazy(() => import("./components/WikiModal"));
const GuildSelectorModal = lazy(() => import("./components/GuildSelectorModal"));
import { OrchestratorEngine } from "./services/orchestratorEngine";
import { InterviewController } from "./services/interviewController";
import { formatSelectedAnswer } from "./services/interviewSchema";
import { SessionKeyManager } from "./services/endpointSecurity";
import { PersistenceManager } from "./services/persistenceManager";
import { validatePhaseGate } from "./services/phaseGateValidator";

export default function App() {
  const [engine, setEngine] = useState(() => new OrchestratorEngine());
  const persistenceManagerRef = useRef(new PersistenceManager());
  const controllerRef = useRef(null);
  if (!controllerRef.current || controllerRef.current.engine !== engine) controllerRef.current = new InterviewController(engine);
  const [workflowMessage, setWorkflowMessage] = useState('');
  const [phaseGateStatus, setPhaseGateStatus] = useState(null);

  // Multi-Phase Tracking (1 to 8)
  const [currentPhase, setCurrentPhase] = useState(1);
  const [completedPhases, setCompletedPhases] = useState({
    1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false
  });
  const [phaseStatus, setPhaseStatus] = useState({});

  // Question & Workstation State
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [isPhaseCompleted, setIsPhaseCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState("");

  // UI Modals & Drawers
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeliverableOpen, setIsDeliverableOpen] = useState(false);
  const [activeDeliverablePhase, setActiveDeliverablePhase] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWikiOpen, setIsWikiOpen] = useState(false);
  const [isGuildSelectorOpen, setIsGuildSelectorOpen] = useState(false);
  const [isLedgerMobileOpen, setIsLedgerMobileOpen] = useState(false);

  // Strategic Deliverable & Telemetry Stats
  const [stats, setStats] = useState({ facts: 0, decisions: 0, assumptions: 0, unknowns: 0 });
  const [deliverableData, setDeliverableData] = useState(null);
  const [markdownContent, setMarkdownContent] = useState("");

  // Settings (API key stored strictly in Session Memory, never in localStorage)
  const [apiKey, setApiKeyState] = useState(() => SessionKeyManager.getApiKey());
  const setApiKey = (newKey) => {
    SessionKeyManager.setApiKey(newKey);
    setApiKeyState(newKey);
  };
  const [model, setModel] = useState(() => localStorage.getItem('gemini_model') || 'gemini-3.5-flash-lite');
  const [engineMode, setEngineMode] = useState(() => localStorage.getItem("engine_mode") || "gemini");
  const [customEndpoint, setCustomEndpoint] = useState(() => localStorage.getItem("custom_api_endpoint") || "");

  // Sync state from engine and perform autosave
  const syncFromEngine = useCallback((eng) => {
    const q = eng.getCurrentQuestion();
    const questions = eng.getCurrentPhaseQuestions ? eng.getCurrentPhaseQuestions() : [];
    
    setCurrentQuestion(q);
    setTotalQuestions(questions?.length || 5);
    setQuestionIndex(Math.min(eng.currentStepIndex || 0, Math.max(0, questions.length - 1)));

    const gate = validatePhaseGate(eng.currentPhase, eng);
    setPhaseGateStatus(gate);
    setCurrentPhase(eng.currentPhase);
    const isDone = !q && gate.passed && Boolean(eng.completedPhases[eng.currentPhase]);
    setIsPhaseCompleted(isDone);

    setStats({
      facts: eng.facts?.length || 0,
      decisions: eng.decisions?.length || 0,
      assumptions: eng.assumptions?.length || 0,
      unknowns: eng.unknowns?.length || 0
    });

    setCompletedPhases({ ...eng.completedPhases });
    setPhaseStatus({ ...(eng.phaseStatus || {}) });

    setDeliverableData(eng.generateDeliverableData(eng.currentPhase));
    setMarkdownContent(eng.generateMarkdownText(eng.currentPhase));

    // Autosave state securely via PersistenceManager (Requirement R8.1 / R11)
    const saved = persistenceManagerRef.current.saveProjectState(eng);
    if (!saved) setWorkflowMessage('ذخیره خودکار انجام نشد. از تنظیمات، فایل پروژه را دانلود کنید.');
    setLastSavedTime(saved ? new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "");
  }, []);

  // Initialize Engine, safely restore saved state (or recover if corrupt), & purge legacy keys
  useEffect(() => {
    SessionKeyManager.purgeLegacyKeys();
    const loadRes = persistenceManagerRef.current.safeLoadOrInitialize(engine);
    if (loadRes?.success) {
      setCurrentPhase(engine.currentPhase || 1);
    }
    syncFromEngine(engine);
  }, [engine, syncFromEngine]);

  const cancelPendingTurn = () => {
    controllerRef.current?.cancel();
    setIsProcessing(false);
    setIsAiAnalyzing(false);
  };

  useEffect(() => () => controllerRef.current?.cancel(), [engine]);

  const submitAnswer = async (userText, optionValue = null, structuredData = undefined) => {
    const controller = controllerRef.current;
    if (controller.busy || !userText?.trim() || !currentQuestion) return;
    setIsProcessing(true);
    setIsAiAnalyzing(engineMode === 'gemini' && Boolean(apiKey || customEndpoint));
    setWorkflowMessage('');
    try {
      const result = await controller.submit({ userText, optionValue, structuredData, questionId: currentQuestion.id }, {
        engineMode, apiKey: apiKey || SessionKeyManager.getApiKey(), model, customEndpoint,
      }, eng => {
        if (!persistenceManagerRef.current.saveProjectState(eng)) setWorkflowMessage('ذخیره خودکار انجام نشد؛ فایل پروژه را دانلود کنید.');
      });
      if (result.cancelled || result.ignored || controller !== controllerRef.current) return;
      setWorkflowMessage(result.message || '');
      syncFromEngine(engine);
    } catch (error) {
      setWorkflowMessage(error.message);
      syncFromEngine(engine);
    } finally {
      if (controller === controllerRef.current && !controller.busy) {
        setIsProcessing(false);
        setIsAiAnalyzing(false);
      }
    }
  };

  const handleSelectOption = option => option && submitAnswer(formatSelectedAnswer(option), option.value);
  const handleSubmitCustomAnswer = text => submitAnswer(text?.trim());

  // Handle Unknown / Uncertainty ("نمی‌دانم")
  const handleUnknownSelect = () => {
    handleSelectOption({
      text: "این سنجه را به عنوان مجهول رسمی دوسیه ثبت فرما",
      value: "unknown"
    });
  };

  // Handle Navigate Back to Previous Question
  const handleNavigateBack = () => {
    cancelPendingTurn();
    if (engine.navigateBack) {
      engine.navigateBack();
      syncFromEngine(engine);
    }
  };

  // Handle Guild Selection from 753 catalog
  const handleSelectGuild = (guild) => {
    if (!guild) return;
    cancelPendingTurn();
    engine.selectGuild(guild);
    syncFromEngine(engine);
  };

  // Transition to Next Phase (e.g. 1 -> 2, 2 -> 3, ..., 7 -> 8)
  const handleStartNextPhase = () => {
    if (controllerRef.current.busy) return;
    if (currentPhase >= 8) return;
    const nextPhaseNum = currentPhase + 1;
    const check = engine.canStartPhase(nextPhaseNum);
    if (check && !check.allowed) {
      alert(`ورود به فاز ${nextPhaseNum} مسدود است:\n${check.reason}`);
      return;
    }

    engine.startPhase(nextPhaseNum);
    setCurrentPhase(nextPhaseNum);
    syncFromEngine(engine);
  };

  // Jump to specific phase (for reviewing deliverables)
  const handleSelectPhase = (phaseId) => {
    if (completedPhases[phaseId] || phaseId === currentPhase) {
      handleOpenDeliverable(phaseId);
    }
  };

  // Open Deliverable Modal
  const handleOpenDeliverable = (phaseParam = currentPhase) => {
    setActiveDeliverablePhase(phaseParam);
    setDeliverableData(engine.generateDeliverableData(phaseParam));
    setMarkdownContent(engine.generateMarkdownText(phaseParam));
    setIsDeliverableOpen(true);
  };

  // Complete Reset
  const handleReset = () => {
    if (window.confirm("آیا مایلید تمام فرآیند برندینگ را از فاز ۱ دوباره شروع کنید؟ تمام داده‌ها بازنشانی خواهند شد.")) {
      cancelPendingTurn();
      persistenceManagerRef.current.resetProjectState();
      const newEng = new OrchestratorEngine();
      setEngine(newEng);
      setCurrentPhase(1);
      setCompletedPhases({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false });
      setStats({ facts: 0, decisions: 0, assumptions: 0, unknowns: 0 });
      syncFromEngine(newEng);
    }
  };

  // Export Project State to JSON file
  const handleExportProject = () => {
    const jsonStr = persistenceManagerRef.current.exportProjectJSON(engine);
    if (!jsonStr) return;
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `digital-market-project-state-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import Project State from JSON file
  const handleImportProject = (jsonString) => {
    const res = persistenceManagerRef.current.importProjectJSON(jsonString);
    if (!res.success) return res;
    cancelPendingTurn();
    if (!persistenceManagerRef.current.restoreToEngine(engine, res.state)) return { success: false, error: "فایل پروژه نامعتبر است." };
    setCurrentPhase(engine.currentPhase || 1);
    syncFromEngine(engine);
    return { success: true };
  };

  const activeGuild = engine.businessContext?.resolvedType;

  return (
    <div className="h-[100dvh] w-screen bg-[#000000] text-white flex flex-col overflow-hidden font-sans select-text antialiased">
      
      {/* 1. Header (auto height, strict monochrome) */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        currentPhase={currentPhase}
        completedPhases={completedPhases}
        onOpenDeliverable={handleOpenDeliverable}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWiki={() => setIsWikiOpen(true)}
        onStartNextPhase={handleStartNextPhase}
        engineMode={engineMode}
        onOpenGuildSelector={() => setIsGuildSelectorOpen(true)}
        activeGuildTitle={engine.businessContext?.taxonomyTitleFa || activeGuild?.titleFa}
      />

      {/* 2. Phase Progress Rail (8-Phase status) */}
      <PhaseProgressRail
        currentPhase={currentPhase}
        completedPhases={completedPhases}
        phaseStatus={phaseStatus}
        onSelectPhase={handleSelectPhase}
      />

      {/* 3. Main Workspace Area (2-Column Desktop Grid, 100% Viewport Compliance) */}
      <div className="flex-1 min-h-0 flex flex-row overflow-hidden relative">
        
        {/* Sidebar Drawer */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          stats={stats}
          currentPhase={currentPhase}
          completedPhases={completedPhases}
          onSelectPhase={(pId) => {
            handleSelectPhase(pId);
            setIsSidebarOpen(false);
          }}
          onOpenDeliverable={handleOpenDeliverable}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenWiki={() => setIsWikiOpen(true)}
          onReset={handleReset}
          onStartNextPhase={handleStartNextPhase}
        />

        {/* Right Column: Strategic Context Ledger (Desktop 320px-380px) */}
        <div className="hidden lg:block w-80 xl:w-96 shrink-0 h-full overflow-hidden">
          <ContextSummaryLedger
            businessContext={engine.businessContext}
            facts={engine.facts}
            decisions={engine.decisions}
            assumptions={engine.assumptions}
            unknowns={engine.unknowns}
            contradictions={engine.contradictions}
            currentPhase={currentPhase}
            onOpenGuildSelector={() => setIsGuildSelectorOpen(true)}
            onOpenDeliverable={() => handleOpenDeliverable(currentPhase)}
          />
        </div>

        {/* Left Column: Strategic Question Workstation */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#000000] h-full overflow-hidden relative">
          {workflowMessage && <div role="status" className="px-5 py-3 text-sm text-zinc-200 border-b border-white/10" dir="rtl">{workflowMessage}</div>}
          <QuestionCard
            currentQuestion={currentQuestion}
            currentPhase={currentPhase}
            totalQuestions={totalQuestions}
            questionIndex={questionIndex}
            isPhaseCompleted={isPhaseCompleted}
            phaseGateStatus={phaseGateStatus}
            onReviewPhase={(phase) => {
              cancelPendingTurn();
              engine.startPhase(phase);
              engine.goToQuestion(0);
              syncFromEngine(engine);
            }}
            onSelectOption={handleSelectOption}
            onSubmitCustomAnswer={handleSubmitCustomAnswer}
            onSubmitFinancialAnswer={(text, data) => submitAnswer(text, null, data)}
            onUnknownSelect={handleUnknownSelect}
            onNavigateBack={handleNavigateBack}
            canNavigateBack={engine.currentStepIndex > 0}
            onStartNextPhase={handleStartNextPhase}
            onOpenDeliverable={handleOpenDeliverable}
            isProcessing={isProcessing}
          />
        </main>

      </div>

      {/* 4. Bottom Status & Telemetry Bar (Autosave, Phase progress, Keyboard hint) */}
      <footer className="h-7 sm:h-8 border-t border-white/10 bg-[#060606] px-3 sm:px-6 flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400 font-mono shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isAiAnalyzing ? "bg-white animate-ping" : "bg-white"}`} />
          <span className={isAiAnalyzing ? "text-white font-medium" : ""}>
            {isAiAnalyzing ? "تنظیم سؤال بعدی بر اساس پاسخ شما..." : "ذخیره خودکار در نشست جاری"}
          </span>
          {lastSavedTime && !isAiAnalyzing && <span className="text-zinc-500 hidden sm:inline">({lastSavedTime})</span>}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-300 font-bold">
            فاز {currentPhase} از ۸
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-zinc-400">
            پرسش {questionIndex + 1} از {totalQuestions || 5}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-zinc-500 text-[10px]">
          <span>۱ تا ۴: انتخاب گزینه</span>
          <span>Enter: تایید</span>
          <span>Esc: بستن مودال</span>
        </div>
      </footer>

      {/* Lazily Loaded Secondary Modals */}
      <Suspense fallback={null}>
        {isDeliverableOpen && (
          <DeliverableModal
            isOpen={isDeliverableOpen}
            onClose={() => setIsDeliverableOpen(false)}
            deliverableData={deliverableData}
            markdownContent={markdownContent}
            activeDeliverablePhase={activeDeliverablePhase}
            onReviewPhase={(phase) => {
              cancelPendingTurn();
              engine.startPhase(phase);
              engine.goToQuestion(0);
              setIsDeliverableOpen(false);
              syncFromEngine(engine);
            }}
            onSelectPhaseTab={(pNum) => handleOpenDeliverable(pNum)}
            completedPhases={completedPhases}
            onStartNextPhase={handleStartNextPhase}
          />
        )}

        {isWikiOpen && (
          <WikiModal
            isOpen={isWikiOpen}
            onClose={() => setIsWikiOpen(false)}
          />
        )}

        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            apiKey={apiKey}
            setApiKey={setApiKey}
            model={model}
            setModel={setModel}
            engineMode={engineMode}
            setEngineMode={setEngineMode}
            customEndpoint={customEndpoint}
            setCustomEndpoint={setCustomEndpoint}
            onExportProject={handleExportProject}
            onImportProject={handleImportProject}
            onResetProject={handleReset}
          />
        )}

        {isGuildSelectorOpen && (
          <GuildSelectorModal
            isOpen={isGuildSelectorOpen}
            onClose={() => setIsGuildSelectorOpen(false)}
            onSelectGuild={handleSelectGuild}
            selectedGuildId={engine.businessContext?.taxonomyId}
          />
        )}
      </Suspense>

    </div>
  );
}
