import fs from 'fs';
import path from 'path';

// Mapping of knowledge node IDs to tags, sources, and related nodes
const ENRICHMENT_MAP = {
  // 00-system
  'KB-SYS-ARCH-001': {
    tags: ['system_architecture', 'state_machine', 'contracts', 'modularity', 'orchestration'],
    sources: ['SRC-INT-ARCH-V3', 'SRC-INT-CONTEXT-CONTRACT'],
    related_nodes: ['KB-SYS-WORKFLOW-001', 'KB-SYS-GATES-001', 'KB-SYS-STATE-001']
  },
  'KB-SYS-WORKFLOW-001': {
    tags: ['sequential_workflow', 'phase_transitions', 'handoff_contracts', 'execution_flow'],
    sources: ['SRC-INT-ARCH-V3'],
    related_nodes: ['KB-SYS-ARCH-001', 'KB-SYS-GATES-001']
  },
  'KB-SYS-GATES-001': {
    tags: ['phase_gates', 'veto_rules', 'gate_validation', 'readiness_criteria', 'exit_gates'],
    sources: ['SRC-INT-ARCH-V3', 'SRC-FOUNDATION-30'],
    related_nodes: ['KB-SYS-ARCH-001', 'KB-BIZ-ECON-001']
  },
  'KB-SYS-STATE-001': {
    tags: ['project_state', 'machine_readable', 'persistence', 'ledger', 'json_schema'],
    sources: ['SRC-INT-ARCH-V3'],
    related_nodes: ['KB-SYS-ARCH-001', 'KB-SYS-TRACE-001']
  },
  'KB-SYS-EVIDENCE-001': {
    tags: ['evidence_hierarchy', 'assumptions', 'epistemic_provenance', 'validation_gates'],
    sources: ['SRC-INT-OUTPUT-CONTRACT', 'SRC-FOUNDATION-13'],
    related_nodes: ['KB-SYS-ARCH-001', 'KB-RES-EVID-001']
  },
  'KB-SYS-TRACE-001': {
    tags: ['decision_traceability', 'provenance_chain', 'auditability', 'backward_trace'],
    sources: ['SRC-INT-ARCH-V3', 'SRC-INT-OUTPUT-CONTRACT'],
    related_nodes: ['KB-SYS-STATE-001', 'KB-SYS-EVIDENCE-001']
  },
  'KB-GOV-SOT-001': {
    tags: ['governance', 'single_source_of_truth', 'admissibility', 'provenance_policy'],
    sources: ['SRC-INT-WIKI-TRUST-CONTRACT'],
    related_nodes: ['KB-SYS-ARCH-001', 'KB-SYS-STATE-001']
  },

  // 01-business-foundation
  'KB-BIZ-MODEL-001': {
    tags: ['business_model', 'value_creation', 'value_capture', 'business_architecture', 'foundation'],
    sources: ['SRC-FOUNDATION-14', 'SRC-FOUNDATION-28'],
    related_nodes: ['KB-BIZ-REV-001', 'KB-BIZ-ECON-001', 'KB-STR-VP-001']
  },
  'KB-BIZ-STAGE-001': {
    tags: ['business_stage', 'maturity_levels', 'certainty_degree', 'idea_stage', 'active_business'],
    sources: ['SRC-FOUNDATION-03', 'SRC-FOUNDATION-11'],
    related_nodes: ['KB-BIZ-MODEL-001', 'KB-RES-DEMAND-001']
  },
  'KB-BIZ-REV-001': {
    tags: ['revenue_models', 'monetization', 'pricing_mechanisms', 'subscription', 'transactional', 'retainer'],
    sources: ['SRC-FOUNDATION-05', 'SRC-FOUNDATION-30'],
    related_nodes: ['KB-BIZ-MODEL-001', 'KB-BIZ-ECON-001']
  },
  'KB-BIZ-SALES-001': {
    tags: ['sales_models', 'b2b_sales', 'b2c_sales', 'buyer_decision_process', 'sales_motion'],
    sources: ['SRC-FOUNDATION-23', 'SRC-FOUNDATION-24'],
    related_nodes: ['KB-BIZ-MODEL-001', 'KB-BIZ-CHANNEL-001']
  },
  'KB-BIZ-CHANNEL-001': {
    tags: ['acquisition_channels', 'distribution', 'marketing_channels', 'channel_fit', 'go_to_market'],
    sources: ['SRC-FOUNDATION-17', 'SRC-FOUNDATION-19'],
    related_nodes: ['KB-BIZ-SALES-001', 'KB-BIZ-ECON-001']
  },
  'KB-BIZ-GOALS-001': {
    tags: ['strategic_goals', '90_day_milestones', 'paired_indicators', 'okr', 'execution_targets'],
    sources: ['SRC-FOUNDATION-28', 'SRC-FOUNDATION-29'],
    related_nodes: ['KB-BIZ-MODEL-001', 'KB-SYS-GATES-001']
  },
  'KB-BIZ-ECON-001': {
    tags: ['unit_economics', 'cac', 'ltv', 'payback_period', 'contribution_margin', 'toc'],
    sources: ['SRC-FOUNDATION-30', 'SRC-FOUNDATION-05'],
    related_nodes: ['KB-BIZ-MODEL-001', 'KB-BIZ-REV-001', 'KB-KPI-SAAS-001']
  },

  // 02-market-research
  'KB-RES-MKT-001': {
    tags: ['market_intelligence', 'ecosystem_analysis', 'macro_environment', 'industry_dynamics'],
    sources: ['SRC-FOUNDATION-06', 'SRC-FOUNDATION-09', 'SRC-IR-SCI-FAMILY'],
    related_nodes: ['KB-RES-COMP-001', 'KB-RES-CUST-001']
  },
  'KB-RES-CUST-001': {
    tags: ['customer_research', 'jobs_to_be_done', 'jtbd', 'customer_struggles', 'pain_points'],
    sources: ['SRC-FOUNDATION-12', 'SRC-FOUNDATION-13'],
    related_nodes: ['KB-RES-MKT-001', 'KB-RES-SEG-001', 'KB-STR-VP-001']
  },
  'KB-RES-COMP-001': {
    tags: ['competitor_analysis', 'behavioral_alternatives', 'five_forces', 'competitive_matrix'],
    sources: ['SRC-FOUNDATION-09', 'SRC-FOUNDATION-10'],
    related_nodes: ['KB-RES-MKT-001', 'KB-STR-DIFF-001']
  },
  'KB-RES-SEG-001': {
    tags: ['market_segmentation', 'stp', 'core_focus', 'customer_profiles', 'target_audience'],
    sources: ['SRC-FOUNDATION-19', 'SRC-FOUNDATION-01'],
    related_nodes: ['KB-RES-CUST-001', 'KB-STR-TARGET-001']
  },
  'KB-RES-DEMAND-001': {
    tags: ['demand_validation', 'market_friction', 'adoption_barriers', 'mom_test', 'willingness_to_pay'],
    sources: ['SRC-FOUNDATION-13', 'SRC-FOUNDATION-03'],
    related_nodes: ['KB-RES-CUST-001', 'KB-RES-PRICE-001']
  },
  'KB-RES-PRICE-001': {
    tags: ['pricing_research', 'price_elasticity', 'consumer_surplus', 'van_westendorp', 'perceived_value'],
    sources: ['SRC-FOUNDATION-05', 'SRC-FOUNDATION-07'],
    related_nodes: ['KB-BIZ-REV-001', 'KB-BIZ-ECON-001']
  },
  'KB-RES-EVID-001': {
    tags: ['evidence_quality', 'data_reliability', 'empirical_evidence', 'risk_mitigation', 'survey_bias'],
    sources: ['SRC-FOUNDATION-13', 'SRC-INT-OUTPUT-CONTRACT'],
    related_nodes: ['KB-SYS-EVIDENCE-001', 'KB-RES-MKT-001']
  },

  // 03-strategy
  'KB-STR-TARGET-001': {
    tags: ['target_market', 'buyer_persona', 'beachhead_market', 'ideal_customer_profile', 'icp'],
    sources: ['SRC-FOUNDATION-19', 'SRC-FOUNDATION-22'],
    related_nodes: ['KB-RES-SEG-001', 'KB-STR-POS-001']
  },
  'KB-STR-POS-001': {
    tags: ['positioning', 'mindshare', 'mental_space', 'strategic_clarity', 'category_ownership'],
    sources: ['SRC-FOUNDATION-09', 'SRC-FOUNDATION-15', 'SRC-FOUNDATION-19'],
    related_nodes: ['KB-STR-TARGET-001', 'KB-STR-DIFF-001', 'KB-STR-VP-001']
  },
  'KB-STR-DIFF-001': {
    tags: ['differentiation', 'only_ness_statement', 'defensible_advantage', 'purple_cow', 'uniqueness'],
    sources: ['SRC-FOUNDATION-09', 'SRC-FOUNDATION-22'],
    related_nodes: ['KB-STR-POS-001', 'KB-RES-COMP-001']
  },
  'KB-STR-VP-001': {
    tags: ['value_proposition', 'pain_relievers', 'gain_creators', 'value_map', 'customer_profile'],
    sources: ['SRC-FOUNDATION-14', 'SRC-FOUNDATION-12'],
    related_nodes: ['KB-RES-CUST-001', 'KB-STR-POS-001', 'KB-STR-PROMISE-001']
  },
  'KB-STR-PROMISE-001': {
    tags: ['brand_promise', 'unbreakable_commitment', 'guarantee_policy', 'execution', 'trust'],
    sources: ['SRC-FOUNDATION-04', 'SRC-FOUNDATION-21'],
    related_nodes: ['KB-STR-VP-001', 'KB-STR-PROOF-001']
  },
  'KB-STR-PILLARS-001': {
    tags: ['strategic_pillars', 'guiding_policy', 'kernel_of_strategy', 'coherent_actions', 'strategic_focus'],
    sources: ['SRC-FOUNDATION-10', 'SRC-FOUNDATION-28'],
    related_nodes: ['KB-STR-POS-001', 'KB-BIZ-GOALS-001']
  },
  'KB-STR-PROOF-001': {
    tags: ['reasons_to_believe', 'rtb', 'proof_points', 'social_proof', 'credibility', 'trust_signals'],
    sources: ['SRC-FOUNDATION-21', 'SRC-FOUNDATION-07'],
    related_nodes: ['KB-STR-PROMISE-001', 'KB-STR-VP-001']
  },

  // 04-brand-identity
  'KB-IDN-CHAR-001': {
    tags: ['brand_character', 'archetypes', 'psychological_soul', 'jungian_archetypes', 'brand_archetype'],
    sources: ['SRC-FOUNDATION-18', 'SRC-FOUNDATION-01'],
    related_nodes: ['KB-IDN-PERSON-001', 'KB-IDN-GUARD-001']
  },
  'KB-IDN-PERSON-001': {
    tags: ['brand_personality', 'brand_traits', 'behavioral_posture', 'emotional_connection'],
    sources: ['SRC-FOUNDATION-16', 'SRC-FOUNDATION-18'],
    related_nodes: ['KB-IDN-CHAR-001', 'KB-MSG-VOICE-001']
  },
  'KB-IDN-GUARD-001': {
    tags: ['identity_guardrails', 'red_lines', 'emotional_boundaries', 'brand_integrity', 'tone_limits'],
    sources: ['SRC-FOUNDATION-18', 'SRC-FOUNDATION-10'],
    related_nodes: ['KB-IDN-CHAR-001', 'KB-MSG-VOCAB-001']
  },

  // 05-verbal-identity
  'KB-MSG-VOICE-001': {
    tags: ['brand_voice', 'verbal_identity', 'consistent_voice', 'personality_expression', 'tone_of_voice'],
    sources: ['SRC-FOUNDATION-18', 'SRC-FOUNDATION-20'],
    related_nodes: ['KB-IDN-PERSON-001', 'KB-MSG-TONE-001']
  },
  'KB-MSG-TONE-001': {
    tags: ['brand_tone', 'tone_matrix', 'contextual_adaptation', 'situational_tone', 'communication_style'],
    sources: ['SRC-FOUNDATION-20', 'SRC-FOUNDATION-25'],
    related_nodes: ['KB-MSG-VOICE-001', 'KB-MSG-CORE-001']
  },
  'KB-MSG-CORE-001': {
    tags: ['message_pillars', 'elevator_hook', '30_second_pitch', 'core_narrative', 'value_hook'],
    sources: ['SRC-FOUNDATION-07', 'SRC-FOUNDATION-21'],
    related_nodes: ['KB-STR-VP-001', 'KB-MSG-TONE-001']
  },
  'KB-MSG-VOCAB-001': {
    tags: ['brand_vocabulary', 'forbidden_words', 'lexicon', 'verbal_guardrails', 'preferred_terms'],
    sources: ['SRC-FOUNDATION-20', 'SRC-FOUNDATION-25'],
    related_nodes: ['KB-MSG-VOICE-001', 'KB-IDN-GUARD-001']
  },

  // 06-naming
  'KB-NAM-STRAT-001': {
    tags: ['naming_strategy', 'semantic_territories', 'brand_name_generation', 'name_ideation'],
    sources: ['SRC-FOUNDATION-15', 'SRC-FOUNDATION-17'],
    related_nodes: ['KB-NAM-EVAL-001', 'KB-NAM-TAG-001']
  },
  'KB-NAM-EVAL-001': {
    tags: ['naming_evaluation', 'phonetics', 'trademark_screening', 'linguistic_test', 'persian_latin_spelling'],
    sources: ['SRC-FOUNDATION-17', 'SRC-FOUNDATION-20'],
    related_nodes: ['KB-NAM-STRAT-001', 'KB-STR-POS-001']
  },
  'KB-NAM-TAG-001': {
    tags: ['tagline', 'slogan', 'brand_catchphrase', 'mnemonic_devices', 'brand_hook'],
    sources: ['SRC-FOUNDATION-07', 'SRC-FOUNDATION-15'],
    related_nodes: ['KB-NAM-STRAT-001', 'KB-STR-PROMISE-001']
  },

  // 07-business-types
  'KB-TYPE-LOCAL-001': {
    tags: ['local_service', 'automotive', 'salon', 'geo_targeted', 'physical_first', 'reputation'],
    sources: ['SRC-FOUNDATION-26', 'SRC-FOUNDATION-30'],
    related_nodes: ['KB-BIZ-MODEL-001', 'KB-BIZ-ECON-001']
  },
  'KB-TYPE-HOSP-001': {
    tags: ['restaurant_cafe', 'hospitality', 'food_waste', 'dining_experience', 'table_turnover', 'menu_engineering'],
    sources: ['SRC-FOUNDATION-01', 'SRC-FOUNDATION-30'],
    related_nodes: ['KB-BIZ-MODEL-001', 'KB-BIZ-ECON-001']
  },
  'KB-TYPE-SAAS-001': {
    tags: ['b2b_saas', 'cloud_software', 'subscription', 'churn_reduction', 'time_to_value', 'mrr'],
    sources: ['SRC-FOUNDATION-30', 'SRC-FOUNDATION-27'],
    related_nodes: ['KB-BIZ-REV-001', 'KB-KPI-SAAS-001']
  },
  'KB-TYPE-MFG-001': {
    tags: ['manufacturing', 'industrial_b2b', 'production_capacity', 'machining', 'supply_chain', 'dso'],
    sources: ['SRC-FOUNDATION-09', 'SRC-FOUNDATION-30'],
    related_nodes: ['KB-BIZ-MODEL-001', 'KB-BIZ-ECON-001']
  },
  'KB-TYPE-ECOM-001': {
    tags: ['ecommerce', 'dtc_retail', 'cart_abandonment', 'returns_management', 'sizing_policy', 'logistics'],
    sources: ['SRC-FOUNDATION-17', 'SRC-IR-ECOM-FAMILY', 'SRC-IR-DIGIKALA-FAMILY'],
    related_nodes: ['KB-BIZ-REV-001', 'KB-BIZ-ECON-001']
  },

  // 08-personal-brand
  'KB-PB-FOUNDER-001': {
    tags: ['founder_brand', 'personal_branding', 'executive_presence', 'business_alignment', 'founder_equity'],
    sources: ['SRC-FOUNDATION-01', 'SRC-FOUNDATION-22'],
    related_nodes: ['KB-PB-THOUGHT-001', 'KB-BIZ-MODEL-001']
  },
  'KB-PB-THOUGHT-001': {
    tags: ['thought_leadership', 'point_of_view', 'content_operating_system', 'industry_influence', 'pr_podcast'],
    sources: ['SRC-FOUNDATION-22', 'SRC-FOUNDATION-28'],
    related_nodes: ['KB-PB-FOUNDER-001', 'KB-MSG-CORE-001']
  },

  // 09-metrics
  'KB-KPI-BRAND-001': {
    tags: ['brand_kpis', 'brand_equity_metrics', 'brand_salience', 'nps', 'brand_resonance'],
    sources: ['SRC-FOUNDATION-15', 'SRC-FOUNDATION-26'],
    related_nodes: ['KB-STR-POS-001', 'KB-IDN-CHAR-001']
  },
  'KB-KPI-SAAS-001': {
    tags: ['saas_kpis', 'mrr', 'arr', 'churn_rate', 'ltv_cac', 'net_revenue_retention', 'nrr'],
    sources: ['SRC-FOUNDATION-30'],
    related_nodes: ['KB-TYPE-SAAS-001', 'KB-BIZ-ECON-001']
  },

  // 10-playbooks
  'KB-PLAY-CRISIS-001': {
    tags: ['crisis_management', 'reputation_defense', 'pr_playbook', 'stakeholder_communication', 'escalation'],
    sources: ['SRC-FOUNDATION-25', 'SRC-FOUNDATION-28'],
    related_nodes: ['KB-STR-PROMISE-001', 'KB-IDN-GUARD-001']
  },

  // 11-glossary
  'KB-GLOSS-BRAND-001': {
    tags: ['branding_glossary', 'terminology', 'definitions', 'frameworks', 'concepts_index'],
    sources: ['SRC-FOUNDATION-15', 'SRC-FOUNDATION-16', 'SRC-FOUNDATION-18'],
    related_nodes: ['KB-STR-POS-001', 'KB-IDN-CHAR-001']
  },

  // 15-visual-identity
  'KB-VIS-DSYS-001': {
    tags: ['design_system', 'visual_tokens', 'design_governance', 'ui_kit', 'brand_assets'],
    sources: ['SRC-INT-PHASE7-VISUAL-CONTRACT'],
    related_nodes: ['KB-VIS-LOGO-001', 'KB-VIS-COLOR-001', 'KB-VIS-TYPO-001']
  },
  'KB-VIS-LOGO-001': {
    tags: ['logo_system', 'logo_morphology', 'monochrome_contrast', 'responsive_logo', 'visual_symbol'],
    sources: ['SRC-INT-PHASE7-VISUAL-CONTRACT'],
    related_nodes: ['KB-VIS-DSYS-001', 'KB-NAM-STRAT-001']
  },
  'KB-VIS-COLOR-001': {
    tags: ['color_system', 'color_psychology', 'palette_tokens', 'wcag_contrast', 'monochrome_hierarchy'],
    sources: ['SRC-INT-PHASE7-VISUAL-CONTRACT'],
    related_nodes: ['KB-VIS-DSYS-001', 'KB-IDN-CHAR-001']
  },
  'KB-VIS-TYPO-001': {
    tags: ['typography_system', 'persian_typography', 'font_hierarchy', 'legibility', 'type_scale'],
    sources: ['SRC-INT-PHASE7-VISUAL-CONTRACT'],
    related_nodes: ['KB-VIS-DSYS-001', 'KB-MSG-VOICE-001']
  }
};

