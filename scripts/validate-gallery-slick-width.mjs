import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cssPath = fileURLToPath(new URL("../src/App.css", import.meta.url));
const css = readFileSync(cssPath, "utf8");
const failures = [];

if (!css.includes("width: min(100% - 48px, 1677px);")) {
  failures.push("Gallery preview wrapper must have a bounded responsive width.");
}

if (!css.includes(".gallery-preview-slick") || !css.includes(".gallery-preview-slick .slick-list")) {
  failures.push("Gallery Slick elements must have explicit width/height rules.");
}

if (!css.includes(".gallery-preview-slick .slick-track")) {
  failures.push("Gallery Slick track must be explicitly sized.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
