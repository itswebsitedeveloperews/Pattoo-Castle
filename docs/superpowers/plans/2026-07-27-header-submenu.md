# Header Submenu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Contentful-powered desktop and mobile submenu behavior to the site header.

**Architecture:** Normalize submenu references in `getHeaderContent()`, render submenu-aware links in `HeaderMenuLink`, and coordinate mobile accordion state in `SiteHeader`. Keep desktop opening CSS-driven and mobile opening React-state-driven.

**Tech Stack:** Next.js 16, React 19, Contentful entries, existing CSS in `src/App.css`, Node validation scripts.

## Global Constraints

- Desktop submenus open on hover and keyboard focus.
- Mobile submenus open on click.
- Mobile menu behaves like an accordion with one submenu open at a time.
- Items without submenus keep rendering as normal links.
- Do not add dependencies.

---

### Task 1: Add Submenu Regression Validation

**Files:**
- Create: `scripts/validate-header-submenu.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `src/App.jsx`, `src/HeaderMenuLink.jsx`, `src/SiteHeader.jsx`, `src/App.css`
- Produces: `npm.cmd run test:header-submenu`

- [ ] **Step 1: Write the failing validation script**

```js
import { readFileSync } from "node:fs";

const files = {
  app: readFileSync("src/App.jsx", "utf8"),
  headerLink: readFileSync("src/HeaderMenuLink.jsx", "utf8"),
  siteHeader: readFileSync("src/SiteHeader.jsx", "utf8"),
  css: readFileSync("src/App.css", "utf8"),
};

const checks = [
  [files.app.includes("subMenuItems"), "Header content must normalize subMenuItems."],
  [files.app.includes("itemFields.subMenu"), "Header content must read the Contentful subMenu field."],
  [files.headerLink.includes("header-menu-item--has-submenu"), "HeaderMenuLink must render a submenu wrapper class."],
  [files.headerLink.includes("header-submenu"), "HeaderMenuLink must render submenu markup."],
  [files.siteHeader.includes("openMobileSubmenuIndex"), "SiteHeader must track open mobile submenu state."],
  [files.siteHeader.includes("setOpenMobileSubmenuIndex"), "SiteHeader must update mobile submenu state."],
  [files.css.includes(".header-menu-item--has-submenu:hover .header-submenu"), "CSS must open desktop submenu on hover."],
  [files.css.includes(".header-menu-item--has-submenu:focus-within .header-submenu"), "CSS must open desktop submenu on keyboard focus."],
  [files.css.includes(".header-menu-item--mobile.header-menu-item--open .header-submenu"), "CSS must open mobile submenu when the item is active."],
];

const failures = checks.filter(([passes]) => !passes).map(([, message]) => message);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd run test:header-submenu`
Expected: FAIL because the script command or submenu implementation is missing.

- [ ] **Step 3: Add the package script**

```json
"test:header-submenu": "node scripts/validate-header-submenu.mjs"
```

- [ ] **Step 4: Run test to verify it fails for missing implementation**

Run: `npm.cmd run test:header-submenu`
Expected: FAIL with submenu-specific validation messages.

### Task 2: Implement Header Submenus

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/SiteHeader.jsx`
- Modify: `src/HeaderMenuLink.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: Header menu items shaped as `{ name: string, url: string, subMenuItems: Array<{ name: string, url: string }> }`
- Produces: Desktop hover/focus submenu and mobile accordion submenu rendering.

- [ ] **Step 1: Normalize submenu data**

Update `getHeaderContent()` so each menu entry maps `itemFields.subMenu` to `subMenuItems`.

- [ ] **Step 2: Add mobile state**

Update `SiteHeader` to import `useState`, track `openMobileSubmenuIndex`, pass desktop links `variant="desktop"`, and pass mobile links `variant="mobile"`, `isOpen`, and `onToggle`.

- [ ] **Step 3: Render submenu-aware links**

Update `HeaderMenuLink` to render plain links for items without children and submenu wrappers for items with children.

- [ ] **Step 4: Add submenu CSS**

Add desktop dropdown styles and mobile accordion styles to `src/App.css`.

- [ ] **Step 5: Run targeted validation**

Run: `npm.cmd run test:header-submenu`
Expected: PASS.

- [ ] **Step 6: Run broader verification**

Run: `npm.cmd run lint`
Expected: Exit 0.

Run: `node_modules\.bin\next.cmd build`
Expected: Exit 0.
