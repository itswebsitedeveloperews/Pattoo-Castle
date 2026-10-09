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
      className="section home-gallery-section pt-0"
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
          <a
            className="btn btn--brown home-gallery-button"
            href={buttonUrl}
          >
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
              <span aria-hidden="true">
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
              </span>
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
              <span aria-hidden="true">
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
              </span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
