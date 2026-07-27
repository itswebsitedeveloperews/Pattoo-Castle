"use client";

import { useState } from "react";

export default function NetlifyForm({
  children,
  className,
  encType,
  formName,
  id,
  ...props
}) {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();

    if (status === "submitting") {
      return;
    }

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    setStatus("submitting");

    try {
      const formData = new FormData(form);

      const response = await fetch("/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Netlify form submission failed");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
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
      onSubmit={handleSubmit}
      {...props}
    >
      <input type="hidden" name="form-name" value={formName} />
      {children}
      <p className="form-submit-status" aria-live="polite">
        {status === "submitting" && "Submitting..."}
        {status === "success" && "Thank you. Your inquiry has been sent."}
        {status === "error" &&
          "Sorry, something went wrong. Please try again."}
      </p>
    </form>
  );
}
