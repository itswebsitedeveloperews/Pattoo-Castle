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

function hasRequiredField(source, fieldName) {
  const pattern = new RegExp(
    `<(?:input|select|textarea)[^>]*name="${fieldName}"[^>]*required`,
  );

  return pattern.test(source);
}

for (const [path, formName] of [
  ["src/ContactPage.jsx", "contact"],
  ["src/StayPage.jsx", "stay-inquiry"],
  ["src/EventDetailsPage.jsx", "event-inquiry"],
]) {
  const source = read(path);

  if (!source.includes("NetlifyForm")) {
    failures.push(`${path} must use the no-reload NetlifyForm wrapper.`);
  }

  if (!source.includes(`formName="${formName}"`)) {
    failures.push(`${path} must set Netlify form name "${formName}".`);
  }
}

const netlifyForm = read("src/NetlifyForm.jsx");

for (const expected of [
  "event.preventDefault()",
  "useRef",
  "isSubmittingRef.current",
  "form.reportValidity()",
  'const formAction = "/netlify-forms.html"',
  "isMultipartForm",
  "URLSearchParams(formData).toString()",
  '"Content-Type": "application/x-www-form-urlencoded"',
  'method: "POST"',
  "new FormData(form)",
  'data-netlify="true"',
  'name="form-name"',
  "form.reset()",
]) {
  if (!netlifyForm.includes(expected)) {
    failures.push(`NetlifyForm must include ${expected}.`);
  }
}

for (const [path, formId] of [
  ["src/StayPage.jsx", "stay-inquiry-form"],
  ["src/EventDetailsPage.jsx", "event-inquiry-form"],
]) {
  const source = read(path);

  if (source.includes(`form="${formId}"`)) {
    failures.push(`${path} submit button must not use redundant form="${formId}".`);
  }
}

const eventDetails = read("src/EventDetailsPage.jsx");
const stayPage = read("src/StayPage.jsx");

if (!exists("src/MinTodayDateInput.jsx")) {
  failures.push("All standalone date inputs must use the client-side today min helper.");
}

const minTodayDateInput = exists("src/MinTodayDateInput.jsx")
  ? read("src/MinTodayDateInput.jsx")
  : "";

for (const expected of [
  '"use client"',
  "toLocaleDateString",
  'type="date"',
  "min={today}",
  "required",
  "showPicker",
  "onClick={openDatePicker}",
  "onFocus={openDatePicker}",
]) {
  if (!minTodayDateInput.includes(expected)) {
    failures.push(`MinTodayDateInput must include ${expected}.`);
  }
}

for (const fieldName of ["decisionDate", "arrivalDate", "departureDate"]) {
  if (!eventDetails.includes("<MinTodayDateInput") || !eventDetails.includes(`name="${fieldName}"`)) {
    failures.push(`EventDetailsPage must use MinTodayDateInput for "${fieldName}".`);
  }
}

if (!exists("src/StayDateRangeFields.jsx")) {
  failures.push("Stay inquiry date inputs must use a client-side date range helper.");
}

const stayDateRangeFields = exists("src/StayDateRangeFields.jsx")
  ? read("src/StayDateRangeFields.jsx")
  : "";

for (const expected of [
  '"use client"',
  "toLocaleDateString",
  "getNextDateInputValue(checkInDate)",
  "checkInDate ? getNextDateInputValue(checkInDate) : today",
  'min={checkoutMinDate}',
  'name="checkIn"',
  'name="checkOut"',
  "showPicker",
  "onClick={openDatePicker}",
  "onFocus={openDatePicker}",
]) {
  if (!stayDateRangeFields.includes(expected)) {
    failures.push(`StayDateRangeFields must include ${expected}.`);
  }
}

if (!stayPage.includes("<StayDateRangeFields />")) {
  failures.push("StayPage must use StayDateRangeFields for linked check-in and check-out dates.");
}

for (const label of ["First Name *", "Last Name *", "Email *"]) {
  if (!stayPage.includes(`<span>${label}</span>`)) {
    failures.push(`Stay inquiry form must show required marker for "${label}".`);
  }
}

for (const label of ["Check-in Date *", "Check-Out Date *"]) {
  if (!stayDateRangeFields.includes(`<span>${label}</span>`)) {
    failures.push(`Stay inquiry date fields must show required marker for "${label}".`);
  }
}

for (const label of [
  "Event Type *",
  "Estimated Number Of Attendees *",
  "Estimated Guest Room Count *",
  "Decision Date *",
  "Preferred Arrival Date *",
  "Preferred Departure Date *",
  "I am The *",
  "Title *",
  "First Name *",
  "Event Type *",
  "Address *",
  "City *",
  "State *",
  "Postal Code *",
  "Email Address *",
  "Phone *",
]) {
  if (!eventDetails.includes(`<span>${label}</span>`)) {
    failures.push(`Event inquiry form must show required marker for "${label}".`);
  }
}

if (!eventDetails.includes('encType="multipart/form-data"')) {
  failures.push("Event inquiry form must use multipart encoding for file uploads.");
}

for (const [path, fields] of [
  ["src/ContactPage.jsx", ["firstName", "lastName", "email", "phone", "comments"]],
  ["src/StayPage.jsx", ["firstName", "lastName", "email", "phone", "details"]],
  [
    "src/EventDetailsPage.jsx",
    [
      "eventType",
      "attendees",
      "guestRooms",
      "datesFlexible",
      "contactRole",
      "title",
      "firstName",
      "contactEventType",
      "address",
      "city",
      "state",
      "postalCode",
      "email",
      "phone",
    ],
  ],
]) {
  const source = read(path);

  for (const field of fields) {
    if (!hasRequiredField(source, field)) {
      failures.push(`${path} must require "${field}" before submit.`);
    }
  }
}

if (eventDetails.includes('name="proposal"\n        required') || eventDetails.includes('name="proposal" required')) {
  failures.push("Event proposal upload must remain optional.");
}

if (eventDetails.includes("<span>Address Line 2 *</span>") || hasRequiredField(eventDetails, "addressLine2")) {
  failures.push("Event Address Line 2 must remain optional.");
}

if (!stayDateRangeFields.includes("required")) {
  failures.push("StayDateRangeFields must keep stay dates required before submit.");
}

if (!exists("public/netlify-forms.html")) {
  failures.push("Static Netlify form registration file must exist.");
}

const registration = exists("public/netlify-forms.html")
  ? read("public/netlify-forms.html")
  : "";

if (registration.includes('type="date"')) {
  failures.push("Static Netlify registration must not contain unvalidated date inputs.");
}

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
