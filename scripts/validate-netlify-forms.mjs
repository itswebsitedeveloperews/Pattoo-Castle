import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const failures = [];

function read(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, root)), "utf8");
}

function exists(relativePath) {
  return existsSync(fileURLToPath(new URL(relativePath, root)));
}

for (const [path, formName] of [
  ["src/ContactPage.jsx", "contact"],
  ["src/StayPage.jsx", "stay-inquiry"],
  ["src/EventDetailsPage.jsx", "event-inquiry"],
]) {
  const source = read(path);

  if (!source.includes(`name="${formName}"`)) {
    failures.push(`${path} must set Netlify form name "${formName}".`);
  }

  if (!source.includes('method="POST"')) {
    failures.push(`${path} form must submit with method="POST".`);
  }

  if (!source.includes('data-netlify="true"')) {
    failures.push(`${path} form must enable Netlify form handling.`);
  }

  if (!source.includes(`name="form-name"`) || !source.includes(`value="${formName}"`)) {
    failures.push(`${path} form must include hidden form-name value "${formName}".`);
  }
}

const eventDetails = read("src/EventDetailsPage.jsx");

if (!eventDetails.includes('encType="multipart/form-data"')) {
  failures.push("Event inquiry form must use multipart encoding for file uploads.");
}

if (!exists("public/netlify-forms.html")) {
  failures.push("Static Netlify form registration file must exist.");
}

const registration = exists("public/netlify-forms.html")
  ? read("public/netlify-forms.html")
  : "";

for (const formName of ["contact", "stay-inquiry", "event-inquiry"]) {
  if (!registration.includes(`name="${formName}"`)) {
    failures.push(`Static Netlify registration must include "${formName}".`);
  }

  if (!registration.includes(`value="${formName}"`)) {
    failures.push(`Static Netlify registration must include form-name value "${formName}".`);
  }
}

if (!registration.includes('name="proposal"') || !registration.includes('type="file"')) {
  failures.push("Static Netlify registration must include the event proposal file field.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
