/**
 * DIGITAL MARKET — LLM Provider Adapter Interface (Requirement R4.3)
 * 
 * Decouples AI integration from business logic via adapter pattern.
 * Supports: GeminiProvider, MockProvider, CustomEndpointProvider
 */

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
    const { apiKey, model = 'gemini-2.0-flash', customEndpoint = '' } = this.config;

    // Build endpoint URL
    let endpoint = '';
    if (customEndpoint && customEndpoint.trim()) {
      const base = customEndpoint.trim().replace(/\/+$/, '');

      // Validate endpoint security
      const lower = base.toLowerCase();
      if (lower.startsWith('javascript:') || lower.startsWith('data:')) {
        throw new Error('آدرس سرور نامعتبر است. فقط پروتکل‌های HTTP و HTTPS مجازند.');
      }
      if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
        throw new Error('آدرس سرور باید با http:// یا https:// شروع شود.');
      }

      if (base.includes('generateContent')) {
        endpoint = base.includes('key=') ? base : `${base}?key=${apiKey}`;
      } else {
        endpoint = `${base}/v1beta/models/${model}:generateContent?key=${apiKey}`;
      }
    } else {
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    }

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

    // AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    let lastError = null;
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.status === 429) {
          // Rate limited - exponential backoff
          const wait = Math.pow(2, attempt) * 1000;
          await new Promise(r => setTimeout(r, wait));
          lastError = new Error(`محدودیت نرخ درخواست (429). تلاش ${attempt + 1}/${maxRetries}`);
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMsg = errorData.error?.message || response.statusText;
          throw new Error(`خطا در ارتباط با API هوش مصنوعی (${response.status}): ${errorMsg}`);
        }

        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!replyText) {
          throw new Error('مدل هیچ پاسخی تولید نکرد.');
        }

        return replyText;

      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('زمان پاسخ‌گویی سرور هوش مصنوعی به اتمام رسید (Timeout 30s).');
        }
        lastError = err;
        if (attempt < maxRetries - 1) {
          const wait = Math.pow(2, attempt) * 1000;
          await new Promise(r => setTimeout(r, wait));
        }
      }
    }

    throw lastError || new Error('خطای نامشخص در ارتباط با API');
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

    // Default mock response with structured format
    return `تحلیل ورودی شما ثبت شد و در پرونده استراتژیک ذخیره گردید.

---DECISION---
تصمیم استراتژیک: ورودی کاربر مورد تایید قرار گرفت.
---NEXT_QUESTION---
آیا اطلاعات بیشتری برای تکمیل این بخش دارید؟
---OPTIONS---
- بله، اطلاعات تکمیلی دارم
- خیر، به مرحله بعد برویم
- نیاز به بررسی بیشتر دارم
- نمی‌دانم`;
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
    // Validate endpoint at construction time
    const url = config.customEndpoint.trim().toLowerCase();
    if (url.startsWith('javascript:') || url.startsWith('data:')) {
      throw new Error('آدرس سرور نامعتبر است.');
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('آدرس سرور باید با http:// یا https:// شروع شود.');
    }
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
