import React, { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PhaseProgressRail from "./components/PhaseProgressRail";
import ContextSummaryLedger from "./components/ContextSummaryLedger";
import QuestionCard from "./components/QuestionCard";
import DeliverableModal from "./components/DeliverableModal";
import SettingsModal from "./components/SettingsModal";
import WikiModal from "./components/WikiModal";
import GuildSelectorModal from "./components/GuildSelectorModal";
import { OrchestratorEngine } from "./services/orchestratorEngine";
import { runKnowledgeBrain } from "./services/geminiService";
import { SessionKeyManager } from "./services/endpointSecurity";
import { PersistenceManager } from "./services/persistenceManager";
import { validatePhaseGate } from "./services/phaseGateValidator";
import { classifyBusinessContext } from "./data/businessContextRouter";

export default function App() {
  const [engine, setEngine] = useState(() => new OrchestratorEngine());
  const persistenceManagerRef = useRef(new PersistenceManager());

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
  const [model, setModel] = useState(() => localStorage.getItem("gemini_model") || "gemini-1.5-flash");
  const [engineMode, setEngineMode] = useState(() => localStorage.getItem("engine_mode") || "simulator");
  const [customEndpoint, setCustomEndpoint] = useState(() => localStorage.getItem("custom_api_endpoint") || "");

  // Sync state from engine and perform autosave
  const syncFromEngine = useCallback((eng) => {
    const q = eng.getCurrentQuestion();
    const questions = eng.getCurrentPhaseQuestions ? eng.getCurrentPhaseQuestions() : [];
    
    setCurrentQuestion(q);
    setTotalQuestions(questions?.length || 5);
    setQuestionIndex(eng.currentStepIndex || 0);

    const isDone = !q && questions?.length > 0 && questions.every(item => item?.isAnswered);
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
    persistenceManagerRef.current.saveProjectState(eng);
    setLastSavedTime(new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  }, []);

  // Initialize Engine & Purge any legacy localStorage keys on startup
  useEffect(() => {
    SessionKeyManager.purgeLegacyKeys();
    syncFromEngine(engine);
  }, [engine, syncFromEngine]);

  // Handle Option Selection
  const handleSelectOption = async (option) => {
    if (!option || isProcessing) return;
    setIsProcessing(true);

    try {
      const userText = option.text || option.label;
      const optionValue = option.value;

      if (engineMode === "gemini" && apiKey && apiKey.trim()) {
        try {
          const brainResult = await runKnowledgeBrain({
            apiKey,
            model,
            customEndpoint,
            phaseNum: currentPhase,
            context: engine.businessContext,
            userText,
            optionValue,
            priorAnswers: engine.phaseData,
            facts: engine.facts,
            decisions: engine.decisions
          });

          engine.processUserResponse(userText, optionValue);

          if (brainResult?.extractedDecision) {
            engine.addStrategicDecision(brainResult.extractedDecision);
          }

          if (brainResult?.nextQuestion) {
            engine.setDynamicNextQuestion(brainResult.nextQuestion);
          }
        } catch (brainErr) {
          console.warn("[Knowledge Brain] Fallback to simulator:", brainErr.message);
          engine.processUserResponse(userText, optionValue);
        }
      } else {
        engine.processUserResponse(userText, optionValue);
      }

      // Check if phase gate is ready to validate
      const phaseQuestions = engine.getCurrentPhaseQuestions();
      const allAnswered = phaseQuestions?.every(item => item?.isAnswered);
      if (allAnswered) {
        const gate = validatePhaseGate(currentPhase, engine);
        if (gate.passed) {
          engine.completedPhases[currentPhase] = true;
        }
      }

      syncFromEngine(engine);
    } catch (err) {
      console.error("[Question Workflow] Error processing selection:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Custom Free-Text Input
  const handleSubmitCustomAnswer = async (customText) => {
    if (!customText || !customText.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      if (engineMode === "gemini" && apiKey && apiKey.trim()) {
        try {
          const brainResult = await runKnowledgeBrain({
            apiKey,
            model,
            customEndpoint,
            phaseNum: currentPhase,
            context: engine.businessContext,
            userText: customText.trim(),
            optionValue: null,
            priorAnswers: engine.phaseData,
            facts: engine.facts,
            decisions: engine.decisions
          });

          engine.processUserResponse(customText.trim(), null);

          if (brainResult?.extractedDecision) {
            engine.addStrategicDecision(brainResult.extractedDecision);
          }

          if (brainResult?.nextQuestion) {
            engine.setDynamicNextQuestion(brainResult.nextQuestion);
          }
        } catch (brainErr) {
          console.warn("[Knowledge Brain] Fallback to simulator:", brainErr.message);
          engine.processUserResponse(customText.trim(), null);
        }
      } else {
        engine.processUserResponse(customText.trim(), null);
      }

      const phaseQuestions = engine.getCurrentPhaseQuestions();
      const allAnswered = phaseQuestions?.every(item => item?.isAnswered);
      if (allAnswered) {
        const gate = validatePhaseGate(currentPhase, engine);
        if (gate.passed) {
          engine.completedPhases[currentPhase] = true;
        }
      }

      syncFromEngine(engine);
    } catch (err) {
      console.error("[Question Workflow] Error processing custom answer:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Unknown / Uncertainty ("نمی‌دانم")
  const handleUnknownSelect = () => {
    handleSelectOption({
      text: "این سنجه را به عنوان مجهول رسمی دوسیه ثبت فرما",
      value: "unknown"
    });
  };

  // Handle Navigate Back to Previous Question
  const handleNavigateBack = () => {
    if (engine.navigateBack) {
      engine.navigateBack();
      syncFromEngine(engine);
    }
  };

  // Handle Guild Selection from 753 catalog
  const handleSelectGuild = (guild) => {
    if (!guild) return;
    const classified = classifyBusinessContext({
      guild: guild.id,
      stage: "ACTIVE"
    });
    engine.setBusinessContext(classified);
    engine.processUserResponse(`صنف انتخابی: ${guild.titleFa} (${guild.id})`, guild.id);
    syncFromEngine(engine);
  };

  // Transition to Next Phase (e.g. 1 -> 2, 2 -> 3, ..., 7 -> 8)
  const handleStartNextPhase = () => {
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
      setActiveDeliverablePhase(phaseId);
      setIsDeliverableOpen(true);
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
      const newEng = new OrchestratorEngine();
      setEngine(newEng);
      setCurrentPhase(1);
      setCompletedPhases({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false });
      setStats({ facts: 0, decisions: 0, assumptions: 0, unknowns: 0 });
      syncFromEngine(newEng);
    }
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
        activeGuildTitle={activeGuild?.titleFa}
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
            unknowns={engine.unknowns}
            contradictions={engine.contradictions}
            currentPhase={currentPhase}
            onOpenGuildSelector={() => setIsGuildSelectorOpen(true)}
            onOpenDeliverable={() => handleOpenDeliverable(currentPhase)}
          />
        </div>

        {/* Left Column: Strategic Question Workstation */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#000000] h-full overflow-hidden relative">
          <QuestionCard
            currentQuestion={currentQuestion}
            currentPhase={currentPhase}
            totalQuestions={totalQuestions}
            questionIndex={questionIndex}
            isPhaseCompleted={isPhaseCompleted}
            onSelectOption={handleSelectOption}
            onSubmitCustomAnswer={handleSubmitCustomAnswer}
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
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span>ذخیره خودکار در نشست جاری</span>
          {lastSavedTime && <span className="text-zinc-500 hidden sm:inline">({lastSavedTime})</span>}
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

      {/* Deliverable Modal */}
      <DeliverableModal
        isOpen={isDeliverableOpen}
        onClose={() => setIsDeliverableOpen(false)}
        deliverableData={deliverableData}
        markdownContent={markdownContent}
        activeDeliverablePhase={activeDeliverablePhase}
        onSelectPhaseTab={(pNum) => handleOpenDeliverable(pNum)}
        completedPhases={completedPhases}
        onStartNextPhase={handleStartNextPhase}
      />

      {/* Marketing Knowledge Wiki Modal */}
      <WikiModal
        isOpen={isWikiOpen}
        onClose={() => setIsWikiOpen(false)}
      />

      {/* Settings Modal */}
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
      />

      {/* 753 Guild Selector Modal */}
      <GuildSelectorModal
        isOpen={isGuildSelectorOpen}
        onClose={() => setIsGuildSelectorOpen(false)}
        onSelectGuild={handleSelectGuild}
        selectedGuildId={engine.businessContext?.taxonomyId}
      />

    </div>
  );
}
