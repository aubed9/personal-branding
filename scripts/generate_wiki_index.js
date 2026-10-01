import fs from 'fs';
import path from 'path';

const registryContent = fs.readFileSync('wiki/registry.yaml', 'utf8');
const lines = registryContent.split(/\r?\n/);
let currentId = null;
const nodes = {};

for (const line of lines) {
  const m = line.match(/^  (KB-[A-Z0-9-]+):\s*$/);
  if (m) { currentId = m[1]; nodes[currentId] = { id: currentId }; continue; }
  if (currentId) {
    const t = line.match(/^    title:\s*(.+)$/);
    if (t) nodes[currentId].title = t[1].trim().replace(/^"/, '').replace(/"$/, '');
    const f = line.match(/^    file:\s*(.+)$/);
    if (f) nodes[currentId].file = f[1].trim().replace(/^wiki\//, '');
    const c = line.match(/^    category:\s*(.+)$/);
    if (c) nodes[currentId].category = c[1].trim();
  }
}

const byCat = {};
Object.values(nodes).forEach(n => {
  byCat[n.category] = byCat[n.category] || [];
  byCat[n.category].push(n);
});

const sourceRegistry = JSON.parse(fs.readFileSync('wiki/source-registry.json', 'utf8')).sources;
const nodeCount = Object.keys(nodes).length;
const sourceCount = Object.keys(sourceRegistry).length;

let md = `# نمایه جامع پایگاه دانش دیجیتال مارکت (Knowledge Wiki Index)

> پایگاه دانش رسمی، ساخت‌یافته و مبتنی بر شواهد سیستم ساخت برند و تصمیم‌گیری کسب‌وکار **DIGITAL MARKET**.  
> این مخزن حاوی **${nodeCount} گره دانشی استاندارد** با شناسه‌های پایدار (\`KB-...\`)، **${sourceCount} منبع مستند و معتبر** (\`SRC-...\`)، اتصالات گراف معنایی، ۳۰ نظریه بنیادین علمی و راهنماهای کاربردی بازار ایران است.

---

## 🗺️ ناوبری بر اساس فازهای استراتژیک (Phase Navigation)

### 🔹 فازهای سیستمی و حاکمیتی (00 & 12)
`;

byCat['00-system']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});
byCat['12-governance']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});

md += `\n### 🔹 فاز ۱: کشف و بنیاد کسب‌وکار (Phase 1 Foundation)\n`;
byCat['01-business-foundation']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});

md += `\n### 🔹 فاز ۲: هوش بازار و پژوهش مشتری (Phase 2 Intelligence)\n`;
byCat['02-market-research']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});

md += `\n### 🔹 فاز ۳: استراتژی و جهت‌گیری برند (Phase 3 Strategy)\n`;
byCat['03-strategy']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});

md += `\n### 🔹 فاز ۴: هویت و شخصیت برند (Phase 4 Character)\n`;
byCat['04-brand-identity']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});

md += `\n### 🔹 فاز ۵: سیستم هویت کلامی و پیام‌رسانی (Phase 5 Verbal)\n`;
byCat['05-verbal-identity']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});

md += `\n### 🔹 فاز ۶: نام‌گذاری، شعار و جهت‌گیری خلاقانه (Phase 6 Naming)\n`;
byCat['06-naming']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});

md += `\n### 🔹 فاز ۷: سیستم طراحی هویت بصری (Phase 7 Visual Identity)\n`;
byCat['15-visual-identity']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});

md += `\n### 🔹 فاز ۸: فعال‌سازی اجرایی و مدیریت اعتبار (Phase 8 Activation)\n`;
byCat['08-personal-brand']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});
byCat['10-playbooks']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});

md += `\n---

## 🏢 مدل‌ها و کهن‌الگوهای کسب‌وکار (Business Archetypes)

`;
byCat['07-business-types']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});

md += `\n---

## ⚙️ ماژول‌های تصمیم‌گیری تخصصی (39 Decision Modules)

این ماژول‌ها موتور تصمیم‌گیری تطبیقی سیستم را در بافتارهای ویژه (B2B، B2C، سلامت، خدمات محلی، خرده‌فروشی آنلاین، تولید و مقیاس‌پذیری) هدایت می‌کنند:

| شناسه ماژول | عنوان ماژول دانشی | دسته بافتاری |
| :--- | :--- | :--- |
`;

byCat['13-decision-modules']?.forEach(n => {
  const catName = n.file.includes('domain-') ? 'دامنه تخصصی صنف' : 'قواعد تصمیم‌گیری زنجیره';
  md += `| [\`${n.id}\`](${n.file}) | ${n.title} | ${catName} |\n`;
});

