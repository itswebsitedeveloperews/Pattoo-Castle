"use client";

import { useRef } from "react";
import styles from "./StayPage.module.css";

export default function StayReviewsCarousel({ children }) {
  const track = useRef(null);

  function move(direction) {
    const element = track.current;
    const card = element?.firstElementChild;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    element.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <div className={styles.reviewsCarousel}>
      <div className={styles.reviewControls}>
        <button type="button" onClick={() => move(-1)} aria-label="Previous reviews">‹</button>
        <button type="button" onClick={() => move(1)} aria-label="Next reviews">›</button>
      </div>
      <div className={styles.reviewsGrid} ref={track} tabIndex={0} role="region" aria-label="Guest review cards">
        {children}
      </div>
    </div>
  );
}
