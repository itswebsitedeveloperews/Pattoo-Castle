import {
  getContentfulAssetSrc,
  getAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  SiteFooter,
  SiteHeader,
} from "./App";
import GalleryFilterGrid from "./GalleryFilterGrid";
import ReserveStaySection from "./ReserveStaySection";
import logo from "./assets/patto-logo.svg";

function getGalleryContent(entry) {
  const fields = entry?.fields || {};
  const galleryItems = Array.isArray(fields.gallery)
    ? fields.gallery
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            imageSrc: getContentfulAssetSrc(itemFields.galleryImage),
            type: itemFields.galleryImageType || "",
          };
        })
        .filter((item) => item.imageSrc)
    : [];
  const pattooCastleImages = Array.isArray(fields.pattooCastleImages)
    ? fields.pattooCastleImages.map(getContentfulAssetSrc).filter(Boolean)
    : [];
  const reserveYourStayDateFields = fields.reserveYourStayDate?.fields || {};
  const reserveYourStayDate = {
    title: reserveYourStayDateFields.title || "",
    content: richTextToPlainText(reserveYourStayDateFields.content),
    buttonText: reserveYourStayDateFields.buttonText || "",
    buttonUrl: reserveYourStayDateFields.buttonUrl || "",
  };

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    introSubHeading: fields.introSubHeading || "",
    introHeading: fields.introHeading || "",
    introDescription: richTextToPlainText(fields.introDescription),
    galleryItems,
    pattooCastleHeading: fields.pattooCastleHeading || "",
    pattooCastleSubHeading: fields.pattooCastleSubHeading || "",
    pattooCastleImages,
    reserveYourStayImage: getContentfulAssetSrc(fields.reserveYourStayImage),
    reserveYourStayVideo: getContentfulAssetSrc(fields.reserveYourStayVideo),
    reserveYourStayDate,
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
  const hasButton = Boolean(gallery.buttonText && gallery.buttonUrl);
  const hasIntroSection = Boolean(
    gallery.introSubHeading || gallery.introHeading || gallery.introDescription,
  );
  const hasReserveButton = Boolean(
    gallery.reserveYourStayDate.buttonText &&
      gallery.reserveYourStayDate.buttonUrl,
  );
  const hasReserveSection = Boolean(
    gallery.reserveYourStayImage ||
      gallery.reserveYourStayVideo ||
      gallery.reserveYourStayDate.title ||
      gallery.reserveYourStayDate.content ||
      hasReserveButton,
  );

  return (
    <main>
      <section
        className="gallery-hero"
        style={
          gallery.bannerImage
            ? { "--gallery-banner-image": `url(${gallery.bannerImage})` }
            : undefined
        }
        aria-labelledby={gallery.bannerHeading ? "gallery-title" : undefined}
      >
        <SiteHeader header={header} />

        <div className="gallery-hero-content">
          {gallery.bannerSubHeading && (
            <p className="gallery-hero-eyebrow">{gallery.bannerSubHeading}</p>
          )}
          {gallery.bannerHeading && (
            <h1 id="gallery-title">{gallery.bannerHeading}</h1>
          )}
          {gallery.bannerContent && <p>{gallery.bannerContent}</p>}
          {hasButton && (
            <a
              className="button button--light gallery-hero-button"
              href={gallery.buttonUrl}
            >
              {gallery.buttonText}
            </a>
          )}
        </div>
      </section>

      {hasIntroSection && (
        <section
          className="gallery-intro-section"
          aria-labelledby={gallery.introHeading ? "gallery-intro-title" : undefined}
        >
          {gallery.introSubHeading && (
            <p className="gallery-intro-eyebrow">{gallery.introSubHeading}</p>
          )}
          {gallery.introHeading && (
            <h2 id="gallery-intro-title">{gallery.introHeading}</h2>
          )}
          {gallery.introDescription && <p>{gallery.introDescription}</p>}
        </section>
      )}

      {gallery.galleryItems.length > 0 && (
        <GalleryFilterGrid items={gallery.galleryItems} />
      )}

      {(gallery.pattooCastleHeading ||
        gallery.pattooCastleSubHeading ||
        gallery.pattooCastleImages.length > 0) && (
        <section className="gallery-pattoo-section">
          <div className="gallery-pattoo-quote">
            <span aria-hidden="true">“</span>
            {gallery.pattooCastleHeading && <h2>{gallery.pattooCastleHeading}</h2>}
            {gallery.pattooCastleSubHeading && (
              <p>{gallery.pattooCastleSubHeading}</p>
            )}
          </div>

          {gallery.pattooCastleImages.length > 0 && (
            <div className="gallery-pattoo-images">
              {gallery.pattooCastleImages.slice(0, 2).map((imageSrc, index) => (
                <img src={imageSrc} alt="" key={`${imageSrc}-${index}`} />
              ))}
            </div>
          )}
        </section>
      )}

      {hasReserveSection && (
        <ReserveStaySection
          backgroundImage={gallery.reserveYourStayImage}
          buttonText={gallery.reserveYourStayDate.buttonText}
          buttonUrl={gallery.reserveYourStayDate.buttonUrl}
          content={gallery.reserveYourStayDate.content}
          logoSrc={getAssetSrc(logo)}
          title={gallery.reserveYourStayDate.title}
          videoSrc={gallery.reserveYourStayVideo}
        />
      )}

      <SiteFooter footer={footer} />
    </main>
  );
}
