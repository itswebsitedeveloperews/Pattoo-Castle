"use client";

import { useRef } from "react";
import Slider from "react-slick";
import styles from "./EventDetailsPage.module.css";

export default function EventBannerSlider({ images = [] }) {
  const sliderRef = useRef(null);
  if (!images.length) return null;
  const multiple = images.length > 1;

  return (
    <div className={styles.bannerSlider} role="region" aria-roledescription="carousel" aria-label="Event banner images">
      <Slider
        ref={sliderRef}
        className={styles.bannerTrack}
        arrows={false}
        dots={multiple}
        infinite={multiple}
        slidesToShow={1}
        slidesToScroll={1}
        speed={700}
        cssEase="ease-in-out"
        swipe={multiple}
        draggable={multiple}
        accessibility
        customPaging={(index) => <button type="button" aria-label={`Show banner image ${index + 1}`}>{index + 1}</button>}
      >
        {images.map((image, index) => (
          <div className={styles.bannerSlide} key={`${image.src}-${index}`}>
            <img
              className={styles.bannerImage}
              src={image.src}
              alt={image.alt || `Pattoo Castle event banner ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              draggable="false"
            />
          </div>
        ))}
      </Slider>
      {multiple && (
        <>
          <button className={`${styles.bannerArrow} ${styles.bannerPrevious}`} type="button" aria-label="Previous banner image" onClick={() => sliderRef.current?.slickPrev()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
          </button>
          <button className={`${styles.bannerArrow} ${styles.bannerNext}`} type="button" aria-label="Next banner image" onClick={() => sliderRef.current?.slickNext()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
          </button>
        </>
      )}
    </div>
  );
}
