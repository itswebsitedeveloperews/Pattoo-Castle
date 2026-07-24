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
