"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import styles from "./FormCaptcha.module.css";

export default function FormCaptcha() {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);
  const [message, setMessage] = useState("Loading verification...");
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    function reset() {
      if (widgetRef.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetRef.current);
        setMessage("");
      }
    }
    form?.addEventListener("reset", reset);
    form?.addEventListener("recaptcha-reset", reset);
    return () => {
      form?.removeEventListener("reset", reset);
      form?.removeEventListener("recaptcha-reset", reset);
    };
  }, []);

  function renderWidget() {
    window.grecaptcha.ready(() => {
      if (!containerRef.current || widgetRef.current !== null) return;
      try {
        widgetRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          size: containerRef.current.parentElement.clientWidth >= 304 ? "normal" : "compact",
          callback: () => setMessage(""),
          "expired-callback": () => setMessage("Verification expired. Please complete it again."),
          "error-callback": () => setMessage("Verification failed to load. Check your connection and reload this page."),
        });
        setMessage("");
      } catch {
        setMessage("Verification is unavailable. Please reload this page.");
      }
    });
  }

  return (
    <div className={styles.captcha}>
      <div ref={containerRef} data-form-captcha tabIndex={-1} aria-label="reCAPTCHA verification" />
      <p role="status" aria-live="polite">
        {siteKey ? message : "Verification is unavailable. Please try again later."}
      </p>
      {siteKey && (
        <Script
          id="google-recaptcha-v2"
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderWidget}
          onError={() => setMessage("Verification failed to load. Check your connection and reload this page.")}
        />
      )}
    </div>
  );
}
