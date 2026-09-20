import { runKnowledgeBrain } from "./src/services/geminiService.js";
import { DEFAULT_GEMINI_API_KEY } from "./src/services/endpointSecurity.js";

async function main() {
  console.log("======================================================================");
  console.log("BRAIN: TESTING KNOWLEDGE-GROUNDED AI DYNAMIC QUESTION ENGINE");
  console.log("======================================================================");

  const testContext = {
    taxonomyId: "BT-0066",
    taxonomyTitleFa: "کافه و برشته‌کاری قهوه",
    archetype: "RESTAURANT_CAFE_HOSPITALITY",
    archetypeTitle: "کافه و رستوران",
    industryId: "IND-02",
    industryCode: "صنایع غذایی",
    customerModel: "B2C",
    channelModel: "PHYSICAL_FIRST"
  };

  const priorAnswers = {
    1: {
      diagnosticVision: "ما می‌خواهیم پاتوق تخصصی عاشقان قهوه با رُست تازه هفتگی در شرق تهران باشیم.",
      step_1: "تمرکز بر کیفیت قهوه تخصصی و دستگاه روستر ۵ کیلویی در دید مشتری",
      step_2: "جلوگیری اکید از ورود به جنگ قیمت با کافه‌های معمولی"
    }
  };

  const facts = [
    "روستر ۵ کیلویی ایتالیایی در محل مستقر است",
    "تامین مستقیم دانه سبز تخصصی از واردکننده"
  ];

  const decisions = [
    "عدم ورود به جنگ قیمت و پایبندی به قیمت‌گذاری ارزشی"
  ];

  const userText = "مشتریان ما بیشتر دانشجویان و فریلنسرهایی هستند که دنبال کیفیت بالا و فضای آرام هستند ولی کشش قیمتی محدودی دارند.";

  console.log(">> Sending request to Google Gemini API with default key and model...");
  const t0 = Date.now();
  const res = await runKnowledgeBrain({
    apiKey: DEFAULT_GEMINI_API_KEY,
    model: "gemini-3.6-flash",
    phaseNum: 2,
    context: testContext,
    userText,
    priorAnswers,
    facts,
    decisions
  });
  const duration = Date.now() - t0;

  console.log(`Duration: ${duration} ms`);
  console.log("\n[Analysis Summary]:", res.analysisSummary);
  console.log("[Extracted Decision]:", res.extractedDecision);
  console.log("\n[Dynamic Next Question]:");
  console.log("  Title:", res.nextQuestion?.title);
  console.log("  Text:", res.nextQuestion?.text);
  console.log("  Why It Matters:", res.nextQuestion?.whyItMatters);
  console.log("  Options:");
  res.nextQuestion?.options?.forEach((opt, idx) => {
    console.log(`    ${idx + 1}. [${opt.label}] -> ${opt.detail || opt.description}`);
  });

  if (!res.nextQuestion || !res.nextQuestion.text) {
    throw new Error("Next question was not generated!");
  }
  if (!res.nextQuestion.options || res.nextQuestion.options.length < 2) {
    throw new Error("Options are insufficient!");
  }

  console.log("\n======================================================================");
  console.log("SUCCESS: Live AI Dynamic Question Engine verified end-to-end!");
  console.log("======================================================================");
}

main().catch(err => {
  console.error("FAIL:", err);
  process.exit(1);
});