// Function to recursively get markdown files
function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const full = path.join(dir, item.name);
    if (item.isDirectory() && !['generated', 'migration', 'snapshots'].includes(item.name)) {
      results = results.concat(getFiles(full));
    } else if (item.name.endsWith('.md') && !['INDEX.md', 'README.md'].includes(item.name)) {
      results.push(full);
    }
  }
  return results;
}

const files = getFiles(path.resolve('wiki'));
let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const idMatch = content.match(/^id:\s*(KB-[A-Z0-9-]+)/m);
  if (!idMatch) continue;
  const id = idMatch[1];
  const enrichment = ENRICHMENT_MAP[id];

  // 1. Ensure tags in frontmatter
  if (!/^tags:/m.test(content)) {
    let tagsList = enrichment?.tags || [];
    if (!tagsList.length) {
      // Derive tags from category and filename
      const rel = path.relative(path.resolve('wiki'), file).replace(/\\/g, '/');
      const parts = rel.replace('.md', '').split('/');
      tagsList = parts.map(p => p.replace(/^[0-9]+-/, '').replace(/-/g, '_'));
    }
    const tagsYaml = `tags: [${tagsList.map(t => `'${t}'`).join(', ')}]`;
    content = content.replace(/^(id:\s*KB-[A-Z0-9-]+)/m, `$1\n${tagsYaml}`);
  }

  // 2. Ensure sources in frontmatter
  if (!/^sources?:/m.test(content) && enrichment?.sources?.length) {
    const sourcesYaml = `sources: [${enrichment.sources.map(s => `'${s}'`).join(', ')}]`;
    content = content.replace(/^(tags:\s*\[[^\]]*\])/m, `$1\n${sourcesYaml}`);
  }

  // 3. Ensure related_nodes in frontmatter
  if (!/^related_nodes:/m.test(content) && enrichment?.related_nodes?.length) {
    const nodesYaml = `related_nodes: [${enrichment.related_nodes.map(n => `'${n}'`).join(', ')}]`;
    content = content.replace(/^(related_phases:\s*\[[^\]]*\])/m, `$1\n${nodesYaml}`);
  }

  fs.writeFileSync(file, content, 'utf8');
  updatedCount++;
}

console.log(`Successfully enriched frontmatter of ${updatedCount} wiki articles with tags, sources, and graph connections.`);
