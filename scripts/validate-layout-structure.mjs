import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = fileURLToPath(new URL("../src/", import.meta.url));
const pageFiles = readdirSync(srcDir)
  .filter((fileName) => fileName.endsWith("Page.jsx") || fileName === "App.jsx")
  .map((fileName) => join(srcDir, fileName));

const failures = [];

for (const filePath of pageFiles) {
  const source = readFileSync(filePath, "utf8");

  if (!source.includes("SiteHeader") || !source.includes("SiteFooter")) {
    continue;
  }

  const returnIndex = source.indexOf("return (");
  const headerIndex = source.indexOf("<SiteHeader", returnIndex);
  const mainOpenIndex = source.indexOf("<main", returnIndex);
  const mainCloseIndex = source.indexOf("</main>", returnIndex);
  const footerIndex = source.indexOf("<SiteFooter", returnIndex);

  if (headerIndex === -1 || mainOpenIndex === -1 || mainCloseIndex === -1 || footerIndex === -1) {
    failures.push(`${basename(filePath)} is missing a header, main, or footer in the returned layout.`);
    continue;
  }

  if (!(headerIndex < mainOpenIndex && mainOpenIndex < mainCloseIndex && mainCloseIndex < footerIndex)) {
    failures.push(`${basename(filePath)} must render SiteHeader before main and SiteFooter after main.`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
