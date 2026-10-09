"use client";

import { useRef, useState } from "react";
import Slider from "react-slick";
import styles from "./OutdoorsPage.module.css";

export default function OutdoorsCarousel({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  if (!images.length) return null;

  const hasMultipleImages = images.length > 1;
  // Slick needs more slides than visible slots to animate an infinite loop.
  const slides = hasMultipleImages && images.length <= 3
    ? [...images, ...images]
    : images;
  const settings = {
    arrows: false,
    dots: false,
    infinite: hasMultipleImages,
    slidesToShow: Math.min(3, images.length),
    slidesToScroll: 1,
    speed: 650,
    cssEase: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    swipeToSlide: true,
    draggable: true,
    accessibility: true,
    afterChange: (index) => setActiveIndex(index % images.length),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(2, images.length) } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Patios and balconies photos"
    >
      <Slider ref={sliderRef} className={styles.slickSlider} {...settings}>
        {slides.map((image, index) => (
          <div className={styles.slideSlot} key={`${image.src}-${index}`}>
            <figure className={styles.slide}>
              <img src={image.src} alt={image.alt || `Pattoo Castle patio or balcony ${(index % images.length) + 1}`} loading="lazy" draggable="false" />
            </figure>
          </div>
        ))}
      </Slider>
      {hasMultipleImages && (
        <>
          <button className={`${styles.arrow} ${styles.previous}`} type="button" aria-label="Previous patio and balcony photo" onClick={() => sliderRef.current?.slickPrev()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
          </button>
          <button className={`${styles.arrow} ${styles.next}`} type="button" aria-label="Next patio and balcony photo" onClick={() => sliderRef.current?.slickNext()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
          </button>
          <span className={styles.srOnly} aria-live="polite" aria-atomic="true">Photo {activeIndex + 1} of {images.length}</span>
        </>
      )}
    </div>
  );
}
