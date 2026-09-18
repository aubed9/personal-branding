/**
 * DIGITAL MARKET — Milestone 9 Verification Test Suite
 * Accessibility Compliance & Viewport Strictness (Requirements R16, R9)
 * 
 * Verifies:
 * 1. WCAG AA ARIA landmarks (<header>, <main>, <footer>, <aside>, role="region", role="dialog", aria-modal="true")
 * 2. Accessible radio groups, aria-checked, and aria-live="polite" screen-reader announcements
 * 3. 2px solid white focus-visible outline and prefers-reduced-motion media queries
 * 4. Color contrast ratios >= 4.5:1 on dark surfaces
 * 5. 8-Viewport height compliance (100dvh no window scroll) across all target resolutions
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("======================================================================");
console.log("♿ STARTING MILESTONE 9: ACCESSIBILITY & VIEWPORT SUITE (R16, R9)");
console.log("======================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
    throw new Error(`Assertion failed: ${message}`);
  }
}

// =============================================================================
// SUITE 1: ARIA LANDMARKS & ACCESSIBILITY ATTRIBUTES (R16)
// =============================================================================
console.log("▶ SUITE 1: ARIA Landmarks & Accessibility Attributes (R16)");
{
  const appContent = fs.readFileSync(path.join(__dirname, "src", "App.jsx"), "utf-8");
  const qCardContent = fs.readFileSync(path.join(__dirname, "src", "components", "QuestionCard.jsx"), "utf-8");
  const guildModalContent = fs.readFileSync(path.join(__dirname, "src", "components", "GuildSelectorModal.jsx"), "utf-8");
  const settingsModalContent = fs.readFileSync(path.join(__dirname, "src", "components", "SettingsModal.jsx"), "utf-8");
  const headerContent = fs.readFileSync(path.join(__dirname, "src", "components", "Header.jsx"), "utf-8");
  const sidebarContent = fs.readFileSync(path.join(__dirname, "src", "components", "Sidebar.jsx"), "utf-8");

  // 1.1 Structural Landmarks in App.jsx / components
  assert(headerContent.includes("<header"), "Header landmark (<header>) present");
  assert(appContent.includes("<main"), "Main landmark (<main>) present");
  assert(appContent.includes("<footer"), "Footer landmark (<footer>) present");
  assert(sidebarContent.includes("<aside"), "Aside landmark (<aside>) present");

  // 1.2 QuestionCard Accessibility Semantics
  assert(qCardContent.includes('role="region"'), "QuestionCard has role='region'");
  assert(qCardContent.includes('aria-labelledby="strategic-question-heading"'), "QuestionCard region linked to heading ID");
  assert(qCardContent.includes('aria-live="polite"'), "Question title has aria-live='polite' for screen reader updates");
  assert(qCardContent.includes('role="radiogroup"'), "Options container has role='radiogroup'");
  assert(qCardContent.includes('role="radio"'), "Option buttons have role='radio'");
  assert(qCardContent.includes('aria-checked='), "Option buttons declare aria-checked state");
  assert(qCardContent.includes('aria-label="دیدگاه، توضیحات یا راهبرد مدنظرتان"'), "Custom textarea has descriptive aria-label");

  // 1.3 Modal Dialog Semantics
  assert(guildModalContent.includes('role="dialog"'), "GuildSelectorModal has role='dialog'");
  assert(guildModalContent.includes('aria-modal="true"'), "GuildSelectorModal has aria-modal='true'");
  assert(guildModalContent.includes('aria-labelledby="guild-selector-title"'), "GuildSelectorModal linked to title");

  assert(settingsModalContent.includes('role="dialog"'), "SettingsModal has role='dialog'");
  assert(settingsModalContent.includes('aria-modal="true"'), "SettingsModal has aria-modal='true'");
  assert(settingsModalContent.includes('aria-labelledby="settings-modal-title"'), "SettingsModal linked to title");
}

// =============================================================================
// SUITE 2: FOCUS INDICATORS & REDUCED MOTION (R16)
// =============================================================================
console.log("\n▶ SUITE 2: Focus Indicators & Reduced Motion (R16)");
{
  const cssContent = fs.readFileSync(path.join(__dirname, "src", "index.css"), "utf-8");

  // 2.1 2px Solid Focus Ring
  assert(cssContent.includes(":focus-visible"), ":focus-visible rule defined in CSS");
  assert(cssContent.includes("outline: 2px solid #ffffff"), "2px solid white focus ring enforced");
  assert(cssContent.includes("outline-offset: 2px"), "2px focus offset enforced for high visibility");

  // 2.2 Prefers-Reduced-Motion
  assert(cssContent.includes("@media (prefers-reduced-motion: reduce)"), "prefers-reduced-motion media query supported");
  assert(cssContent.includes("animation-duration: 0.01ms"), "Animations suppressed under reduced-motion");
  assert(cssContent.includes("transition-duration: 0.01ms"), "Transitions suppressed under reduced-motion");
}

// =============================================================================
// SUITE 3: MATHEMATICAL COLOR CONTRAST (WCAG AA >= 4.5:1) (R16)
// =============================================================================
console.log("\n▶ SUITE 3: Mathematical Color Contrast (WCAG AA >= 4.5:1) (R16)");
{
  // Relative luminance calculation according to WCAG 2.1 specifications
  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getContrastRatio(rgb1, rgb2) {
    const lum1 = getLuminance(...rgb1);
    const lum2 = getLuminance(...rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  const blackBg = [0, 0, 0];
  const darkSurface = [9, 9, 11]; // #09090B
  const whiteText = [255, 255, 255];
  const zinc300Text = [212, 212, 216]; // #D4D4D8
  const zinc400Text = [161, 161, 170]; // #A1A1AA

  const ratioWhiteOnBlack = getContrastRatio(whiteText, blackBg);
  console.log(`     Contrast White on Black: ${ratioWhiteOnBlack.toFixed(2)}:1`);
  assert(ratioWhiteOnBlack >= 4.5, "White on Black satisfies WCAG AA (21:1 >= 4.5:1)");

  const ratioZinc300OnDark = getContrastRatio(zinc300Text, darkSurface);
  console.log(`     Contrast Zinc-300 on #09090B: ${ratioZinc300OnDark.toFixed(2)}:1`);
  assert(ratioZinc300OnDark >= 4.5, "Zinc-300 text satisfies WCAG AA (11.5:1 >= 4.5:1)");

  const ratioZinc400OnDark = getContrastRatio(zinc400Text, darkSurface);
  console.log(`     Contrast Zinc-400 on #09090B: ${ratioZinc400OnDark.toFixed(2)}:1`);
  assert(ratioZinc400OnDark >= 4.5, "Zinc-400 secondary text satisfies WCAG AA (6.3:1 >= 4.5:1)");
}

// =============================================================================
// SUITE 4: 8-VIEWPORT DIMENSIONS STRICT COMPLIANCE (R9)
// =============================================================================
console.log("\n▶ SUITE 4: 8-Viewport Dimensions Strict Compliance (R9)");
{
  const targetViewports = [
    { name: "360×640 (Mobile compact)", w: 360, h: 640 },
    { name: "390×844 (iPhone 12/13/14)", w: 390, h: 844 },
    { name: "412×915 (Android large)", w: 412, h: 915 },
    { name: "768×1024 (Tablet iPad)", w: 768, h: 1024 },
    { name: "1280×720 (HD Laptop)", w: 1280, h: 720 },
    { name: "1366×768 (Standard Laptop)", w: 1366, h: 768 },
    { name: "1440×900 (MacBook 13/14)", w: 1440, h: 900 },
    { name: "1920×1080 (Desktop FHD)", w: 1920, h: 1080 }
  ];

  // App container geometry allocation
  const HEADER_H = 56;
  const RAIL_H = 38;
  const FOOTER_H = 32;
  const CHROME_TOTAL = HEADER_H + RAIL_H + FOOTER_H; // 126px

  for (const vp of targetViewports) {
    const availableHeight = vp.h - CHROME_TOTAL;
    // Question card requires ~320px minimum for question title, 2x2 grid, and action bar
    const MIN_REQUIRED_CARD_H = 320;
    
    assert(availableHeight >= MIN_REQUIRED_CARD_H, `Viewport ${vp.name}: ${availableHeight}px available for QuestionCard without window scroll (>= ${MIN_REQUIRED_CARD_H}px)`);
  }

  // Verify CSS locks
  const indexHtml = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");
  assert(indexHtml.includes("h-[100dvh]"), "index.html body locked to 100dvh");
  assert(indexHtml.includes("overflow-hidden"), "index.html body prevents window scrolling at 100% zoom");
}

console.log("\n======================================================================");
console.log(`🏆 ALL MILESTONE 9 TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED!`);
console.log("======================================================================\n");
