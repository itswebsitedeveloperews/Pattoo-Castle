"use client";

import { useRef, useState } from "react";

const DRAG_THRESHOLD = 48;
const SLIDE_DURATION = 420;

function getSlideIndex(index, direction, totalItems) {
  return (index + direction + totalItems) % totalItems;
}

export default function GalleryPreviewSlider({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const dragStartX = useRef(null);
  const slideTimeout = useRef(null);

  if (images.length === 0) {
    return null;
  }

  const previousIndex =
    images.length > 1 ? getSlideIndex(activeIndex, -1, images.length) : activeIndex;
  const nextIndex =
    images.length > 1 ? getSlideIndex(activeIndex, 1, images.length) : activeIndex;

  function moveSlide(direction) {
    if (images.length <= 1) {
      return;
    }

    window.clearTimeout(slideTimeout.current);
    setSlideDirection(direction);
    setActiveIndex((index) => getSlideIndex(index, direction, images.length));
    slideTimeout.current = window.setTimeout(() => {
      setSlideDirection(0);
    }, SLIDE_DURATION);
  }

  function handleDragStart(event) {
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

  return (
    <div
      className={`gallery-preview-images${
        slideDirection === 1
          ? " is-next"
          : slideDirection === -1
            ? " is-prev"
            : ""
      }`}
      onPointerCancel={() => {
        dragStartX.current = null;
      }}
      onPointerDown={handleDragStart}
      onPointerUp={handleDragEnd}
    >
      <button
        aria-label="Show previous gallery image"
        className="gallery-preview-image-button gallery-preview-image-1"
        onClick={() => moveSlide(-1)}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        type="button"
      >
        <img src={images[previousIndex]} alt="" draggable="false" />
        <span className="gallery-preview-arrow" aria-hidden="true">
          &lt;
        </span>
      </button>

      <div className="gallery-preview-main" aria-live="polite">
        <img src={images[activeIndex]} alt="" draggable="false" />
      </div>

      <button
        aria-label="Show next gallery image"
        className="gallery-preview-image-button gallery-preview-image-3"
        onClick={() => moveSlide(1)}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        type="button"
      >
        <img src={images[nextIndex]} alt="" draggable="false" />
        <span className="gallery-preview-arrow" aria-hidden="true">
          &gt;
        </span>
      </button>
    </div>
  );
}
