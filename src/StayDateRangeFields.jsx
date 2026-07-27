"use client";

import { useEffect, useState } from "react";

function getTodayInputValue() {
  return new Date().toLocaleDateString("en-CA");
}

function getNextDateInputValue(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() + 1);

  return date.toLocaleDateString("en-CA");
}

function openDatePicker(event) {
  try {
    event.currentTarget.showPicker?.();
  } catch {
    // Browsers may block showPicker when focus is not user-initiated.
  }
}

export default function StayDateRangeFields() {
  const [today, setToday] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const checkoutMinDate = checkInDate ? getNextDateInputValue(checkInDate) : today;

  useEffect(() => {
    setToday(getTodayInputValue());
  }, []);

  useEffect(() => {
    if (checkOutDate && checkoutMinDate && checkOutDate < checkoutMinDate) {
      setCheckOutDate("");
    }
  }, [checkOutDate, checkoutMinDate]);

  return (
    <>
      <label className="event-inquiry-field event-inquiry-field--half">
        <span>Check-in Date *</span>
        <input
          type="date"
          name="checkIn"
          required
          min={today}
          value={checkInDate}
          aria-label="Check-in date"
          onChange={(event) => setCheckInDate(event.target.value)}
          onClick={openDatePicker}
          onFocus={openDatePicker}
        />
      </label>

      <label className="event-inquiry-field event-inquiry-field--half">
        <span>Check-Out Date *</span>
        <input
          type="date"
          name="checkOut"
          required
          min={checkoutMinDate}
          value={checkOutDate}
          aria-label="Check-out date"
          onChange={(event) => setCheckOutDate(event.target.value)}
          onClick={openDatePicker}
          onFocus={openDatePicker}
        />
      </label>
    </>
  );
}
