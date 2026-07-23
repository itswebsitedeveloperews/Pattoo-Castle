import { readFileSync } from "node:fs";

const eventsPage = readFileSync("src/EventsPage.jsx", "utf8");
const appCss = readFileSync("src/App.css", "utf8");

const checks = [
  {
    label: "events host image links to buttonUrl when available",
    source: eventsPage,
    fragments: [
      'className="events-host-card-image-link"',
      "href={item.buttonUrl}",
      '<img src={item.imageSrc} alt="" />',
    ],
  },
  {
    label: "events host heading links to buttonUrl when available",
    source: eventsPage,
    fragments: [
      'className="events-host-card-title-link"',
      "href={item.buttonUrl}",
      "{item.title}",
    ],
  },
  {
    label: "events host CTA keeps distinct button styling",
    source: eventsPage,
    fragments: ['className="events-host-card-button"'],
  },
  {
    label: "events host cards stretch content vertically",
    source: appCss,
    fragments: [".events-host-card {", "display: flex;", "flex-direction: column;"],
  },
  {
    label: "events host buttons align to the bottom of each card",
    source: appCss,
    fragments: [".events-host-card-button {", "margin-top: auto;"],
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

console.log("Events host card image and heading links are wired.");
