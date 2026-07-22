import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const files = [
  fileURLToPath(new URL("../src/App.jsx", import.meta.url)),
  fileURLToPath(new URL("../src/GalleryPage.jsx", import.meta.url)),
];

const failures = [];

for (const filePath of files) {
  const source = readFileSync(filePath, "utf8");
  const fileName = filePath.split(/[\\/]/).at(-1);

  if (!source.includes("logoSrc: getFirstContentfulAssetSrc(reserveYourStayDateFields.images)")) {
    failures.push(`${fileName} must map reserveYourStayDate.images to reserveYourStayDate.logoSrc.`);
  }

  if (!source.includes("logoSrc={") || !source.includes(".reserveYourStayDate.logoSrc")) {
    failures.push(`${fileName} must pass reserveYourStayDate.logoSrc to ReserveStaySection.`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
