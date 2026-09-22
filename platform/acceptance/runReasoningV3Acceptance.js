import { runReasoningV3AcceptanceHarness } from './reasoningV3AcceptanceHarness.js';

const report = runReasoningV3AcceptanceHarness();
console.log(JSON.stringify(report, null, 2));
process.exit(report.passed ? 0 : 1);
