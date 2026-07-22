import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const homePagePath = fileURLToPath(new URL("../src/app/page.jsx", import.meta.url));
const bodyClassPath = fileURLToPath(new URL("../src/app/HomeBodyClass.jsx", import.meta.url));
const homePage = readFileSync(homePagePath, "utf8");
const bodyClass = readFileSync(bodyClassPath, "utf8");
const failures = [];

if (!homePage.includes("<HomeBodyClass />")) {
  failures.push("Home page must render HomeBodyClass.");
}

if (!bodyClass.includes("document.body.classList.add('home')")) {
  failures.push("HomeBodyClass must add the home class to body.");
}

if (!bodyClass.includes("document.body.classList.remove('home')")) {
  failures.push("HomeBodyClass must remove the home class on cleanup.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
