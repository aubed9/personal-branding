import { runKnowledgeBrain } from './geminiService.js';

// Serializes a user turn. cancel() also invalidates providers that ignore AbortSignal.
export class InterviewController {
  constructor(engine, brain = runKnowledgeBrain) {
    this.engine = engine;
    this.brain = brain;
    this.epoch = 0;
    this.busy = false;
    this.abortController = null;
  }

  cancel() {
    this.epoch++;
    this.abortController?.abort();
    this.abortController = null;
    this.busy = false;
  }

  async submit({ userText, optionValue = null, questionId, structuredData }, config = {}, onSaved = () => {}) {
    if (this.busy) return { ignored: true };
    this.busy = true;
    const epoch = ++this.epoch;
    const controller = new AbortController();
    this.abortController = controller;
    try {
      const response = this.engine.processUserResponse(userText, optionValue, { expectedQuestionId: questionId, structuredData });
      // Persist before a network call; an interrupted request must never lose an answer.
      onSaved(this.engine);
      const turn = this.engine.createAITurn();
      if (!turn.questionId || config.engineMode !== 'gemini' || (!config.apiKey?.trim() && !config.customEndpoint?.trim())) {
        return { response, mode: 'local', message: config.engineMode === 'gemini' && turn.questionId ? 'کلید یا سرور AI تنظیم نشده؛ پرسش‌ها با قواعد محلی و پاسخ‌های شما تنظیم می‌شوند.' : '' };
      }
      try {
        const result = await this.brain({ ...config, ...turn.snapshot, userText, optionValue, signal: controller.signal });
        if (epoch !== this.epoch || controller.signal.aborted) return { cancelled: true };
        const applied = this.engine.applyAIResult(turn, result);
        return { response, mode: applied ? 'ai' : 'local', message: applied ? '' : 'پاسخ AI با سؤال جاری سازگار نبود؛ پرسش محلی حفظ شد.' };
      } catch (error) {
        if (epoch !== this.epoch || controller.signal.aborted) return { cancelled: true };
        return { response, mode: 'local', message: `پاسخ شما ذخیره شد. ${error.message} ادامه با منطق محلی.` };
      }
    } finally {
      if (epoch === this.epoch) {
        this.busy = false;
        this.abortController = null;
      }
    }
  }
}
