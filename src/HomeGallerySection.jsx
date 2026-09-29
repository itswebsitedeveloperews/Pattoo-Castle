"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export default function HomeGallerySection({
  buttonText = "",
  buttonUrl = "",
  heading = "",
  images = [],
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const previewImages = useMemo(() => images.slice(0, 6), [images]);
  const selectedImage =
    selectedIndex === null ? null : images[selectedIndex] || null;
  const hasMultipleImages = images.length > 1;
  const hasButton = Boolean(buttonText && buttonUrl);

  const closeSlider = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showPreviousImage = useCallback(() => {
    setSelectedIndex((currentIndex) =>
      currentIndex === null
        ? null
        : (currentIndex - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const showNextImage = useCallback(() => {
    setSelectedIndex((currentIndex) =>
      currentIndex === null ? null : (currentIndex + 1) % images.length,
    );
  }, [images.length]);

  useEffect(() => {
    if (!selectedImage) {
      return undefined;
    }

    document.body.classList.add("home-gallery-modal-is-open");

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeSlider();
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        showPreviousImage();
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        showNextImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("home-gallery-modal-is-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    closeSlider,
    hasMultipleImages,
    selectedImage,
    showNextImage,
    showPreviousImage,
  ]);

  if (!previewImages.length && !heading && !hasButton) {
    return null;
  }

  return (
    <section
      aria-labelledby={heading ? "home-gallery-title" : undefined}
      className="home-gallery-section"
    >
      <div className="home-gallery-inner container">
        {heading && <h2 id="home-gallery-title">{heading}</h2>}

        {previewImages.length > 0 && (
          <div className="home-gallery-grid">
            {previewImages.map((image, index) => (
              <button
                aria-label={`Open gallery image ${index + 1}`}
                className="home-gallery-item"
                data-aos="fade-up"
                data-aos-delay={String(index * 40)}
                key={`${image.src}-${index}`}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <img
                  src={image.src}
                  alt={image.alt || `Pattoo Castle gallery image ${index + 1}`}
                />
              </button>
            ))}
          </div>
        )}

        {hasButton && (
          <a className="button button--brown home-gallery-button" href={buttonUrl}>
            {buttonText}
          </a>
        )}
      </div>

      {selectedImage && (
        <div
          aria-label="Home gallery slider"
          aria-modal="true"
          className="home-gallery-modal"
          onClick={closeSlider}
          role="dialog"
        >
          <button
            aria-label="Close gallery slider"
            className="home-gallery-modal-close"
            onClick={closeSlider}
            type="button"
          >
            &times;
          </button>

          {hasMultipleImages && (
            <button
              aria-label="Previous gallery image"
              className="home-gallery-modal-control home-gallery-modal-control--previous"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousImage();
              }}
              type="button"
            >
              <span aria-hidden="true">&#8249;</span>
            </button>
          )}

          <figure
            className="home-gallery-modal-frame"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="home-gallery-modal-image"
              src={selectedImage.src}
              alt={selectedImage.alt || "Pattoo Castle gallery preview"}
            />
            {images.length > 1 && (
              <figcaption className="home-gallery-modal-count">
                {selectedIndex + 1} / {images.length}
              </figcaption>
            )}
          </figure>

          {hasMultipleImages && (
            <button
              aria-label="Next gallery image"
              className="home-gallery-modal-control home-gallery-modal-control--next"
              onClick={(event) => {
                event.stopPropagation();
                showNextImage();
              }}
              type="button"
            >
              <span aria-hidden="true">&#8250;</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
