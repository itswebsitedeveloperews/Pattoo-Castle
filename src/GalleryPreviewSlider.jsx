"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Slider from "react-slick";

function getSlideIndex(index, direction, totalItems) {
  return (index + direction + totalItems) % totalItems;
}

export default function GalleryPreviewSlider({ images = [] }) {
  const slides = useMemo(() => images.filter(Boolean), [images]);
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    setSlideDirection(0);
    sliderRef.current?.slickGoTo(0, true);
  }, [slides]);

  if (slides.length === 0) {
    return null;
  }

  const previousIndex =
    slides.length > 1 ? getSlideIndex(activeIndex, -1, slides.length) : activeIndex;
  const nextIndex =
    slides.length > 1 ? getSlideIndex(activeIndex, 1, slides.length) : activeIndex;

  const settings = {
    arrows: false,
    dots: false,
    draggable: true,
    infinite: slides.length > 1,
    speed: 520,
    slidesToScroll: 1,
    slidesToShow: 1,
    swipe: true,
    touchMove: true,
    beforeChange: (current, next) => {
      const direction =
        next === current
          ? 0
          : next > current || (current === slides.length - 1 && next === 0)
            ? 1
            : -1;
      setSlideDirection(direction);
    },
    afterChange: (index) => {
      setActiveIndex(index);
      window.setTimeout(() => setSlideDirection(0), 80);
    },
  };

  function moveSlide(direction) {
    if (slides.length <= 1) {
      return;
    }

    if (direction < 0) {
      sliderRef.current?.slickPrev();
      return;
    }

    sliderRef.current?.slickNext();
  }

  function handleControlClick(event, direction) {
    event.preventDefault();
    event.stopPropagation();
    moveSlide(direction);
  }

  return (
    <div
      className={`gallery-preview-images${
        slideDirection === 1
          ? " is-next"
          : slideDirection === -1
            ? " is-prev"
            : ""
      }`}
    >
      <button
        aria-label="Show previous gallery image"
        className="gallery-preview-image-button gallery-preview-image-1"
        onClick={(event) => handleControlClick(event, -1)}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        type="button"
      >
        <img src={slides[previousIndex]} alt="" draggable="false" />
        <span className="gallery-preview-arrow" aria-hidden="true">
          &lt;
        </span>
      </button>

      <div className="gallery-preview-main" aria-live="polite">
        <Slider ref={sliderRef} {...settings} className="gallery-preview-slick">
          {slides.map((image, index) => (
            <div className="gallery-preview-slide" key={`${image}-${index}`}>
              <img src={image} alt="" draggable="false" />
            </div>
          ))}
        </Slider>
      </div>

      <button
        aria-label="Show next gallery image"
        className="gallery-preview-image-button gallery-preview-image-3"
        onClick={(event) => handleControlClick(event, 1)}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        type="button"
      >
        <img src={slides[nextIndex]} alt="" draggable="false" />
        <span className="gallery-preview-arrow" aria-hidden="true">
          &gt;
        </span>
      </button>
    </div>
  );
}
