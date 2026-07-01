"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Slider from "react-slick";

const VISIBLE_ITEM_COUNT = 4;
const LIST_ITEM_STEP = 58;

function getNextIndex(currentIndex, direction, totalItems) {
  return (currentIndex + direction + totalItems) % totalItems;
}

export default function AmenitiesSlider({
  eyebrow = "",
  heading = "",
  items = [],
}) {
  const slides = useMemo(() => items.filter(Boolean), [items]);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    setActiveIndex(0);
    sliderRef.current?.slickGoTo(0, true);
  }, [slides]);

  const sideImageIndex =
    slides.length > 1 ? getNextIndex(activeIndex, 1, slides.length) : activeIndex;
  const activeItem = slides[activeIndex] || {};
  const sideItem = slides[sideImageIndex] || {};
  const listOffset = Math.min(
    Math.max(activeIndex - (VISIBLE_ITEM_COUNT - 1), 0),
    Math.max(slides.length - VISIBLE_ITEM_COUNT, 0),
  );

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

  function selectSlide(index) {
    if (index === activeIndex) {
      return;
    }

    if (slides.length <= 1) {
      return;
    }

    sliderRef.current?.slickGoTo(index);
  }

  const settings = {
    arrows: false,
    dots: false,
    draggable: true,
    infinite: slides.length > 1,
    speed: 580,
    slidesToScroll: 1,
    slidesToShow: 1,
    swipe: true,
    touchMove: true,
    afterChange: setActiveIndex,
  };

  if (!eyebrow && !heading && slides.length === 0) {
    return null;
  }

  return (
    <section
      className="amenities-section"
      aria-labelledby={heading ? "amenities-title" : undefined}
    >
      <div className="amenities-top">
        <div className="amenities-heading-block">
          {eyebrow && (
            <p className="amenities-eyebrow">
              <span />
              {eyebrow}
            </p>
          )}
          {heading && <h2 id="amenities-title">{heading}</h2>}
        </div>

        {slides.length > 0 && (
          <div
            className="amenities-list"
            aria-label="Amenities"
            style={{
              "--amenities-list-offset": `${listOffset * -LIST_ITEM_STEP}px`,
            }}
          >
            <div className="amenities-list-track">
              {slides.map((item, index) => (
                <button
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={index === activeIndex ? "is-active" : undefined}
                  key={`${item.title}-${index}`}
                  onClick={(event) => {
                    event.preventDefault();
                    selectSlide(index);
                  }}
                  type="button"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className="amenities-content"
      >
        <div className="amenities-copy-viewport">
          <div className="amenities-copy" key={`${activeItem.title}-copy-${activeIndex}`}>
            {activeItem.title && <h3>{activeItem.title}</h3>}
            {activeItem.content && <p>{activeItem.content}</p>}
          </div>
        </div>

        <div className="amenities-main-image">
          <Slider ref={sliderRef} {...settings} className="amenities-slick">
            {slides.map((item, index) => (
              <div className="amenities-image-slide" key={`${item.title}-main-${index}`}>
                {item.imageSrc && <img src={item.imageSrc} alt="" draggable="false" />}
              </div>
            ))}
          </Slider>
        </div>

        <div className="amenities-side-image">
          <div className="amenities-side-slide" key={`${sideItem.title}-side-${sideImageIndex}`}>
            {sideItem.imageSrc && <img src={sideItem.imageSrc} alt="" draggable="false" />}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="amenities-controls">
            <button
              aria-label="Show previous amenity"
              className="amenities-control-prev"
              onClick={(event) => handleControlClick(event, -1)}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              type="button"
            >
              ‹
            </button>
            <button
              aria-label="Show next amenity"
              className="amenities-control-next"
              onClick={(event) => handleControlClick(event, 1)}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              type="button"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
