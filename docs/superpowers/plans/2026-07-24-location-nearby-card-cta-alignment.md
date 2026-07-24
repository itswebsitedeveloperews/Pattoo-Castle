# Location Nearby Card CTA Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align every Location “Explore Nearby” CTA on one shared horizontal baseline while keeping each CTA label and arrow on one line.

**Architecture:** Preserve the existing grid and JSX. Make each nearby card a full-height column flex container, then let its CTA absorb unused vertical space above itself; verify the CSS contract with a focused source validation.

**Tech Stack:** Next.js 16, React 19, CSS Grid/Flexbox, Node.js validation scripts

## Global Constraints

- Change only the location nearby-card CSS and its focused validation.
- Do not change JSX, Contentful fields, or content.
- Preserve the existing four-column desktop and one-column mobile layouts.
- Allow titles and descriptions to wrap normally.
- Keep CTA labels and arrows on one line.

---

### Task 1: Align Nearby-Card CTAs

**Files:**
- Create: `scripts/validate-location-nearby-cta-alignment.mjs`
- Modify: `src/App.css:2361-2396`
- Modify: `package.json`

**Interfaces:**
- Consumes: Existing `.location-nearby-card` and `.text-link` class names.
- Produces: A CSS contract in which cards are column flex containers and their CTAs are bottom-aligned, plus `npm run test:location-nearby-cta`.

- [ ] **Step 1: Write the failing validation**

```js
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cssPath = fileURLToPath(new URL("../src/App.css", import.meta.url));
const css = readFileSync(cssPath, "utf8");
const failures = [];
const cardRule = css.match(/\.location-nearby-card\s*\{([^}]*)\}/)?.[1] || "";
const linkRule =
  css.match(/\.location-nearby-card\s+\.text-link\s*\{([^}]*)\}/)?.[1] || "";

if (!/display:\s*flex\s*;/.test(cardRule)) {
  failures.push("Nearby cards must use flex layout.");
}

if (!/flex-direction:\s*column\s*;/.test(cardRule)) {
  failures.push("Nearby cards must arrange content in a column.");
}

if (!/margin-top:\s*auto\s*;/.test(linkRule)) {
  failures.push("Nearby-card CTAs must absorb remaining vertical space.");
}

if (!/white-space:\s*nowrap\s*;/.test(linkRule)) {
  failures.push("Nearby-card CTA text must stay on one line.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
```

Add the package script:

```json
"test:location-nearby-cta": "node scripts/validate-location-nearby-cta-alignment.mjs"
```

- [ ] **Step 2: Run the focused validation and confirm RED**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run test:location-nearby-cta
```

Expected: exit 1 with failures for the missing card flex layout, automatic CTA margin, and nowrap rule.

- [ ] **Step 3: Implement the minimal CSS**

Update the card rule:

```css
.location-nearby-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
```

Replace the nearby-card anchor selector and spacing with:

```css
.location-nearby-card .text-link {
  display: inline-flex;
  align-self: flex-start;
  margin-top: auto;
  padding-top: 16px;
  white-space: nowrap;
}
```

Retain the existing color, typography, and text-decoration declarations in that rule.

- [ ] **Step 4: Run focused and existing validations**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run test:location-nearby-cta
& 'C:\Program Files\nodejs\npm.cmd' run test:layout
& 'C:\Program Files\nodejs\npm.cmd' run test:media
& 'C:\Program Files\nodejs\npm.cmd' run lint
```

Expected: all commands exit 0.

- [ ] **Step 5: Verify the running page**

Request `http://localhost:3000/location` and confirm HTTP 200. Inspect the rendered stylesheet and verify the four desktop cards share equal grid-track height, with each CTA pushed to the card bottom; confirm the one-column mobile rule remains unchanged.

- [ ] **Step 6: Commit**

```powershell
git add src/App.css package.json scripts/validate-location-nearby-cta-alignment.mjs docs/superpowers/plans/2026-07-24-location-nearby-card-cta-alignment.md
git commit -m "fix: align location nearby card links"
```

If Git is unavailable in the environment, report that limitation without blocking the verified implementation.
