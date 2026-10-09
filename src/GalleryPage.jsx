import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFooterContent,
  getHeaderContent,
} from "./App";
import GalleryFilterGrid from "./GalleryFilterGrid";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./GalleryPage.module.css";

function getGalleryContent(entry) {
  const fields = entry?.fields || {};
  const galleryItems = Array.isArray(fields.galleryImages)
    ? fields.galleryImages
        .map((asset) => ({ image: getContentfulImage(asset) }))
        .filter((item) => item.image?.src)
    : [];

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerIsVideo: Boolean(fields.bannerImage?.fields?.file?.contentType?.startsWith("video/")),
    bannerHeading: fields.bannerHeading || "",
    galleryItems,
  };
}

export default function GalleryPage({
  footerEntry = null,
  galleryEntry = null,
  headerEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const gallery = getGalleryContent(galleryEntry);
  const header = getHeaderContent(headerEntry);

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className={`pt-0 pb-0 section page-hero gallery-hero${gallery.bannerIsVideo ? ` ${styles.videoBanner}` : ""}`}
          style={
            gallery.bannerImage && !gallery.bannerIsVideo
              ? { "--gallery-banner-image": `url(${gallery.bannerImage})` }
              : undefined
          }
          aria-labelledby={gallery.bannerHeading ? "gallery-title" : undefined}
        >
          {gallery.bannerIsVideo && gallery.bannerImage && (
            <video
              className={styles.bannerVideo}
              src={gallery.bannerImage}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
            />
          )}
          <div className="wrap">
            <div className="page-hero-content gallery-hero-content">
              {gallery.bannerHeading && (
                <h1 id="gallery-title" data-aos="fade-up" data-aos-delay="50">
                  {gallery.bannerHeading}
                </h1>
              )}
            </div>
          </div>
        </section>

        {gallery.galleryItems.length > 0 && (
          <GalleryFilterGrid items={gallery.galleryItems} />
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
