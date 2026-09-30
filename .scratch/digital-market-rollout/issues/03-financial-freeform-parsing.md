Type: research
Status: resolved
Blocked by: none

# Issue 03: Persian Currency & Numerical Entity Extraction Strategy

## Question

What deterministic parsing rules and regex grammar can reliably extract monetary amounts (تومان، ریال، میلیون، میلیارد) and unit periods (ماهانه، سالانه، به ازای هر واحد) from unstructured Persian chat messages into structured financial inputs?

## Answer

### Research Findings & Deterministic Parsing Specification

We established the formal grammar and conversion rules for conversational Persian financial extraction:

#### 1. Digit Normalization
Persian (`۰-۹`) and Arabic (`٠-٩`) Unicode characters are mapped to standard ASCII `0-9`:
```js
const digitMap = { '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9', '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' };
```

#### 2. Multiplier Expansion
- `هزار` -> $\times 1,000$
- `میلیون` | `میل` -> $\times 1,000,000$
- `میلیارد` -> $\times 1,000,000,000$
- `همت` -> $\times 1,000,000,000,000$ (تومان)

Example: `"۴۰ میلیون تومن"` -> `40 * 1,000,000 = 40,000,000 TOMAN`.
`"۶۵۰ هزار"` -> `650,000`.

#### 3. Semantic Slot Patterns
- **Fixed Cost (`fixedCostMonthly`)**:
  `/(?:هزینه\s*ثابت|اجاره|حقوق|خرج\s*ماهانه|ماهی|ماهانه)\s*(?:حدود|تقریباً)?\s*([۰-۹0-9]+(?:\.[۰-۹0-9]+)?)\s*(میلیون|میلیارد|هزار)?\s*(تومان|تومن|ریال)?/i`
- **Unit Sale Price (`unitPrice`)**:
  `/(?:قیمت|فروش|می‌فروشیم|هر\s*(?:دونه|عدد|واحد)|نرخ)\s*(?:حدود|تقریباً)?\s*([۰-۹0-9]+(?:\.[۰-۹0-9]+)?)\s*(میلیون|هزار)?\s*(تومان|تومن|ریال)?/i`
- **Unit Variable Cost (`unitVariableCost`)**:
  `/(?:هزینه\s*(?:تولید|متغیر|تمام\s*شده)|پامون\s*درمیاد|خرج\s*تولید)\s*(?:حدود|تقریباً)?\s*([۰-۹0-9]+(?:\.[۰-۹0-9]+)?)\s*(میلیون|هزار)?\s*(تومان|تومن|ریال)?/i`
- **Monthly Capacity (`monthlyCapacity`)**:
  `/(?:ظرفیت|توان\s*تولید|سقف\s*تولید)\s*(?:حدود|تقریباً)?\s*([۰-۹0-9]+)\s*(?:دونه|عدد|واحد|سفارش)/i`

#### 4. The "Zero-Silent-Guessing" Safety Gate
To prevent any silent financial hallucinations:
- The parser extracts candidate entities as `PROPOSED_FINANCIAL_INPUT`.
- It displays an immediate one-click confirmation card in the chat interface:
  > «آیا مقادیر مالی استخراج‌شده را تأیید می‌کنید؟  
  > • قیمت واحد: ۶۵۰٬۰۰۰ تومان  
  > • هزینه متغیر هر واحد: ۲۵۰٬۰۰۰ تومان  
  > • هزینه ثابت ماهانه: ۴۰٬۰۰۰٬۰۰۰ تومان»  
- Only upon explicit user click (`[تأیید و محاسبه]`) are values stored as `FACT` and forwarded to the unit economics math engine (`calculateFinancialBreakEven`).
