import { readFileSync } from "node:fs";

const galleryGrid = readFileSync("src/GalleryFilterGrid.jsx", "utf8");
const appCss = readFileSync("src/App.css", "utf8");

const checks = [
  {
    label: "gallery cards use a lightbox trigger around images",
    source: galleryGrid,
    fragments: [
      'className="gallery-filter-lightbox-trigger"',
      "openLightbox(index)",
      "<img src={item.imageSrc} alt=\"\" />",
    ],
  },
  {
    label: "gallery lightbox renders as a modal dialog",
    source: galleryGrid,
    fragments: [
      'className="gallery-lightbox"',
      'role="dialog"',
      "aria-modal=\"true\"",
      "selectedImage.imageSrc",
    ],
  },
  {
    label: "gallery lightbox has close and gallery navigation controls",
    source: galleryGrid,
    fragments: ["closeLightbox", "showPreviousImage", "showNextImage"],
  },
  {
    label: "gallery lightbox overlay and trigger styles exist",
    source: appCss,
    fragments: [
      ".gallery-filter-lightbox-trigger",
      ".gallery-lightbox",
      ".gallery-lightbox-image",
      ".gallery-lightbox-control",
    ],
  },
  {
    label: "tablet gallery cards use equal columns with centered odd final card",
    source: appCss,
    fragments: [
      "grid-template-columns: repeat(2, minmax(0, 1fr));",
      ".gallery-filter-card:first-child,",
      ".gallery-filter-card:last-child:nth-child(odd) {",
      "grid-column: 1 / -1;",
      "justify-self: center;",
      "width: calc((100% - 8px) / 2);",
    ],
  },
  {
    label: "mobile gallery lightbox uses responsive viewport sizing",
    source: appCss,
    fragments: [
      ".gallery-lightbox {",
      "padding: 64px 14px 72px;",
      ".gallery-lightbox-frame {",
      "width: 100%;",
      "max-height: calc(100vh - 136px);",
      ".gallery-lightbox-control--previous {",
      "left: 16px;",
      ".gallery-lightbox-control--next {",
      "right: 16px;",
    ],
  },
];

const failures = checks.filter(({ source, fragments }) =>
  fragments.some((fragment) => !source.includes(fragment)),
);

if (failures.length > 0) {
  console.error(
    failures.map(({ label }) => `Missing: ${label}`).join("\n"),
  );
  process.exit(1);
}

console.log("Gallery filter images open in a lightbox gallery.");
