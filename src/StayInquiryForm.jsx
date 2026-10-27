"use client";

import { useEffect, useState } from "react";
import NetlifyForm from "./NetlifyForm";
import FormCaptcha from "./FormCaptcha";
import styles from "./StayInquiryForm.module.css";
import { isBookingRangeAvailable } from "./lib/booking-dates";

function dateValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function StayInquiryForm({ bookingDates = [] }) {
  const availableDates = new Set(bookingDates);
  const [month, setMonth] = useState(null);
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const now = new Date();
    setToday(dateValue(now));
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    const updateToday = () => setToday(dateValue(new Date()));
    const timer = window.setInterval(updateToday, 60000);
    window.addEventListener("focus", updateToday);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", updateToday);
    };
  }, []);

  function selectDate(value) {
    if (value < dateValue(new Date()) || !availableDates.has(value)) return;
    setDateError("");
    if (!checkIn || checkOut || value <= checkIn) {
      setCheckIn(value);
      setCheckOut("");
    } else {
      if (!isBookingRangeAvailable(checkIn, value, availableDates, dateValue(new Date()))) {
        setDateError("This range includes unavailable dates. Please select available dates only.");
        return;
      }
      setCheckOut(value);
    }
  }

  const firstDay = month ? month.getDay() : 0;
  const days = month ? new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() : 0;
  const previousDisabled = !month || dateValue(month).slice(0, 7) <= today.slice(0, 7);
  const effectiveCheckOut = checkOut || checkIn;

  return (
    <section id="stay-inquiry" className={`section ${styles.section}`} aria-label="Stay inquiry">
      <NetlifyForm
        className={`container container-wide ${styles.layout}`}
        id="stay-inquiry-form"
        formName="stay-inquiry"
        onReset={() => { setCheckIn(""); setCheckOut(""); setDateError(""); }}
        onSubmitCapture={(event) => {
          if (!isBookingRangeAvailable(checkIn, effectiveCheckOut, availableDates, dateValue(new Date()))) {
            event.preventDefault();
            event.stopPropagation();
            setDateError("Select available dates on the calendar.");
          }
        }}
      >
        <div className={styles.calendarPanel}>
          <div className={styles.monthHeader}>
            <button type="button" aria-label="Previous month" disabled={previousDisabled} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
            <span aria-live="polite">{month ? month.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Calendar"}</span>
            <button type="button" aria-label="Next month" disabled={!month} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
          </div>
          <div className={styles.calendarGrid} role="group" aria-label="Choose check-in, then check-out">
            {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map(day => <span className={styles.weekday} key={day}>{day}</span>)}
            {Array.from({ length: Math.ceil((firstDay + days) / 7) * 7 }, (_, index) => {
              const day = index - firstDay + 1;
              if (day < 1 || day > days) return <span className={styles.emptyDay} key={index}>–</span>;
              const date = new Date(month.getFullYear(), month.getMonth(), day);
              const value = dateValue(date);
              const selected = value === checkIn || value === checkOut;
              const inRange = checkIn && checkOut && value > checkIn && value < checkOut;
              return <button type="button" key={index} disabled={!today || value < today || !availableDates.has(value)} aria-label={date.toLocaleDateString("en-US", {weekday:"long", month:"long", day:"numeric", year:"numeric"})} aria-pressed={selected || Boolean(inRange)} aria-current={value === today ? "date" : undefined} className={`${styles.day}${selected ? ` ${styles.selected}` : inRange ? ` ${styles.inRange}` : ""}`} onClick={() => selectDate(value)}>{day}</button>;
            })}
          </div>
          <p className={styles.srOnly} aria-live="polite">{checkIn ? `Stay dates: ${checkIn} to ${effectiveCheckOut}.${checkOut ? "" : " You can optionally select a different check-out date."}` : "Select dates on the calendar."}</p>
          <input type="hidden" name="checkIn" value={checkIn} />
          <input type="hidden" name="checkOut" value={effectiveCheckOut} />
        </div>
        <div className={styles.formPanel}>
          <div className={styles.fields}>
            <label className={`event-inquiry-field ${styles.field}`}><span>First Name *</span><input name="firstName" autoComplete="given-name" placeholder="Enter first name" required /></label>
            <label className={`event-inquiry-field ${styles.field}`}><span>Last Name *</span><input name="lastName" autoComplete="family-name" placeholder="Enter last name" required /></label>
            <label className={`event-inquiry-field ${styles.field}`}><span>Email Address *</span><input type="email" name="email" autoComplete="email" placeholder="Enter email address" required /></label>
            <label className={`event-inquiry-field ${styles.field}`}><span>Phone</span><input type="tel" name="phone" autoComplete="tel" placeholder="Enter phone number" /></label>
            <label className={`event-inquiry-field ${styles.field} ${styles.full}`}><span>Details</span><textarea name="details" placeholder="Enter details" rows={2} /></label>
          </div>
          <FormCaptcha />
          <button className="btn btn--solid" type="submit" disabled={!month}>Send</button>
          {dateError && <p className={styles.dateError} role="alert">{dateError}</p>}
        </div>
      </NetlifyForm>
    </section>
  );
}
