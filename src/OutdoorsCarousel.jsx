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
  const slides =
    hasMultipleImages && images.length <= 3 ? [...images, ...images] : images;
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
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(2, images.length) },
      },
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
              <img
                src={image.src}
                alt={
                  image.alt ||
                  `Pattoo Castle patio or balcony ${(index % images.length) + 1}`
                }
                loading="lazy"
                draggable="false"
              />
            </figure>
          </div>
        ))}
      </Slider>
      {hasMultipleImages && (
        <>
          <button
            className={`${styles.arrow} ${styles.previous}`}
            type="button"
            aria-label="Previous patio and balcony photo"
            onClick={() => sliderRef.current?.slickPrev()}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.52764 9.36933L11.2568 15.0985C11.2834 15.1251 11.315 15.1462 11.3498 15.1606C11.3846 15.175 11.4218 15.1824 11.4595 15.1824C11.4971 15.1824 11.5344 15.175 11.5692 15.1606C11.6039 15.1462 11.6355 15.1251 11.6621 15.0985C11.6888 15.0719 11.7099 15.0403 11.7243 15.0055C11.7387 14.9707 11.7461 14.9335 11.7461 14.8958C11.7461 14.8582 11.7387 14.8209 11.7243 14.7861C11.7099 14.7514 11.6888 14.7198 11.6621 14.6932L6.13565 9.16666L11.6621 3.64017C11.7159 3.58641 11.7461 3.51351 11.7461 3.4375C11.7461 3.36148 11.7159 3.28858 11.6621 3.23483C11.6084 3.18108 11.5355 3.15088 11.4595 3.15088C11.3835 3.15088 11.3106 3.18108 11.2568 3.23483L5.52764 8.96399C5.50101 8.9906 5.47988 9.02219 5.46546 9.05697C5.45105 9.09174 5.44363 9.12902 5.44363 9.16666C5.44363 9.20431 5.45105 9.24159 5.46546 9.27636C5.47988 9.31114 5.50101 9.34273 5.52764 9.36933Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
          <button
            className={`${styles.arrow} ${styles.next}`}
            type="button"
            aria-label="Next patio and balcony photo"
            onClick={() => sliderRef.current?.slickNext()}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.8063 9.36933L7.07718 15.0985C7.05056 15.1251 7.01897 15.1462 6.98419 15.1606C6.94942 15.175 6.91215 15.1824 6.87451 15.1824C6.83687 15.1824 6.7996 15.175 6.76482 15.1606C6.73005 15.1462 6.69845 15.1251 6.67184 15.0985C6.64522 15.0719 6.62411 15.0403 6.60971 15.0055C6.5953 14.9707 6.58789 14.9335 6.58789 14.8958C6.58789 14.8582 6.5953 14.8209 6.60971 14.7861C6.62411 14.7514 6.64522 14.7198 6.67184 14.6932L12.1983 9.16666L6.67184 3.64017C6.61809 3.58641 6.58789 3.51351 6.58789 3.4375C6.58789 3.36148 6.61809 3.28858 6.67184 3.23483C6.72559 3.18108 6.79849 3.15088 6.87451 3.15088C6.95052 3.15088 7.02343 3.18108 7.07718 3.23483L12.8063 8.96399C12.833 8.9906 12.8541 9.02219 12.8685 9.05697C12.8829 9.09174 12.8904 9.12902 12.8904 9.16666C12.8904 9.20431 12.8829 9.24159 12.8685 9.27636C12.8541 9.31114 12.833 9.34273 12.8063 9.36933Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
          <span className={styles.srOnly} aria-live="polite" aria-atomic="true">
            Photo {activeIndex + 1} of {images.length}
          </span>
        </>
      )}
    </div>
  );
}
