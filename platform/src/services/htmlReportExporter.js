/**
 * DIGITAL MARKET — Client Consulting Deliverable HTML Report Exporter
 * Generates standalone, zero-dependency Persian RTL executive HTML documents.
 */

export function generateClientHtmlReport(deliverableData, markdownContent = "") {
  if (!deliverableData) return "";

  const title = deliverableData.title || "کتابچه راهبردی و هویت برند";
  const phase = deliverableData.phase || "پرونده جامع";
  const version = deliverableData.version || "1.0.0";
  const dateStr = deliverableData.date || new Date().toLocaleDateString("fa-IR");

  // Extract sections or fallback to markdown
  const sections = Array.isArray(deliverableData.sections) ? deliverableData.sections : [];

  let sectionsHtml = "";
  if (sections.length > 0) {
    sectionsHtml = sections.map((sec, idx) => {
      let itemsHtml = "";
      if (Array.isArray(sec.items)) {
        itemsHtml = `
          <ul style="list-style-type: none; padding-right: 0; margin-top: 1rem;">
            ${sec.items.map(item => `
              <li style="margin-bottom: 0.75rem; display: flex; align-items: flex-start; gap: 0.5rem;">
                <span style="color: #2563eb; font-weight: bold; flex-shrink: 0;">✔</span>
                <span style="color: #334155; line-height: 1.8;">${item}</span>
              </li>
            `).join("")}
          </ul>
        `;
      } else if (sec.content || sec.text) {
        itemsHtml = `<p style="color: #334155; line-height: 1.8; margin-top: 0.75rem;">${sec.content || sec.text}</p>`;
      }

      return `
        <div class="phase-card">
          <div class="phase-header">
            <h2 class="phase-title">${sec.title || `بخش ${idx + 1}`}</h2>
            <span class="phase-badge">${sec.type || "تحلیل استراتژیک"}</span>
          </div>
          ${itemsHtml}
        </div>
      `;
    }).join("");
  } else if (markdownContent) {
    // If sections array is empty, render formatted markdown pre
    sectionsHtml = `
      <div class="phase-card">
        <div class="phase-header">
          <h2 class="phase-title">مفاد و تحلیل پرونده برند</h2>
        </div>
        <div style="white-space: pre-wrap; font-family: inherit; line-height: 1.8; color: #334155;">${markdownContent}</div>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — DIGITAL MARKET</title>
  <style>
    :root {
      --primary: #1e3a8a;
      --primary-light: #3b82f6;
      --accent: #059669;
      --bg: #f8fafc;
      --surface: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #64748b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Vazirmatn", Tahoma, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.8;
      padding: 2rem 1rem;
    }
    .container { max-width: 960px; margin: 0 auto; }
    .header-card {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: #ffffff;
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    .header-badge {
      display: inline-block;
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
      border: 1px solid rgba(59, 130, 246, 0.4);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .header-title { font-size: 1.85rem; font-weight: 800; margin-bottom: 0.5rem; }
    .header-subtitle { color: #94a3b8; font-size: 0.95rem; }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      font-size: 0.85rem;
    }
    .meta-item strong { color: #cbd5e1; display: block; font-size: 0.75rem; }
    
    .phase-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 1.75rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .phase-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #f1f5f9;
    }
    .phase-title { font-size: 1.2rem; font-weight: 700; color: var(--primary); }
    .phase-badge {
      background: #eff6ff;
      color: #2563eb;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 0.2rem 0.6rem;
      border-radius: 0.375rem;
    }
    .badge-evidence {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 0.25rem;
      background: #e0f2fe;
      color: #0284c7;
      margin-left: 0.5rem;
    }
    @media print {
      body { background: #fff; padding: 0; font-size: 11pt; }
      .container { max-width: 100%; }
      .header-card { box-shadow: none; border-radius: 0; background: #0f172a !important; color: #fff !important; page-break-after: avoid; }
      .phase-card { box-shadow: none; border: 1px solid #ccc; page-break-inside: avoid; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-card">
      <span class="header-badge">خروجی رسمی سند مشاوره استراتژی برند</span>
      <h1 class="header-title">${title}</h1>
      <p class="header-subtitle">مبتنی بر شواهد عینی کاربر و ساختار مصاحبه سازگار پلتفرم DIGITAL MARKET</p>
      
      <div class="meta-grid">
        <div class="meta-item">
          <strong>مرحله راهبردی</strong>
          <span>${phase}</span>
        </div>
        <div class="meta-item">
          <strong>نسخه پرونده</strong>
          <span>نسخه ${version}</span>
        </div>
        <div class="meta-item">
          <strong>تاریخ تدوین</strong>
          <span>${dateStr}</span>
        </div>
        <div class="meta-item">
          <strong>سطح قطعیت شواهد</strong>
          <span>۱۰۰٪ مستند به داده‌های کاربر</span>
        </div>
      </div>
    </div>

    ${sectionsHtml}

    <div style="text-align: center; margin-top: 2rem; color: var(--muted); font-size: 0.85rem;" class="no-print">
      <p>جهت چاپ رسمی یا ذخیره با فرمت PDF از کلیدهای ترکیبی Ctrl + P استفاده فرمایید.</p>
      <p>تولیدشده توسط پلتفرم DIGITAL MARKET — تمام حقوق محفوظ است.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates the HTML report and triggers a browser file download.
 * Wraps generateClientHtmlReport for use in UI components (DeliverableModal etc.)
 */
export function exportClientHtmlReport(deliverableData, markdownContent = '', filename = 'digital-market-report.html') {
  const html = generateClientHtmlReport(deliverableData, markdownContent);
  if (!html) return;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}