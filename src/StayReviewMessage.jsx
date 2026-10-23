"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./StayPage.module.css";

export default function StayReviewMessage({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const content = useRef(null);
  const id = useId();

  useEffect(() => {
    const element = content.current;
    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      setOverflows(element.scrollHeight > lineHeight * 4 + 1);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, [children]);

  return (
    <>
      <div ref={content} id={id} className={`${styles.reviewText} ${expanded ? "" : styles.reviewClamped}`}>
        {children}
      </div>
      {(overflows || expanded) && (
        <button type="button" className={styles.reviewToggle} aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Hide" : "Read more"}
        </button>
      )}
    </>
  );
}
