"use client";

import { useEffect, useState } from "react";
import NetlifyForm from "./NetlifyForm";
import styles from "./StayInquiryForm.module.css";

function dateValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function StayInquiryForm() {
  const [month, setMonth] = useState(null);
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const now = new Date();
    setToday(dateValue(now));
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setCode(Math.random().toString(36).slice(2, 7).toUpperCase());
  }, []);

  function selectDate(value) {
    if (!checkIn || checkOut || value <= checkIn) {
      setCheckIn(value);
      setCheckOut("");
    } else {
      setCheckOut(value);
    }
  }

  const firstDay = month ? month.getDay() : 0;
  const days = month ? new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() : 0;
  const previousDisabled = !month || dateValue(month).slice(0, 7) <= today.slice(0, 7);

  return (
    <section id="stay-inquiry" className={`section ${styles.section}`} aria-label="Stay inquiry">
      <NetlifyForm
        className={`wrap ${styles.layout}`}
        id="stay-inquiry-form"
        formName="stay-inquiry"
        onReset={() => { setCheckIn(""); setCheckOut(""); }}
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
              return <button type="button" key={index} disabled={value < today} aria-label={date.toLocaleDateString("en-US", {weekday:"long", month:"long", day:"numeric", year:"numeric"})} aria-pressed={selected || Boolean(inRange)} aria-current={value === today ? "date" : undefined} className={`${styles.day}${selected ? ` ${styles.selected}` : inRange ? ` ${styles.inRange}` : ""}`} onClick={() => selectDate(value)}>{day}</button>;
            })}
          </div>
          <p className={styles.hint} aria-live="polite">{checkOut ? "Your stay dates are selected." : checkIn ? "Select your check-out date." : "Select check-in, then check-out."}</p>
          <div className={styles.dateFields}>
            <label>Check-in<input type="date" name="checkIn" value={checkIn} min={today} required onChange={event => { setCheckIn(event.target.value); setCheckOut(""); }} /></label>
            <label>Check-out<input type="date" name="checkOut" value={checkOut} min={checkIn ? dateValue(new Date(Number(checkIn.slice(0,4)), Number(checkIn.slice(5,7))-1, Number(checkIn.slice(8))+1)) : today} required onChange={event => setCheckOut(event.target.value)} /></label>
          </div>
        </div>
        <div className={styles.formPanel}>
          <div className={styles.fields}>
            <label className={styles.field}><span>First Name *</span><input name="firstName" autoComplete="given-name" placeholder="Enter first name" required /></label>
            <label className={styles.field}><span>Last Name *</span><input name="lastName" autoComplete="family-name" placeholder="Enter last name" required /></label>
            <label className={styles.field}><span>Email Address *</span><input type="email" name="email" autoComplete="email" placeholder="Enter email address" required /></label>
            <label className={styles.field}><span>Phone</span><input type="tel" name="phone" autoComplete="tel" placeholder="Enter phone number" /></label>
            <label className={`${styles.field} ${styles.full}`}><span>Details</span><textarea name="details" placeholder="Enter details" rows={2} /></label>
          </div>
          <div className={styles.verification}>
            <label><span className={styles.srOnly}>Enter the verification code shown</span><input name="verification" aria-label="Enter the verification code shown" required pattern={code} autoComplete="off" title="Enter the code shown beside this field" /></label>
            <span aria-label={`Verification code: ${code}`}>{code}</span>
          </div>
          <button className={styles.send} type="submit" disabled={!month || !code}>Send</button>
        </div>
      </NetlifyForm>
    </section>
  );
}
