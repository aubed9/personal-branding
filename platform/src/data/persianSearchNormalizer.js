// DIGITAL MARKET — Persian Search & Text Normalizer
// Provides comprehensive Persian text normalization, Arabic character conversion,
// zero-width non-joiner (half-space) handling, plural/suffix stripping,
// domain-specific Iranian guild alias expansion, and typo tolerance (Levenshtein distance).

/**
 * Standardizes Arabic characters, numerals, and diacritics into canonical Persian.
 * @param {string} input 
 * @returns {string} Normalized string
 */
export function normalizePersianText(input) {
  if (!input || typeof input !== "string") return "";

  let s = input.trim();

  // 1. Remove diacritics (Tanwin, Fatha, Damma, Kasra, Sukun, Tashdid, Dagger Alif)
  s = s.replace(/[\u064B-\u065F\u0670]/g, "");

  // 2. Normalize Arabic Yeh to Persian Yeh
  // \u064A (Arabic Yeh), \u0649 (Alef Maksura), \u0626 (Yeh with Hamza)
  s = s.replace(/[\u064A\u0649\u0626]/g, "ی");

  // 3. Normalize Arabic Kaf to Persian Kaf
  // \u0643 (Arabic Kaf) -> \u06A9 (Persian Kaf)
  s = s.replace(/\u0643/g, "ک");

  // 4. Normalize Arabic Heh variations
  // \u0629 (Teh Marbuta) -> ه, \u06C0 (Heh with Yeh above) -> ه
  s = s.replace(/[\u0629\u06C0]/g, "ه");

  // 5. Normalize Alef variations with Madda or Hamza
  // \u0622 (Alef Madda), \u0623 (Alef Hamza above), \u0625 (Alef Hamza below), \u0671 (Alef Wasla) -> \u0627
  s = s.replace(/[\u0622\u0623\u0625\u0671]/g, "ا");

  // 6. Normalize Waw with Hamza
  s = s.replace(/\u0624/g, "و");

  // 7. Convert Arabic and Persian numbers to Western ASCII digits
  s = s.replace(/[\u06F0-\u06F9]/g, d => String(d.charCodeAt(0) - 0x06F0));
  s = s.replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 0x0660));

  // 8. Normalize half-space (ZWNJ \u200c and ZWSP \u200b and \u200f) to space
  s = s.replace(/[\u200C\u200B\u200E\u200F\uFEFF]/g, " ");

  // 9. Replace punctuation and symbols with space
  s = s.replace(/[،؛؟«»"'/\\_,\-\–—:()\[\]{}+*&^%$#@!~`|<>]/g, " ");

  // 10. Collapse multiple whitespace into a single space
  s = s.replace(/\s+/g, " ").trim().toLowerCase();

  return s;
}

/**
 * Strips common Persian suffixes (plural, possessive, relative)
 * only if remaining stem is long enough to avoid false positives.
 * @param {string} word 
 * @returns {string} Stemmed word
 */
export function stemPersianWord(word) {
  if (!word || word.length <= 3) return word;

  let w = word;

  // Suffixes ordered by length descending
  const suffixes = [
    "هایمان", "هایتان", "هایشان",
    "هایم", "هایت", "هایش",
    "هایی", "های",
    "ترین", "تر",
    "گان", "یان",
    "های", "ها",
    "ات", "ان"
  ];

  for (const suf of suffixes) {
    if (w.endsWith(suf) && (w.length - suf.length) >= 3) {
      w = w.slice(0, -suf.length);
      break;
    }
  }

  // Handle final 'ی' (adjective/relative) if stem >= 3
  if (w.endsWith("ی") && w.length >= 4) {
    const candidate = w.slice(0, -1);
    if (candidate.length >= 3) {
      w = candidate;
    }
  }

  return w;
}

/**
 * Common Persian guild and business aliases mapping.
 * Connects synonyms, colloquial terms, and informal Iranian business titles.
 */
export const PERSIAN_GUILD_ALIASES = {
  "کارواش": ["دیتیلینگ", "صفرشویی", "روشویی", "موتورشویی", "پولیش", "سرامیک خودرو", "نانو بخار"],
  "دیتیلینگ": ["کارواش", "صفرشویی", "پولیش", "احیای رنگ", "نانوسرامیک"],
  "تعویض روغنی": ["اتوسرویس", "سرویس روغن", "پنچرگیری", "آپاراتی", "تنظیم باد", "فیلتر روغن"],
  "اتوسرویس": ["تعویض روغنی", "تعمیرگاه", "سرویس خودرو", "مکانیکی", "پنچرگیری"],
  "کافه": ["کافی شاپ", "کافیشاپ", "رستری", "اسپرسو بار", "کافه بیکری", "قهوه"],
  "کافی شاپ": ["کافه", "رستری", "اسپرسو", "قهوه فروشی", "کافه باریستا"],
  "رستوران": ["غذاخوری", "تهیه غذا", "کترینگ", "چلوکبابی", "دیزی سرا", "فودکورت", "سفره خانه"],
  "فست فود": ["ساندویچی", "پیتزا", "برگر", "اغذیه", "فلافلی"],
  "قنادی": ["شیرینی فروشی", "شیرینی پزی", "کیک و شیرینی", "کیک تولد", "دسر"],
  "آنلاین شاپ": ["فروشگاه اینترنتی", "فروشگاه آنلاین", "فروش اینستاگرامی", "ای کامرس", "خرید اینترنتی"],
  "سوپرمارکت": ["هایپرمارکت", "خواربار", "بقالی", "مینی مارکت", "مواد غذایی"],
  "آرایشگاه": ["سالن زیبایی", "پیرایشگاه", "آرایشگاه زنانه", "پیرایش مردانه", "بیوتی سالن"],
  "سالن زیبایی": ["آرایشگاه", "میکاپ", "شینیون", "کاشت ناخن", "رنگ و لایت", "پاکسازی پوست"],
  "مطب": ["کلینیک", "درمانگاه", "مرکز درمانی", "پزشک"],
  "حسابداری": ["حسابرسی", "خدمات مالی", "سامانه مودیان", "مالیات", "نرم افزار حسابداری"],
  "برنامه نویسی": ["نرم افزار", "طراحی سایت", "توسعه نرم افزار", "اپلیکیشن", "سورس کد", "طراحی وب"],
  "سئو": ["بهینه سازی موتور جستجو", "سئو سایت", "دیجیتال مارکتینگ", "تولید محتوا"],
  "مشاوره املاک": ["بنگاه املاک", "آژانس مسکن", "املاکی", "خرید و فروش ملک", "رهن و اجاره"],
  "قالب سازی": ["تراشکاری", "ماشین کاری", "قالبسازی صنعتی", "تزریق پلاستیک", "قالب سمبه ماتریس"],
  "تراشکاری": ["قالب سازی", "ماشین کاری", "سی ان سی", "cnc", "قطعه سازی"],
  "تولیدی پوشاک": ["خیاطی", "دوزندگی", "تولیدی لباس", "تریکوبافی", "برشکاری پارچه"],
  "پوشاک": ["لباس", "بوتیک", "پیراهن", "شلوار", "مانتو", "کت و شلوار"],
  "کفش": ["کیف و کفش", "چرم", "کتانی", "صندل", "کفاشی"]
};

/**
 * Computes Levenshtein distance between two strings.
 * @param {string} a 
 * @param {string} b 
 * @returns {number} Distance
 */
export function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Checks if query is a typo of target based on length-adaptive threshold.
 * @param {string} query 
 * @param {string} target 
 * @returns {boolean}
 */
export function isFuzzyMatch(query, target) {
  if (query === target) return true;
  const qLen = query.length;
  const tLen = target.length;
  if (Math.abs(qLen - tLen) > 2) return false;

  const maxDist = qLen >= 6 ? 2 : qLen >= 4 ? 1 : 0;
  if (maxDist === 0) return query === target;

  return levenshteinDistance(query, target) <= maxDist;
}

/**
 * Tokenizes and normalizes text into searchable tokens with stemming.
 * @param {string} text 
 * @returns {string[]} Array of normalized, stemmed tokens
 */
export function extractPersianTokens(text) {
  const norm = normalizePersianText(text);
  if (!norm) return [];

  const stopWords = new Set([
    "کار", "کسب", "بدون", "انواع", "کلیه", "ارائه", "فروش", "تولید", "برای", "جهت",
    "مرکز", "خدمات", "های", "ها", "یک", "این", "آن", "با", "در", "به", "از", "تا"
  ]);

  const rawTokens = norm.split(/\s+/).filter(t => t.length > 1);
  const tokens = [];

  for (const tok of rawTokens) {
    if (!stopWords.has(tok)) {
      tokens.push(tok);
      const stemmed = stemPersianWord(tok);
      if (stemmed !== tok && !stopWords.has(stemmed) && stemmed.length > 1) {
        tokens.push(stemmed);
      }
    }
  }

  return Array.from(new Set(tokens));
}

/**
 * High-performance, Persian-normalized search across business types.
 * Supports exact title, ISIC/guild codes, tokens, aliases, and fuzzy matching.
 * 
 * @param {Array} businessTypes - Array of 753 business types
 * @param {string} query - Raw search query (Persian/English/Mixed)
 * @param {object} [options] - Search options
 * @param {number} [options.limit=50] - Maximum results
 * @param {string} [options.industryId='ALL'] - Filter by industry ID
 * @param {number} [options.minScore=4] - Minimum matching score
 * @returns {Array} Scored and sorted business types
 */
export function searchBusinessTypes(businessTypes, query, options = {}) {
  const {
    limit = 50,
    industryId = "ALL",
    minScore = 4
  } = options;

  if (!query || !businessTypes || !Array.isArray(businessTypes)) {
    return [];
  }

  const rawQ = String(query).trim();
  if (!rawQ) return [];

  const normQ = normalizePersianText(rawQ);
  const qTokens = extractPersianTokens(rawQ);

  // Guild code exact match check (numbers)
  const codeMatch = rawQ.match(/\b\d{4,8}\b/);
  const matchedGuildCode = codeMatch ? codeMatch[0] : null;

  // BT-ID exact match check
  const idMatch = rawQ.match(/bt-\d{4}/i);
  const matchedBtId = idMatch ? idMatch[0].toUpperCase() : null;

  // Expand query aliases
  const expandedAliases = new Set();
  for (const [key, aliases] of Object.entries(PERSIAN_GUILD_ALIASES)) {
    const normKey = normalizePersianText(key);
    if (normQ.includes(normKey) || normKey.includes(normQ)) {
      aliases.forEach(a => expandedAliases.add(normalizePersianText(a)));
    }
    for (const a of aliases) {
      const normA = normalizePersianText(a);
      if (normQ.includes(normA)) {
        expandedAliases.add(normKey);
        aliases.forEach(other => expandedAliases.add(normalizePersianText(other)));
        break;
      }
    }
  }

  const scoredResults = [];

  for (const bt of businessTypes) {
    if (industryId !== "ALL" && bt.industryId !== industryId) {
      continue;
    }

    let score = 0;

    // 1. Direct BT-ID match (top score)
    if (matchedBtId && bt.id.toUpperCase() === matchedBtId) {
      score += 200;
    }

    // 2. Direct Iranian Guild Code match
    if (matchedGuildCode && (bt.iranianGuildCode === matchedGuildCode || bt.isicCode === matchedGuildCode || bt.guildCode === matchedGuildCode)) {
      score += 180;
    }

    const normTitleFa = normalizePersianText(bt.titleFa);
    const normTitleEn = (bt.titleEn || "").toLowerCase();

    // 3. Exact full title match
    if (normTitleFa === normQ) score += 120;
    else if (normTitleEn === normQ) score += 110;
    else if (normTitleFa.includes(normQ)) score += 50;
    else if (normQ.includes(normTitleFa)) score += 40;

    // 4. Token overlap scoring
    const titleTokens = extractPersianTokens(bt.titleFa);
    for (const qTok of qTokens) {
      if (titleTokens.includes(qTok)) {
        score += 15;
      } else if (normTitleFa.includes(qTok)) {
        score += 10;
      } else {
        // Check keywords
        if (Array.isArray(bt.keywords)) {
          for (const kw of bt.keywords) {
            const normKw = normalizePersianText(kw);
            if (normKw === qTok || normKw.includes(qTok)) {
              score += 8;
              break;
            }
          }
        }
      }
    }

    // 5. Alias matches
    for (const alias of expandedAliases) {
      if (normTitleFa.includes(alias)) {
        score += 25;
      } else if (Array.isArray(bt.keywords)) {
        for (const kw of bt.keywords) {
          if (normalizePersianText(kw).includes(alias)) {
            score += 15;
            break;
          }
        }
      }
    }

    // 6. Fuzzy / Typo matching if score is still low and query has substantial length
    if (score < 15 && normQ.length >= 4) {
      for (const tTok of titleTokens) {
        if (tTok.length >= 4 && isFuzzyMatch(normQ, tTok)) {
          score += 18;
          break;
        }
      }
    }

    if (score >= minScore) {
      scoredResults.push({
        businessType: bt,
        score
      });
    }
  }

  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.slice(0, limit).map(item => item.businessType);
}
