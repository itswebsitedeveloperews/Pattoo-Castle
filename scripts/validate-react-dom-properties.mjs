import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = fileURLToPath(new URL("../src/", import.meta.url));
const invalidProperties = [
  { pattern: /\bstroke-width=/g, replacement: "strokeWidth" },
  { pattern: /\bclass=/g, replacement: "className" },
];
const failures = [];

function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      visit(filePath);
      continue;
    }

    if (![".jsx", ".tsx"].includes(extname(entry.name))) {
      continue;
    }

    const source = readFileSync(filePath, "utf8");

    for (const { pattern, replacement } of invalidProperties) {
      const matches = source.match(pattern) || [];

      if (matches.length > 0) {
        failures.push(
          `${relative(srcDir, filePath)} has ${matches.length} invalid React DOM ${matches[0].slice(0, -1)} attribute(s); use ${replacement}.`,
        );
      }
    }
  }
}

visit(srcDir);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
