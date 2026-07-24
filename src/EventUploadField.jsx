"use client";

import { useRef, useState } from "react";

export default function EventUploadField() {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  function handleFileChange(event) {
    setFileName(event.target.files?.[0]?.name || "");
  }

  function handleDrop(event) {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file || !inputRef.current) {
      return;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    inputRef.current.files = dataTransfer.files;
    setFileName(file.name);
  }

  return (
    <label
      className={`event-upload-field${fileName ? " event-upload-field--selected" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        name="proposal"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        ref={inputRef}
      />
      <span className="event-upload-icon" aria-hidden="true">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.33203 18.6667L13.9987 14L18.6654 18.6667M13.9987 14V24.5"
            stroke="#B9802E"
            strokeWidth="1.86667"
          />
          <path
            d="M23.7996 20.4167C24.8871 19.7727 25.7359 18.7929 26.2185 17.6248C26.7011 16.4568 26.7913 15.1636 26.4755 13.9398C26.1597 12.7161 25.455 11.628 24.4674 10.8393C23.4799 10.0506 22.2629 9.60402 20.9996 9.56666C20.4526 7.72271 19.2723 6.13101 17.6667 5.07201C16.0611 4.01301 14.1333 3.55469 12.2229 3.7778C10.3125 4.00092 8.54213 4.89114 7.22378 6.29162C5.90542 7.6921 5.12368 9.51295 5.01628 11.4333C4.13492 11.9688 3.43078 12.7519 2.99174 13.6851C2.55269 14.6182 2.39819 15.66 2.54752 16.6804C2.69685 17.7008 3.14338 18.6546 3.8314 19.4228C4.51942 20.191 5.41845 20.7395 6.41628 21H9.33294"
            stroke="#B9802E"
            strokeWidth="1.86667"
          />
        </svg>
      </span>
      <strong>{fileName || "Choose file or drag and drop"}</strong>
      <small>{fileName ? "Selected file" : "PDF, DOC, DOCX (Max 10MB)"}</small>
    </label>
  );
}
