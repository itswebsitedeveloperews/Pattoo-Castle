import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cssPath = fileURLToPath(new URL("../src/App.css", import.meta.url));
const css = readFileSync(cssPath, "utf8");
const failures = [];

if (!css.includes(".reserve-stay-card::before")) {
  failures.push("App.css must add a .reserve-stay-card::before background layer.");
}

if (!css.includes('url("./assets/Images/stay-bg.webp")')) {
  failures.push("The reserve stay card background must use stay-bg.webp.");
}

if (!css.includes("opacity: 0.29")) {
  failures.push("The reserve stay card background image must use 29% opacity.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
