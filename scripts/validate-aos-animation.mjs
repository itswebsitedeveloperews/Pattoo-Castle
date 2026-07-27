import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const packagePath = fileURLToPath(new URL("../package.json", import.meta.url));
const layoutPath = fileURLToPath(new URL("../src/app/layout.jsx", import.meta.url));
const appPath = fileURLToPath(new URL("../src/App.jsx", import.meta.url));
const amenitiesPath = fileURLToPath(new URL("../src/AmenitiesSlider.jsx", import.meta.url));
const reservePath = fileURLToPath(new URL("../src/ReserveStaySection.jsx", import.meta.url));
const initializerPath = fileURLToPath(new URL("../src/AosInitializer.jsx", import.meta.url));

const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
const layout = readFileSync(layoutPath, "utf8");
const app = readFileSync(appPath, "utf8");
const amenities = readFileSync(amenitiesPath, "utf8");
const reserve = readFileSync(reservePath, "utf8");
const failures = [];

if (!packageJson.dependencies?.aos) {
  failures.push("package.json must include the aos dependency.");
}

if (!layout.includes("import 'aos/dist/aos.css'")) {
  failures.push("Root layout must import the AOS stylesheet globally.");
}

if (!app.includes("import AosInitializer from \"./AosInitializer\"")) {
  failures.push("App must import the AOS initializer.");
}

if (!app.includes("<AosInitializer />")) {
  failures.push("Home page must render the AOS initializer.");
}

const homepageSource = `${app}\n${amenities}\n${reserve}`;
const aosAttributeCount = (homepageSource.match(/data-aos=/g) || []).length;

if (aosAttributeCount < 8) {
  failures.push("Home page should add AOS reveal attributes to the main sections.");
}

const eventCardMatch = app.match(/<article[\s\S]*?className="event-card"[\s\S]*?<\/article>/);

if (!eventCardMatch?.[0].includes("data-aos-delay={String(index * 100)}")) {
  failures.push("Home event cards must reveal one by one with an AOS delay based on their index.");
}

try {
  const initializer = readFileSync(initializerPath, "utf8");

  if (!initializer.includes("\"use client\"")) {
    failures.push("AOS initializer must be a client component.");
  }

  if (!initializer.includes("AOS.init")) {
    failures.push("AOS initializer must initialize AOS.");
  }
} catch {
  failures.push("AOS initializer component is missing.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
