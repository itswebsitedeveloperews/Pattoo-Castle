import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const failures = [];

function read(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, root)), "utf8");
}

const app = read("src/App.jsx");
const headerPath = fileURLToPath(new URL("src/SiteHeader.jsx", root));
const footerPath = fileURLToPath(new URL("src/SiteFooter.jsx", root));

if (!existsSync(headerPath)) {
  failures.push("SiteHeader must live in src/SiteHeader.jsx.");
}

if (!existsSync(footerPath)) {
  failures.push("SiteFooter must live in src/SiteFooter.jsx.");
}

if (/export function SiteHeader|function SiteHeader/.test(app)) {
  failures.push("App.jsx must not define SiteHeader.");
}

if (/export function SiteFooter|function SiteFooter/.test(app)) {
  failures.push("App.jsx must not define SiteFooter.");
}

if (!app.includes('import SiteHeader from "./SiteHeader"')) {
  failures.push("App.jsx must import SiteHeader from its own file.");
}

if (!app.includes('import SiteFooter from "./SiteFooter"')) {
  failures.push("App.jsx must import SiteFooter from its own file.");
}

const pageFiles = [
  "src/AboutPage.jsx",
  "src/AccommodationPage.jsx",
  "src/ContactPage.jsx",
  "src/EventDetailsPage.jsx",
  "src/EventsPage.jsx",
  "src/GalleryPage.jsx",
  "src/LocationPage.jsx",
  "src/OverviewPage.jsx",
  "src/PrivacyPolicyPage.jsx",
  "src/StayPage.jsx",
  "src/TermsConditionPage.jsx",
];

for (const path of pageFiles) {
  const source = read(path);

  if (source.includes("SiteHeader,") || source.includes("SiteFooter,")) {
    failures.push(`${path} must not import SiteHeader/SiteFooter from App.jsx.`);
  }

  if (!source.includes('import SiteHeader from "./SiteHeader"')) {
    failures.push(`${path} must import SiteHeader from its own file.`);
  }

  if (!source.includes('import SiteFooter from "./SiteFooter"')) {
    failures.push(`${path} must import SiteFooter from its own file.`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
