"use client";

import { useEffect, useState } from "react";

function getTodayInputValue() {
  return new Date().toLocaleDateString("en-CA");
}

function openDatePicker(event) {
  try {
    event.currentTarget.showPicker?.();
  } catch {
    // Browsers may block showPicker when focus is not user-initiated.
  }
}

export default function MinTodayDateInput({ ariaLabel, name }) {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(getTodayInputValue());
  }, []);

  return (
    <input
      type="date"
      name={name}
      required
      min={today}
      aria-label={ariaLabel}
      onClick={openDatePicker}
      onFocus={openDatePicker}
    />
  );
}
