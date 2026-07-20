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
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M12 16V7" />
          <path d="m8.5 10.5 3.5-3.5 3.5 3.5" />
          <path d="M6 17.5h12" />
        </svg>
      </span>
      <strong>{fileName || "Choose file or drag and drop"}</strong>
      <small>{fileName ? "Selected file" : "PDF, DOC, DOCX (Max 10MB)"}</small>
    </label>
  );
}
