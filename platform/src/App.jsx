import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import DeliverableModal from "./components/DeliverableModal";
import SettingsModal from "./components/SettingsModal";
import WikiModal from "./components/WikiModal";
import GuildSelectorModal from "./components/GuildSelectorModal";
import { OrchestratorEngine } from "./services/orchestratorEngine";
import { runKnowledgeBrain } from "./services/geminiService";
import { SessionKeyManager } from "./services/endpointSecurity";

export default function App() {
  const [engine, setEngine] = useState(() => new OrchestratorEngine());

  // Multi-Phase Tracking (1 to 8)
  const [currentPhase, setCurrentPhase] = useState(1);
  const [completedPhases, setCompletedPhases] = useState({
    1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false
  });

  // Conversation State
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // UI Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeliverableOpen, setIsDeliverableOpen] = useState(false);
  const [activeDeliverablePhase, setActiveDeliverablePhase] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWikiOpen, setIsWikiOpen] = useState(false);
  const [isGuildSelectorOpen, setIsGuildSelectorOpen] = useState(false);

  // Deliverable & Stats
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

  // Mount First Question & Purge any legacy localStorage keys
  useEffect(() => {
    SessionKeyManager.purgeLegacyKeys();
    initEngine(engine);
  }, []);

  const initEngine = (eng) => {
    const firstQ = eng.getCurrentQuestion();
    setCurrentQuestion(firstQ);
    setDeliverableData(eng.generateDeliverableData(1));
    setMarkdownContent(eng.generateMarkdownText(1));
    setMessages([
      {
        id: "msg-0",
        sender: "assistant",
        text: firstQ ? firstQ.text : "سلام! به دستیار هوشمند استراتژی و برندسازی دیجیتال مارکت خوش آمدید. برای شروع صنف خود را مشخص فرمایید:",
        timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  const updateStatsAndDeliverable = (eng) => {
    setStats({
      facts: eng.facts.length,
      decisions: eng.decisions.length,
      assumptions: eng.assumptions.length,
      unknowns: eng.unknowns.length
    });
    setCompletedPhases({ ...eng.completedPhases });
    setDeliverableData(eng.generateDeliverableData(eng.currentPhase));
    setMarkdownContent(eng.generateMarkdownText(eng.currentPhase));
  };

  const triggerConfetti = (isGrand = false) => {
    try {
      confetti({
        particleCount: isGrand ? 160 : 80,
        spread: isGrand ? 100 : 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn("Confetti:", e);
    }
  };

  // Move to Next Phase (e.g. 1 -> 2, 2 -> 3, ..., 7 -> 8)
  const handleStartNextPhase = () => {
    if (currentPhase >= 8) return;
    const nextPhaseNum = currentPhase + 1;
    const { welcomeMessage, firstQuestion } = engine.startPhase(nextPhaseNum);

    setCurrentPhase(nextPhaseNum);
    setCurrentQuestion(firstQuestion);
    updateStatsAndDeliverable(engine);
    triggerConfetti(false);

    const transitionMessage = {
      id: `phase-start-${nextPhaseNum}-${Date.now()}`,
      sender: "assistant",
      text: `${welcomeMessage}\n\n${firstQuestion ? firstQuestion.text : ""}`,
      timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, transitionMessage]);
  };

  // Open Deliverable Modal
  const handleOpenDeliverable = (phaseParam = currentPhase) => {
    setActiveDeliverablePhase(phaseParam);
    setDeliverableData(engine.generateDeliverableData(phaseParam));
    setMarkdownContent(engine.generateMarkdownText(phaseParam));
    setIsDeliverableOpen(true);
  };

  // Handle Send Message
  const handleSendMessage = async (userText, optionValue = null) => {
    if (!userText || !userText.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(async () => {
      let botReply = "";
      let result = null;

      if (engineMode === "gemini" && apiKey.trim()) {
        try {
          const brainResult = await runKnowledgeBrain({
            apiKey,
            model,
            customEndpoint,
            phaseNum: currentPhase,
            context: engine.businessContext,
            userText,
            optionValue,
            messages,
            priorAnswers: engine.phaseData,
            facts: engine.facts,
            decisions: engine.decisions
          });

          result = engine.processUserResponse(userText, optionValue);

          if (brainResult.extractedDecision) {
            engine.addStrategicDecision(brainResult.extractedDecision);
          }

          if (brainResult.dynamicNextQuestion) {
            const dynQ = {
              id: result.nextQuestion?.id || `dynamic_q_${Date.now()}`,
              title: "تحلیل و پرسش تکمیلی مبتنی بر دیدگاه شما",
              text: brainResult.dynamicNextQuestion,
              options: brainResult.dynamicOptions?.length > 0 ? brainResult.dynamicOptions : (result.nextQuestion?.options || [])
            };
            engine.setDynamicNextQuestion(dynQ);
            setCurrentQuestion(dynQ);
          } else {
            setCurrentQuestion(result.nextQuestion);
          }

          botReply = brainResult.mainReply || result.reply;
        } catch (err) {
          console.error("Knowledge Brain fallback to simulator:", err);
          result = engine.processUserResponse(userText, optionValue);
          botReply = result.reply;
          setCurrentQuestion(result.nextQuestion);
        }
      } else {
        result = engine.processUserResponse(userText, optionValue);
        botReply = result.reply;
        setCurrentQuestion(result.nextQuestion);
      }

      updateStatsAndDeliverable(engine);

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: botReply,
        timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      if (result && result.isCompleted) {
        setCompletedPhases({ ...engine.completedPhases });
        triggerConfetti(result.isFinalGrandFinale);
      }
    }, 600);
  };

  const handleSelectOption = (option) => {
    handleSendMessage(option.text, option.value);
  };

  const handleSelectGuild = (guild) => {
    handleSendMessage(`صنف انتخابی: ${guild.titleFa} (${guild.id})`, guild.id);
  };

  const handleUnknownSelect = () => {
    handleSendMessage("نمی‌دانم / این مورد را به عنوان مجهول رسمی ثبت کن", "unknown");
  };

  const handleReset = () => {
    if (window.confirm("آیا مایلید تمام فرآیند برندینگ را از فاز ۱ دوباره شروع کنید؟")) {
      const newEng = new OrchestratorEngine();
      setEngine(newEng);
      setCurrentPhase(1);
      setCompletedPhases({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false });
      setStats({ facts: 0, decisions: 0, assumptions: 0, unknowns: 0 });
      initEngine(newEng);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans select-text antialiased">
      
      {/* Sidebar: Phases 1 to 8 + Wiki button + Realtime stats */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        stats={stats}
        currentPhase={currentPhase}
        completedPhases={completedPhases}
        onOpenDeliverable={handleOpenDeliverable}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWiki={() => setIsWikiOpen(true)}
        onReset={handleReset}
        onStartNextPhase={handleStartNextPhase}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#000000] relative">
        {/* Subtle Ambient Radial Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-blue-600/[0.08] via-blue-900/[0.02] to-transparent blur-3xl pointer-events-none -z-0" />
        
        {/* Top Header */}
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
        />

        {/* Chat Stream */}
        <ChatContainer
          messages={messages}
          currentQuestion={currentQuestion}
          currentPhase={currentPhase}
          completedPhases={completedPhases}
          onSelectOption={handleSelectOption}
          onUnknownSelect={handleUnknownSelect}
          onStartNextPhase={handleStartNextPhase}
          onOpenDeliverable={handleOpenDeliverable}
          onOpenGuildSelector={() => setIsGuildSelectorOpen(true)}
          isTyping={isTyping}
        />

        {/* Precision Input Dock */}
        <div className="p-3.5 sm:p-5 bg-black/85 hairline-t backdrop-blur-2xl z-20">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={(text) => handleSendMessage(text)}
              disabled={isTyping}
              placeholder={
                completedPhases[currentPhase]
                  ? `فاز ${currentPhase} تایید و نهایی شد. دکمه بالا را برای ورود به فاز بعدی بزنید...`
                  : "پاسخ یا تحلیل خود را بنویسید یا از گزینه‌های راهبردی بالا انتخاب کنید..."
              }
            />
          </div>
        </div>

      </div>

      {/* Deliverable Modal for all 8 phases + Master Brand Book */}
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
