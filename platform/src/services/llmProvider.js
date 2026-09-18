/**
 * DIGITAL MARKET — LLM Provider Adapter Interface (Requirement R4.3)
 * 
 * Decouples AI integration from business logic via adapter pattern.
 * Supports: GeminiProvider, MockProvider, CustomEndpointProvider
 */

import { buildSecureEndpoint, secureFetchJson, validateEndpointUrl } from "./endpointSecurity.js";

// ====================================================================
// Base Interface
// ====================================================================
export class LLMProvider {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * @param {Object} params
   * @param {string} params.systemPrompt
   * @param {Array} params.messages
   * @param {number} params.temperature
   * @returns {Promise<string>} Raw reply text
   */
  async generateResponse(params) {
    throw new Error('LLMProvider.generateResponse() must be implemented by subclass');
  }

  getModelName() {
    return this.config.model || 'unknown';
  }
}

// ====================================================================
// Gemini Provider
// ====================================================================
export class GeminiProvider extends LLMProvider {
  constructor(config) {
    super(config);
    if (!config.apiKey && !config.customEndpoint) {
      throw new Error('GeminiProvider requires apiKey or customEndpoint');
    }
  }

  async generateResponse({ systemPrompt, messages, temperature = 0.4 }) {
    const { apiKey = '', model = 'gemini-2.0-flash', customEndpoint = '' } = this.config;

    // Build and sanitize endpoint with HTTPS guarantee
    const endpoint = buildSecureEndpoint({
      customEndpoint,
      model,
      apiKey
    });

    // Format messages into Gemini format
    const contents = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const payload = {
      contents,
      systemInstruction: systemPrompt ? {
        parts: [{ text: systemPrompt }]
      } : undefined,
      generationConfig: {
        temperature,
        maxOutputTokens: 2000,
      }
    };

    const data = await secureFetchJson({
      url: endpoint,
      payload,
      apiKey,
      timeoutMs: 30000,
      maxRetries: 3
    });

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) {
      throw new Error('مدل هیچ پاسخی تولید نکرد.');
    }

    return replyText;
  }
}

// ====================================================================
// Mock Provider (for deterministic testing without live API)
// ====================================================================
export class MockProvider extends LLMProvider {
  constructor(config = {}) {
    super(config);
    this.responses = config.responses || [];
    this.callCount = 0;
    this.callLog = [];
  }

  async generateResponse({ systemPrompt, messages, temperature }) {
    this.callLog.push({ systemPrompt, messages, temperature, timestamp: new Date().toISOString() });

    const response = this.responses[this.callCount % Math.max(1, this.responses.length)];
    this.callCount++;

    if (typeof response === 'function') {
      return response({ systemPrompt, messages, temperature });
    }

    if (typeof response === 'string') {
      return response;
    }

    // Default mock response with structured JSON format
    return JSON.stringify({
      analysisSummary: "تحلیل ورودی شما ثبت شد و در پرونده استراتژیک ذخیره گردید.",
      extractedDecision: "تصمیم استراتژیک: ورودی کاربر مورد تایید قرار گرفت.",
      nextQuestion: {
        id: `mock_q_${this.callCount}`,
        title: "پرسش تکمیلی استراتژیک",
        text: "آیا اطلاعات بیشتری برای تکمیل این بخش دارید؟",
        whyItMatters: "شفاف‌سازی متغیرهای بنیادین برند",
        options: [
          { id: "opt_1", label: "بله، اطلاعات تکمیلی دارم", detail: "افزودن جزئیات عملیاتی" },
          { id: "opt_2", label: "خیر، به مرحله بعد برویم", detail: "تایید و ادامه مسیر" },
          { id: "opt_3", label: "نیاز به بررسی بیشتر دارم", detail: "ثبت به عنوان موضوع باز" },
          { id: "opt_4", label: "نمی‌دانم", detail: "ثبت مجهول رسمی" }
        ],
        allowCustomAnswer: true
      }
    }, null, 2);
  }

  getCallLog() {
    return this.callLog;
  }

  reset() {
    this.callCount = 0;
    this.callLog = [];
  }
}

// ====================================================================
// Custom Endpoint Provider
// ====================================================================
export class CustomEndpointProvider extends LLMProvider {
  constructor(config) {
    super(config);
    if (!config.customEndpoint) {
      throw new Error('CustomEndpointProvider requires customEndpoint');
    }
    // Validate endpoint at construction time strictly with HTTPS guarantee
    validateEndpointUrl(config.customEndpoint);
  }

  async generateResponse(params) {
    // Delegate to GeminiProvider with custom endpoint
    const gemini = new GeminiProvider({
      ...this.config,
      apiKey: this.config.apiKey || 'custom-endpoint-no-key'
    });
    return gemini.generateResponse(params);
  }
}

// ====================================================================
// Factory
// ====================================================================

/** Model configuration registry */
const MODEL_REGISTRY = {
  'gemini-2.0-flash': { name: 'Gemini 2.0 Flash', status: 'current' },
  'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', status: 'supported' },
  'gemini-1.5-pro': { name: 'Gemini 1.5 Pro', status: 'supported' },
  'gemini-2.0-pro': { name: 'Gemini 2.0 Pro', status: 'current' },
};

export function getAvailableModels() {
  return Object.entries(MODEL_REGISTRY).map(([id, info]) => ({ id, ...info }));
}

export function getDefaultModel() {
  return 'gemini-2.0-flash';
}

export function isValidModel(modelName) {
  return modelName in MODEL_REGISTRY || modelName.startsWith('gemini-');
}

/**
 * Factory: creates the appropriate LLM provider based on config
 * @param {Object} config - { apiKey, model, customEndpoint, mockResponses }
 * @returns {LLMProvider}
 */
export function createLLMProvider(config = {}) {
  if (config.mockResponses || config.useMock) {
    return new MockProvider({ responses: config.mockResponses || [] });
  }

  if (config.customEndpoint && !config.apiKey) {
    return new CustomEndpointProvider(config);
  }

  if (config.apiKey) {
    return new GeminiProvider({
      ...config,
      model: config.model || getDefaultModel()
    });
  }

  throw new Error('تنظیمات ناکافی: حداقل یک کلید API یا آدرس سرور سفارشی مورد نیاز است.');
}
