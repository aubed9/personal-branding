import { buildCanonicalOutputClaims } from '../projections/output/claims.js';
import { projectPhaseDeliverable } from '../projections/output/phaseProjection.js';
import { projectSemanticMaster } from '../projections/output/masterProjection.js';

export function generateDeliverable(
  phaseNum,
  phaseData = {},
  businessContext = null,
  decisions = [],
  facts = [],
  unknowns = [],
  metadata = {}
) {
  const phase = ['master', 'all'].includes(phaseNum) ? 'master' : Number(phaseNum);
  if (phase !== 'master' && (!Number.isInteger(phase) || phase < 1 || phase > 8)) {
    throw new Error('شماره فاز نامعتبر است.');
  }

  const state = {
    ...metadata,
    phaseData,
    businessContext,
    decisions,
    facts,
    unknowns,
    contradictions: metadata.contradictions || [],
  };

  const model = buildCanonicalOutputClaims({
    phaseData,
    businessContext,
    unknowns,
    contradictions: state.contradictions,
    metadata: state,
  });

  if (phase !== 'master') {
    return projectPhaseDeliverable(phase, state, model);
  }

  const phaseDocuments = Array.from({ length: 8 }, (_, index) =>
    projectPhaseDeliverable(index + 1, state, model)
  );
  return projectSemanticMaster(state, model, phaseDocuments);
}

function markdownSection(section, level = 2) {
  const hashes = '#'.repeat(level);
  let text = `${hashes} ${section.title}\n\n`;

  if (section.status) text += `وضعیت بخش: ${section.status}\n\n`;
  for (const [key, value] of Object.entries(section.content || {})) {
    text += `- ${key}: ${value}\n`;
  }
  for (const item of section.items || []) text += `- ${item}\n`;
  for (const item of section.checklist || []) text += `- [ ] ${item}\n`;

  if (section.formulas?.length) {
    text += '\n' + '#'.repeat(level + 1) + ' محاسبات\n\n';
    for (const formula of section.formulas) {
      text += `- [CALCULATION] ${formula.name}: ${formula.formula}. ${formula.description || ''}\n`;
    }
  }

  if (section.kpis?.length) {
    text += '\n' + '#'.repeat(level + 1) + ' سنجه‌های فعال\n\n';
    text += '| شاخص | ماژول | فرمول/مبنا | هدف |\n|---|---|---|---|\n';
    for (const kpi of section.kpis) {
      const escape = value => String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
      text += `| ${escape(kpi.metric)} | ${escape(kpi.moduleId)} | ${escape(kpi.formula || 'نیازمند baseline')} | ${escape(kpi.green)} |\n`;
    }
  }

  for (const subsection of section.subsections || []) {
    text += '\n' + markdownSection(subsection, Math.min(level + 1, 6));
  }
  return text + '\n';
}

export function deliverableToMarkdown(data) {
  let text = `# ${data.title}\n\nنسخه ${data.version} | ${data.date} | وضعیت: ${data.status}\nRevision: ${data.sourceRevision || 0}\n\n`;
  for (const section of data.sections || []) text += markdownSection(section, 2);
  text += [
    '---',
    '',
    'این سند projection از Claimهای canonical پروژه است.',
    'USER_FACT به معنی گفته کاربر است و بدون Source خارجی، تأیید مستقل محسوب نمی‌شود.',
    'PROPOSAL تصمیم کاربر نیست؛ فقط پس از پذیرش صریح می‌تواند به USER_DECISION تبدیل شود.',
    'Claim دارای STALE / NEEDS_REVIEW / BLOCKED نباید به‌عنوان نتیجه قطعی استفاده شود.',
    '',
  ].join('\n');
  return text;
}
