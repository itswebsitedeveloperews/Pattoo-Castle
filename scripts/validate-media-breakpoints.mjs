import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cssFiles = [
  fileURLToPath(new URL("../src/App.css", import.meta.url)),
  fileURLToPath(new URL("../src/index.css", import.meta.url)),
];
const allowedWidthBreakpoints = new Set(["1440px", "1279px", "1024px", "767px"]);
const failures = [];

for (const filePath of cssFiles) {
  const css = readFileSync(filePath, "utf8");
  const fileName = filePath.split(/[\\/]/).at(-1);
  const mediaQueries = css.matchAll(/@media[^{]+/g);
  const breakpointCounts = new Map();

  for (const [query] of mediaQueries) {
    const widthMatches = query.matchAll(/\b(?:max|min)-width:\s*([^)]+)/g);

    for (const [, breakpoint] of widthMatches) {
      const normalized = breakpoint.trim();

      if (!allowedWidthBreakpoints.has(normalized)) {
        failures.push(`${fileName} uses unsupported media breakpoint ${normalized} in: ${query.trim()}`);
      }

      breakpointCounts.set(normalized, (breakpointCounts.get(normalized) || 0) + 1);
    }
  }

  for (const [breakpoint, count] of breakpointCounts) {
    if (count > 1) {
      failures.push(`${fileName} uses max-width breakpoint ${breakpoint} ${count} times; use it once per file.`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
