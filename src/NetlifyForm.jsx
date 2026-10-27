"use client";

import { useRef, useState } from "react";

const emailSubjects = {
  "event-inquiry": "Pattoo Castle \u2013 New Event Inquiry",
  "stay-inquiry": "Pattoo Castle \u2013 New Stay Inquiry",
  contact: "New Contact Inquiry",
};

export default function NetlifyForm({
  children,
  className,
  encType,
  formName,
  id,
  ...props
}) {
  const isSubmittingRef = useRef(false);
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    if (!new FormData(form).get("g-recaptcha-response")) {
      setStatus("verification-required");
      form.querySelector("[data-form-captcha]")?.focus();
      return;
    }

    isSubmittingRef.current = true;
    setStatus("submitting");

    try {
      const formData = new FormData(form);
      const submissionName = [
        formData.get("firstName"),
        formData.get("lastName"),
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      if (submissionName) {
        formData.set("name", submissionName);
      }

      const formAction = "/netlify-forms.html";
      const isMultipartForm = encType === "multipart/form-data";

      const response = await fetch(
        formAction,
        isMultipartForm
          ? {
              method: "POST",
              body: formData,
            }
          : {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams(formData).toString(),
            },
      );

      if (!response.ok) {
        throw new Error("Netlify form submission failed");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      // Tokens are single-use, including when the submission needs a retry.
      form.dispatchEvent(new Event("recaptcha-reset"));
      isSubmittingRef.current = false;
    }
  }

  return (
    <form
      className={className}
      id={id}
      name={formName}
      method="POST"
      encType={encType}
      data-netlify="true"
      data-netlify-recaptcha="true"
      onSubmit={handleSubmit}
      {...props}
    >
      <input type="hidden" name="form-name" value={formName} />
      {emailSubjects[formName] && (
        <input
          type="hidden"
          name="subject"
          value={emailSubjects[formName]}
          data-remove-prefix="true"
        />
      )}
      {children}
      {status !== "idle" && (
        <p className="form-submit-status" aria-live="polite">
          {status === "submitting" && "Submitting..."}
          {status === "success" && "Thank you. Your inquiry has been sent."}
          {status === "verification-required" && "Please complete the reCAPTCHA verification before submitting."}
          {status === "error" &&
            "Sorry, something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
}