md += `\n---

## 📊 شواهد کلان، پولی و داده‌های بازار ایران (Iran Macro & Platform Evidence)

| شناسه گره | عنوان مدرک آماری | مأخذ و وضعیت اعتبار |
| :--- | :--- | :--- |
`;

byCat['14-iran-evidence']?.forEach(n => {
  md += `| [\`${n.id}\`](${n.file}) | ${n.title} | مأخذ رسمی تأییدشده |\n`;
});

md += `\n---

## 📈 سنجه‌ها و واژه‌نامه‌های تخصصی (Metrics & Glossaries)

`;
byCat['09-metrics']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});
byCat['11-glossary']?.forEach(n => {
  md += `- [\`${n.id}\`](${n.file}) — ${n.title}\n`;
});

md += `\n---

## 📚 ۳۰ منبع بنیادین علمی و استراتژیک جهان (The 30 Canonical Foundations)

تمامی استنتاجات و پیشنهادات استراتژیک سیستم به این ۳۰ مرجع علمی متصل هستند:

| شناسه منبع | عنوان کتاب / اثر | نویسنده / مرجع | مفهوم محوری |
| :--- | :--- | :--- | :--- |
`;

for (let i = 1; i <= 30; i++) {
  const id = 'SRC-FOUNDATION-' + String(i).padStart(2, '0');
  const src = sourceRegistry[id];
  if (src) {
    const concept = src.core_concept ? src.core_concept.slice(0, 60) + '...' : 'مفاهیم تخصصی تصمیم‌گیری';
    md += `| \`${src.id}\` | ${src.title} | ${src.author_or_institution} | ${concept} |\n`;
  }
}

md += `\n---

## 🇮🇷 مراجع داده‌ای اقتصاد، بسترها و قوانین ایران (Iran Market & Evidence Sources)

| شناسه منبع | نهاد / گزارش | شاخص‌های کلیدی قابل استخراج | حوزه استفاده |
| :--- | :--- | :--- | :--- |
| \`SRC-IR-SCI-FAMILY\` | درگاه ملی آمار ایران (amar.org.ir) | تورم CPI، بودجه خانوار، هرم جمعیتی | فاز ۱، ۲، ۳ |
| \`SRC-IR-CBI-FAMILY\` | بانک مرکزی ایران (cbi.ir) | نقدینگی M2، نرخ ارز، تورم تولیدکننده PPI | فاز ۱، ۲ |
| \`SRC-IR-CODAL-FAMILY\` | سامانه ناشران بورسی کدال (codal.ir) | حاشیه سود واقعی صنایع، دوره وصول DSO | فاز ۱، ۸ |
| \`SRC-IR-ECOM-FAMILY\` | مرکز توسعه تجارت الکترونیکی (enamad.ir) | گردش مالی ایکامرس، آمار نماد اعتماد | فاز ۱، ۲، ۸ |
| \`SRC-IR-SHAPARAK-FAMILY\` | شبکه پرداخت شاپرک (shaparak.ir) | ارزش و تعداد تراکنش‌های بانکی کارتی | فاز ۲، ۸ |
| \`SRC-IR-DIGIKALA-FAMILY\` | گزارش سالانه گروه دیجی‌کالا | رفتار سبد خرید آنلاین، پدیده Down-trading و طلای دیجیتال | فاز ۱، ۲، ۳، ۸ |
| \`SRC-IR-SNAPP-FAMILY\` | گزارش عملکرد گروه اسنپ | سفارش آنلاین غذا، سفرهای شهری و رفتار روزمره | فاز ۱، ۲، ۸ |
| \`SRC-IR-NAJVA-REPORT-1404-FIRST-PARTY\` | گزارش سالانه پلتفرم نجوا ۱۴۰۴ | نرخ کلیک و اثر شخصی‌سازی پیامک در بازاریابی بازگشتی | فاز ۲، ۵، ۸ |
| \`SRC-IR-BAZAAR-FAMILY\` | گزارش سالانه کافه‌بازار | سیستم‌عامل اندروید، پرداخت درون‌برنامه‌ای | فاز ۲، ۸ |
| \`SRC-IR-ADTECH-FAMILY\` | گزارش بازاریابی دیجیتال یکتانت/تپسل | هزینه کلیک CPC، نرخ کلیک CTR، هزینه CAC | فاز ۱، ۲، ۸ |

---
*ثبت رسمی و تطبیق ساختاری در رجیستری سیستمی: \`wiki/registry.yaml\` و \`wiki/source-registry.json\`*
`;

fs.writeFileSync('wiki/INDEX.md', md, 'utf8');
console.log(`Successfully generated full wiki/INDEX.md covering all ${nodeCount} nodes and ${sourceCount} sources!`);
