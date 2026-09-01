"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./enquiries.module.css";

const FIELD_LABELS = {
  addressLine2: "Address Line 2",
  arrivalDate: "Arrival Date",
  attendees: "Attendees",
  checkIn: "Check In",
  checkOut: "Check Out",
  city: "City",
  comments: "Comments",
  company: "Company",
  contactEventType: "Event Type",
  contactRole: "Contact Role",
  datesFlexible: "Dates Flexible",
  decisionDate: "Decision Date",
  departureDate: "Departure Date",
  details: "Details",
  email: "Email",
  eventType: "Event Type",
  firstName: "First Name",
  guestRooms: "Guest Rooms",
  lastName: "Last Name",
  phone: "Phone",
  postalCode: "Postal Code",
  proposal: "Proposal",
  state: "State",
  title: "Title",
};

function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatFieldName(name) {
  return (
    FIELD_LABELS[name] ||
    name
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase())
  );
}

function formatValue(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value ?? "");
}

function getVisibleFields(data) {
  return Object.entries(data || {}).filter(([key, value]) => {
    if (key === "form-name" || key === "ip") {
      return false;
    }

    return formatValue(value).trim() !== "";
  });
}

export default function EnquiriesAdmin() {
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [forms, setForms] = useState([]);
  const [activeFormName, setActiveFormName] = useState("contact");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function loadSubmissions(passwordToUse) {
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/admin/netlify-forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: passwordToUse }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Could not load submissions.");
      }

      setForms(payload.forms || []);
      setSavedPassword(passwordToUse);
      sessionStorage.setItem("pattoo-enquiries-password", passwordToUse);
      setStatus("ready");
    } catch (loadError) {
      setError(loadError.message);
      setStatus("error");
      sessionStorage.removeItem("pattoo-enquiries-password");
    }
  }

  useEffect(() => {
    const storedPassword = sessionStorage.getItem("pattoo-enquiries-password");

    if (storedPassword) {
      setPassword(storedPassword);
      loadSubmissions(storedPassword);
    }
  }, []);

  const activeForm = useMemo(
    () =>
      forms.find((form) => form.name === activeFormName) ||
      forms[0] || {
        label: "Contact",
        name: "contact",
        submissions: [],
      },
    [activeFormName, forms],
  );

  const totalSubmissions = forms.reduce(
    (total, form) => total + (form.submissionCount || 0),
    0,
  );

  function handleSubmit(event) {
    event.preventDefault();
    loadSubmissions(password);
  }

  function handleSignOut() {
    setForms([]);
    setSavedPassword("");
    setPassword("");
    setStatus("idle");
    sessionStorage.removeItem("pattoo-enquiries-password");
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell} aria-labelledby="enquiries-title">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Pattoo Castle Admin</p>
            <h1 id="enquiries-title">Form Enquiries</h1>
          </div>

          {savedPassword && (
            <div className={styles.headerActions}>
              <button
                className={styles.secondaryButton}
                onClick={() => loadSubmissions(savedPassword)}
                type="button"
              >
                Refresh
              </button>
              <button
                className={styles.secondaryButton}
                onClick={handleSignOut}
                type="button"
              >
                Lock
              </button>
            </div>
          )}
        </div>

        {!savedPassword && (
          <form className={styles.loginPanel} onSubmit={handleSubmit}>
            <label htmlFor="admin-password">Password</label>
            <div className={styles.passwordRow}>
              <input
                autoComplete="current-password"
                id="admin-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
              <button className={styles.primaryButton} type="submit">
                Open
              </button>
            </div>
          </form>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {savedPassword && (
          <div className={styles.dashboard}>
            <div className={styles.summary}>
              <span>Total submissions</span>
              <strong>{totalSubmissions}</strong>
            </div>

            <div className={styles.tabs} role="tablist" aria-label="Form types">
              {forms.map((form) => (
                <button
                  aria-selected={form.name === activeForm.name}
                  className={styles.tab}
                  key={form.name}
                  onClick={() => setActiveFormName(form.name)}
                  role="tab"
                  type="button"
                >
                  <span>{form.label}</span>
                  <strong>{form.submissionCount || 0}</strong>
                </button>
              ))}
            </div>

            <section className={styles.submissionsPanel}>
              <div className={styles.panelHeader}>
                <h2>{activeForm.label}</h2>
                <p>{status === "loading" ? "Loading..." : "Latest 100 verified submissions"}</p>
              </div>

              {activeForm.submissions.length === 0 && status !== "loading" ? (
                <p className={styles.empty}>No submissions found for this form.</p>
              ) : (
                <div className={styles.submissionList}>
                  {activeForm.submissions.map((submission) => (
                    <article className={styles.submission} key={submission.id}>
                      <div className={styles.submissionHeader}>
                        <div>
                          <h3>
                            {submission.name ||
                              submission.email ||
                              `Submission #${submission.number || submission.id}`}
                          </h3>
                          <p>{formatDate(submission.createdAt)}</p>
                        </div>
                        {submission.email && (
                          <a href={`mailto:${submission.email}`}>
                            {submission.email}
                          </a>
                        )}
                      </div>

                      <dl className={styles.fields}>
                        {getVisibleFields(submission.data).map(([key, value]) => (
                          <div className={styles.field} key={key}>
                            <dt>{formatFieldName(key)}</dt>
                            <dd>{formatValue(value)}</dd>
                          </div>
                        ))}
                      </dl>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
