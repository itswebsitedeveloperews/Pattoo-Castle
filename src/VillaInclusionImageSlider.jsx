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
            <span aria-hidden="true">‹</span>
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
            <span aria-hidden="true">›</span>
          </button>
        </>
      )}
    </div>
  );
}
