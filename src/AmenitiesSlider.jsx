"use client";

import { useRef, useState } from "react";

const VISIBLE_ITEM_COUNT = 4;
const DRAG_THRESHOLD = 48;
const LIST_ITEM_STEP = 58;

function getNextIndex(currentIndex, direction, totalItems) {
  return (currentIndex + direction + totalItems) % totalItems;
}

export default function AmenitiesSlider({
  eyebrow = "",
  heading = "",
  items = [],
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartX = useRef(null);
  const sideImageIndex =
    items.length > 1 ? getNextIndex(activeIndex, 1, items.length) : activeIndex;
  const listOffset = Math.min(
    Math.max(activeIndex - (VISIBLE_ITEM_COUNT - 1), 0),
    Math.max(items.length - VISIBLE_ITEM_COUNT, 0),
  );

  function moveSlide(direction) {
    if (items.length <= 1) {
      return;
    }

    setActiveIndex((index) => getNextIndex(index, direction, items.length));
  }

  function selectSlide(index) {
    if (index === activeIndex) {
      return;
    }

    setActiveIndex(index);
  }

  function handleDragStart(event) {
    if (event.target.closest("button")) {
      return;
    }

    dragStartX.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handleDragEnd(event) {
    if (dragStartX.current == null) {
      return;
    }

    const delta = event.clientX - dragStartX.current;
    dragStartX.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (Math.abs(delta) < DRAG_THRESHOLD) {
      return;
    }

    moveSlide(delta < 0 ? 1 : -1);
  }

  if (!eyebrow && !heading && items.length === 0) {
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

        {items.length > 0 && (
          <div
            className="amenities-list"
            aria-label="Amenities"
            style={{
              "--amenities-list-offset": `${listOffset * -LIST_ITEM_STEP}px`,
            }}
          >
            <div className="amenities-list-track">
              {items.map((item, index) => (
                <button
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={index === activeIndex ? "is-active" : undefined}
                  key={`${item.title}-${index}`}
                  onClick={() => selectSlide(index)}
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
        onPointerCancel={() => {
          dragStartX.current = null;
        }}
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        style={{
          "--amenities-track-offset": `${activeIndex * -100}%`,
          "--amenities-side-track-offset": `${sideImageIndex * -100}%`,
        }}
      >
        <div className="amenities-copy-viewport">
          <div className="amenities-copy-track">
            {items.map((item, index) => (
              <div className="amenities-copy" key={`${item.title}-copy-${index}`}>
                {item.title && <h3>{item.title}</h3>}
                {item.content && <p>{item.content}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="amenities-main-image">
          <div className="amenities-image-track">
            {items.map((item, index) => (
              <div className="amenities-image-slide" key={`${item.title}-main-${index}`}>
                {item.imageSrc && <img src={item.imageSrc} alt="" draggable="false" />}
              </div>
            ))}
          </div>
        </div>

        <div className="amenities-side-image">
          <div className="amenities-side-track">
            {items.map((item, index) => (
              <div className="amenities-side-slide" key={`${item.title}-side-${index}`}>
                {item.imageSrc && <img src={item.imageSrc} alt="" draggable="false" />}
              </div>
            ))}
          </div>
        </div>

        {items.length > 1 && (
          <div className="amenities-controls">
            <button
              aria-label="Show previous amenity"
              className="amenities-control-prev"
              onClick={() => moveSlide(-1)}
              type="button"
            >
              ‹
            </button>
            <button
              aria-label="Show next amenity"
              className="amenities-control-next"
              onClick={() => moveSlide(1)}
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
