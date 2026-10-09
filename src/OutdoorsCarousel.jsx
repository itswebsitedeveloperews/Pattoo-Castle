"use client";

import { useRef, useState } from "react";
import styles from "./OutdoorsPage.module.css";

export default function OutdoorsCarousel({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef(null);

  if (!images.length) return null;

  function move(direction) {
    setActiveIndex((index) => (index + direction + images.length) % images.length);
  }

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Patios and balconies photos"
      onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = touchStart.current - event.changedTouches[0].clientX;
        if (Math.abs(distance) > 50) move(distance > 0 ? 1 : -1);
        touchStart.current = null;
      }}
      onTouchCancel={() => { touchStart.current = null; }}
    >
      <div className={styles.imageGrid}>
        {Array.from({ length: Math.min(3, images.length) }, (_, offset) => {
          const index = (activeIndex + offset) % images.length;
          const image = images[index];
          return (
            <figure className={styles.slide} key={offset} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${images.length}`}>
              <img src={image.src} alt={image.alt || `Pattoo Castle patio or balcony ${index + 1}`} loading="lazy" draggable="false" />
            </figure>
          );
        })}
      </div>
      {images.length > 1 && (
        <>
          <button className={`${styles.arrow} ${styles.previous}`} type="button" aria-label="Previous patio and balcony photo" onClick={() => move(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
          </button>
          <button className={`${styles.arrow} ${styles.next}`} type="button" aria-label="Next patio and balcony photo" onClick={() => move(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
          </button>
          <span className={styles.srOnly} aria-live="polite" aria-atomic="true">Photo {activeIndex + 1} of {images.length}</span>
        </>
      )}
    </div>
  );
}
