"use client";

import Slider from "react-slick";
import styles from "./VillaDetailsPage.module.css";

export default function BedroomImageSlider({ images = [], title = "Bedroom" }) {
  if (!images.length) return null;
  const multiple = images.length > 1;
  return (
    <div className={styles.bedroomSlider} role="region" aria-roledescription="carousel" aria-label={`${title} images`}>
      <Slider arrows={false} dots={multiple} infinite={multiple} slidesToShow={1} slidesToScroll={1} speed={650} swipe={multiple} draggable={multiple} accessibility
        customPaging={(index) => <button type="button" aria-label={`Show ${title} image ${index + 1}`}>{index + 1}</button>}
      >
        {images.map((image, index) => (
          <div key={`${image.src}-${index}`}>
            <img src={image.src} alt={image.alt || `${title}, view ${index + 1}`} loading="lazy" draggable="false" />
          </div>
        ))}
      </Slider>
    </div>
  );
}
