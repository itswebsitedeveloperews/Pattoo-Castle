import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const failures = [];

function read(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, root)), "utf8");
}

function readOptional(relativePath) {
  try {
    return read(relativePath);
  } catch {
    failures.push(`${relativePath} is missing.`);
    return "";
  }
}

const layout = read("src/app/layout.jsx");
const seo = readOptional("src/lib/seo.js");

if (!seo.includes("https://pattoocastle.com")) {
  failures.push("SEO helper must use the verified production site URL.");
}

if (!seo.includes("robots: { index: true, follow: true }")) {
  failures.push("SEO helper must mark pages as indexable and followable.");
}

if (!layout.includes("metadataBase")) {
  failures.push("Root layout must define metadataBase for canonical URLs.");
}

if (!layout.includes("title:")) {
  failures.push("Root layout must define a default title.");
}

if (!layout.includes("template: '%s | Pattoo Castle Jamaica'")) {
  failures.push("Root layout must append '| Pattoo Castle Jamaica' to page titles.");
}

if (layout.includes("template: '%s | Pattoo Castle'") || layout.includes('template: "%s | Pattoo Castle"')) {
  failures.push("Root layout must not append the old '| Pattoo Castle' suffix.");
}

for (const [path, pageTitle] of [
  ["/about/", "About"],
  ["/accommodation/", "Accommodation"],
  ["/contact/", "Contact"],
  ["/events/", "Events"],
  ["/gallery/", "Gallery"],
  ["/location/", "Explore Negril"],
  ["/overview/", "Villa Overview"],
  ["/stay/", "Reserve Your Stay"],
  ["/privacy-policy/", "Privacy Policy"],
  ["/terms-condition/", "Terms and Conditions"],
]) {
  if (!seo.includes(`title: "${pageTitle}"`)) {
    failures.push(`${path} title must be "${pageTitle}".`);
  }
}

const appSource = read("src/App.jsx");

if (!appSource.includes("export function getContentfulImage(asset)")) {
  failures.push("App must expose a Contentful image helper that returns src and title-based alt text.");
}

if (!appSource.includes("alt: getContentfulAssetAlt(asset)")) {
  failures.push("Contentful image helper must use the asset Title field as alt text.");
}

const routeMetadata = [
  ["src/app/page.jsx", 'createMetadata("/")'],
  ["src/app/about/page.jsx", 'createMetadata("/about/")'],
  ["src/app/accommodation/page.jsx", 'createMetadata("/accommodation/")'],
  ["src/app/contact/page.jsx", 'createMetadata("/contact/")'],
  ["src/app/events/page.jsx", 'createMetadata("/events/")'],
  ["src/app/gallery/page.jsx", 'createMetadata("/gallery/")'],
  ["src/app/location/page.jsx", 'createMetadata("/location/")'],
  ["src/app/overview/page.jsx", 'createMetadata("/overview/")'],
  ["src/app/stay/page.jsx", 'createMetadata("/stay/")'],
  ["src/app/privacy-policy/page.jsx", 'createMetadata("/privacy-policy/")'],
  ["src/app/terms-condition/page.jsx", 'createMetadata("/terms-condition/")'],
];

for (const [path, expected] of routeMetadata) {
  const source = read(path);

  if (!source.includes("export const metadata")) {
    failures.push(`${path} must export metadata.`);
  }

  if (!source.includes(expected)) {
    failures.push(`${path} must set canonical metadata with ${expected}.`);
  }
}

const eventDetailsRoute = read("src/app/events/[slug]/page.jsx");

if (!eventDetailsRoute.includes("export async function generateMetadata")) {
  failures.push("Event detail route must generate metadata per slug.");
}

if (!eventDetailsRoute.includes('createMetadata(`/events/${slug}/`')) {
  failures.push("Event detail route must set canonical metadata per slug.");
}

if (eventDetailsRoute.includes("`${title} Pattoo Castle Jamaica`")) {
  failures.push("Event detail route must use the root title template, not append Pattoo Castle Jamaica directly.");
}

const contentImageSources = [
  "src/App.jsx",
  "src/AboutPage.jsx",
  "src/AccommodationPage.jsx",
  "src/AmenitiesSlider.jsx",
  "src/ContactPage.jsx",
  "src/EventsPage.jsx",
  "src/GalleryFilterGrid.jsx",
  "src/GalleryPage.jsx",
  "src/GalleryPreviewSlider.jsx",
  "src/LocationPage.jsx",
  "src/OverviewPage.jsx",
  "src/ReserveStaySection.jsx",
  "src/StayPage.jsx",
];

const imageTitleFlowChecks = [
  ["src/App.jsx", "introImage: getContentfulImage(fields.introImage)"],
  ["src/App.jsx", ".map((asset) => getContentfulImage(asset))"],
  ["src/App.jsx", "alt={homePage.introImage.alt"],
  ["src/App.jsx", "alt={image.alt"],
  ["src/SiteHeader.jsx", "alt={header.logo.alt"],
  ["src/AboutPage.jsx", "villaImage: getContentfulImage(fields.villaImage)"],
  ["src/AboutPage.jsx", "alt={about.villaImage.alt"],
  ["src/AccommodationPage.jsx", "alt={item.image.alt"],
  ["src/GalleryFilterGrid.jsx", "alt={item.image.alt"],
  ["src/GalleryPreviewSlider.jsx", "alt={slides[previousIndex].alt"],
  ["src/LocationPage.jsx", "alt={location.locationImage.alt"],
  ["src/StayPage.jsx", "alt={stay.experienceImage.alt"],
];

for (const [path, expected] of imageTitleFlowChecks) {
  const source = path === "src/App.jsx" ? appSource : read(path);

  if (!source.includes(expected)) {
    failures.push(`${path} must use Contentful image Title field alt flow: ${expected}`);
  }
}

const forbiddenAltPatterns = [
  /<img[^>]*src=\{item\.imageSrc\}[^>]*alt=""/,
  /<img[^>]*src=\{imageSrc\}[^>]*alt=""/,
  /<img[^>]*src=\{image\}[^>]*alt=""/,
  /<img[^>]*src=\{slides\[[^\]]+\]\}[^>]*alt=""/,
  /<img[^>]*src=\{selectedImage\.imageSrc\}[^>]*alt=""/,
  /<img[^>]*src=\{[a-zA-Z]+\.villaImage\}[^>]*alt=""/,
  /<img[^>]*src=\{[a-zA-Z]+\.memoriesImage\}[^>]*alt=""/,
  /<img[^>]*src=\{[a-zA-Z]+\.experienceImage\}[^>]*alt=""/,
  /<img[^>]*src=\{[a-zA-Z]+\.locationImage\}[^>]*alt=""/,
  /<img[^>]*src=\{[a-zA-Z]+\.findUsImage\}[^>]*alt=""/,
  /<img[^>]*src=\{homePage\.introImage\}[^>]*alt=""/,
];

for (const path of contentImageSources) {
  const source = read(path);

  for (const pattern of forbiddenAltPatterns) {
    if (pattern.test(source)) {
      failures.push(`${path} has a content image with empty alt text.`);
      break;
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
