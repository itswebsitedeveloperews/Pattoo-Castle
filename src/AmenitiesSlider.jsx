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
    slides.length > 1
      ? getNextIndex(activeIndex, 1, slides.length)
      : activeIndex;
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
      className="amenities-section container"
      aria-labelledby={heading ? "amenities-title" : undefined}
    >
      <div className="amenities-top">
        <div className="amenities-heading-block">
          {eyebrow && (
            <p className="eyebrow amenities-eyebrow">
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

      <div className="amenities-content">
        <div className="amenities-copy-viewport">
          <div
            className="amenities-copy"
            key={`${activeItem.title}-copy-${activeIndex}`}
          >
            {activeItem.title && <h3>{activeItem.title}</h3>}
            {activeItem.content && <p>{activeItem.content}</p>}
          </div>
        </div>

        <div className="amenities-main-image">
          <Slider ref={sliderRef} {...settings} className="amenities-slick">
            {slides.map((item, index) => (
              <div
                className="amenities-image-slide"
                key={`${item.title}-main-${index}`}
              >
                {item.imageSrc && (
                  <img src={item.imageSrc} alt="" draggable="false" />
                )}
              </div>
            ))}
          </Slider>
        </div>

        <div className="amenities-side-image">
          <div
            className="amenities-side-slide"
            key={`${sideItem.title}-side-${sideImageIndex}`}
          >
            {sideItem.imageSrc && (
              <img src={sideItem.imageSrc} alt="" draggable="false" />
            )}
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.23448 12.2653L14.7345 19.7653C14.7693 19.8001 14.8107 19.8278 14.8562 19.8466C14.9017 19.8655 14.9505 19.8752 14.9998 19.8752C15.0491 19.8752 15.0979 19.8655 15.1434 19.8466C15.1889 19.8278 15.2303 19.8001 15.2651 19.7653C15.2999 19.7305 15.3276 19.6891 15.3464 19.6436C15.3653 19.5981 15.375 19.5493 15.375 19.5C15.375 19.4507 15.3653 19.4019 15.3464 19.3564C15.3276 19.3109 15.2999 19.2695 15.2651 19.2347L8.03042 12L15.2651 4.76531C15.3355 4.69494 15.375 4.59951 15.375 4.49999C15.375 4.40048 15.3355 4.30505 15.2651 4.23468C15.1947 4.16432 15.0993 4.12479 14.9998 4.12479C14.9003 4.12479 14.8048 4.16432 14.7345 4.23468L7.23448 11.7347C7.19961 11.7695 7.17195 11.8109 7.15308 11.8564C7.13421 11.9019 7.1245 11.9507 7.1245 12C7.1245 12.0493 7.13421 12.0981 7.15308 12.1436C7.17195 12.1891 7.19961 12.2305 7.23448 12.2653Z"
                  fill="white"
                />
              </svg>
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.7655 12.2653L9.26552 19.7653C9.23068 19.8001 9.18932 19.8278 9.1438 19.8466C9.09827 19.8655 9.04948 19.8752 9.00021 19.8752C8.95094 19.8752 8.90215 19.8655 8.85662 19.8466C8.8111 19.8278 8.76974 19.8001 8.7349 19.7653C8.70005 19.7305 8.67242 19.6891 8.65356 19.6436C8.63471 19.5981 8.625 19.5493 8.625 19.5C8.625 19.4507 8.63471 19.4019 8.65356 19.3564C8.67242 19.3109 8.70005 19.2695 8.7349 19.2347L15.9696 12L8.7349 4.76531C8.66453 4.69494 8.625 4.59951 8.625 4.49999C8.625 4.40048 8.66453 4.30505 8.7349 4.23468C8.80526 4.16432 8.9007 4.12479 9.00021 4.12479C9.09972 4.12479 9.19516 4.16432 9.26552 4.23468L16.7655 11.7347C16.8004 11.7695 16.828 11.8109 16.8469 11.8564C16.8658 11.9019 16.8755 11.9507 16.8755 12C16.8755 12.0493 16.8658 12.0981 16.8469 12.1436C16.828 12.1891 16.8004 12.2305 16.7655 12.2653Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
