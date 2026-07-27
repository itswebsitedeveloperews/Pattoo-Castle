"use client";

import { useRef, useState } from "react";

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

    isSubmittingRef.current = true;
    setStatus("submitting");

    try {
      const formData = new FormData(form);
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
