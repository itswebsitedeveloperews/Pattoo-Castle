"use client";

import { useEffect, useMemo, useRef } from "react";
import Slider from "react-slick";
import styles from "./VillaInclusionPage.module.css";

export default function VillaInclusionImageSlider({ images }) {
  const sliderRef = useRef(null);
  const validImages = useMemo(
    () => (Array.isArray(images) ? images.filter((image) => image?.src) : []),
    [images],
  );
  const hasMultipleImages = validImages.length > 1;

  useEffect(() => {
    sliderRef.current?.slickGoTo(0, true);
  }, [validImages]);

  if (validImages.length === 0) {
    return null;
  }

  const settings = {
    arrows: false,
    dots: false,
    draggable: true,
    infinite: hasMultipleImages,
    speed: 560,
    slidesToScroll: 1,
    slidesToShow: 1,
    swipe: true,
    touchMove: true,
  };

  const showPreviousImage = (event) => {
    event.preventDefault();
    sliderRef.current?.slickPrev();
  };

  const showNextImage = (event) => {
    event.preventDefault();
    sliderRef.current?.slickNext();
  };

  return (
    <div className={styles.imageSlider}>
      <Slider className={styles.slickSlider} ref={sliderRef} {...settings}>
        {validImages.map((image, index) => (
          <div className={styles.slide} key={`${image.src}-${index}`}>
            <img
              src={image.src}
              alt={image.alt || `Villa inclusion bedroom image ${index + 1}`}
              draggable="false"
            />
          </div>
        ))}
      </Slider>

      {hasMultipleImages && (
        <>
          <button
            aria-label="Show previous bedroom image"
            className={`${styles.sliderButton} ${styles.sliderButtonPrevious}`}
            onClick={showPreviousImage}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            type="button"
          >
            <svg
              width="9"
              height="15"
              viewBox="0 0 9 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.08379 7.21845L6.81296 12.9476C6.83957 12.9742 6.87117 12.9953 6.90594 13.0098C6.94072 13.0242 6.97799 13.0316 7.01563 13.0316C7.05327 13.0316 7.09054 13.0242 7.12531 13.0098C7.16009 12.9953 7.19168 12.9742 7.2183 12.9476C7.24491 12.921 7.26602 12.8894 7.28043 12.8546C7.29483 12.8199 7.30225 12.7826 7.30225 12.745C7.30225 12.7073 7.29483 12.67 7.28043 12.6353C7.26602 12.6005 7.24491 12.5689 7.2183 12.5423L1.6918 7.01578L7.2183 1.48929C7.27205 1.43554 7.30225 1.36263 7.30225 1.28662C7.30225 1.2106 7.27205 1.1377 7.2183 1.08395C7.16455 1.0302 7.09164 1 7.01563 1C6.93961 1 6.86671 1.0302 6.81296 1.08395L1.08379 6.81312C1.05716 6.83972 1.03603 6.87131 1.02161 6.90609C1.0072 6.94086 0.999778 6.97814 0.999778 7.01578C0.999778 7.05343 1.0072 7.09071 1.02161 7.12548C1.03603 7.16026 1.05716 7.19185 1.08379 7.21845Z"
                fill="#4E3626"
                stroke="#4E3626"
                strokeWidth="2"
              />
            </svg>
          </button>
          <button
            aria-label="Show next bedroom image"
            className={`${styles.sliderButton} ${styles.sliderButtonNext}`}
            onClick={showNextImage}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            type="button"
          >
            <svg
              width="9"
              height="15"
              viewBox="0 0 9 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.21845 7.21845L1.48929 12.9476C1.46267 12.9742 1.43108 12.9953 1.3963 13.0098C1.36153 13.0242 1.32426 13.0316 1.28662 13.0316C1.24898 13.0316 1.21171 13.0242 1.17693 13.0098C1.14216 12.9953 1.11056 12.9742 1.08395 12.9476C1.05733 12.921 1.03622 12.8894 1.02182 12.8546C1.00741 12.8199 1 12.7826 1 12.745C1 12.7073 1.00741 12.67 1.02182 12.6353C1.03622 12.6005 1.05733 12.5689 1.08395 12.5423L6.61045 7.01578L1.08395 1.48929C1.0302 1.43554 1 1.36263 1 1.28662C1 1.2106 1.0302 1.1377 1.08395 1.08395C1.1377 1.0302 1.2106 1 1.28662 1C1.36263 1 1.43554 1.0302 1.48929 1.08395L7.21845 6.81312C7.24509 6.83972 7.26622 6.87131 7.28063 6.90609C7.29505 6.94086 7.30247 6.97814 7.30247 7.01578C7.30247 7.05343 7.29505 7.09071 7.28063 7.12548C7.26622 7.16026 7.24509 7.19185 7.21845 7.21845Z"
                fill="#4E3626"
                stroke="#4E3626"
                strokeWidth="2"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
