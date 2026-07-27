import {
  getContentfulAssetSrc,
  getAssetSrc,
  getContentfulImage,
  getFirstContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
} from "./App";
import GalleryFilterGrid from "./GalleryFilterGrid";
import ReserveStaySection from "./ReserveStaySection";
import logo from "./assets/patto-logo.svg";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function getGalleryContent(entry) {
  const fields = entry?.fields || {};
  const galleryItems = Array.isArray(fields.gallery)
    ? fields.gallery
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            image: getContentfulImage(itemFields.galleryImage),
            type: itemFields.galleryImageType || "",
          };
        })
        .filter((item) => item.image?.src)
    : [];
  const pattooCastleImages = Array.isArray(fields.pattooCastleImages)
    ? fields.pattooCastleImages
        .map((asset) => getContentfulImage(asset))
        .filter((image) => image?.src)
    : [];
  const reserveYourStayDateFields = fields.reserveYourStayDate?.fields || {};
  const reserveYourStayDate = {
    logo: getFirstContentfulImage(reserveYourStayDateFields.images),
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
    reserveYourStayImage: getContentfulImage(fields.reserveYourStayImage),
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
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="section page-hero gallery-hero"
          style={
            gallery.bannerImage
              ? { "--gallery-banner-image": `url(${gallery.bannerImage})` }
              : undefined
          }
          aria-labelledby={gallery.bannerHeading ? "gallery-title" : undefined}
        >
          <div className="wrap">
            <div className="page-hero-content gallery-hero-content">
              {gallery.bannerSubHeading && (
                <p
                  className="eyebrow page-hero-eyebrow gallery-hero-eyebrow"
                  data-aos="fade-up"
                  data-aos-delay="20"
                >
                  {gallery.bannerSubHeading}
                </p>
              )}
              {gallery.bannerHeading && (
                <h1 id="gallery-title" data-aos="fade-up" data-aos-delay="50">
                  {gallery.bannerHeading}
                </h1>
              )}
              {gallery.bannerContent && (
                <p data-aos="fade-up" data-aos-delay="100">
                  {gallery.bannerContent}
                </p>
              )}
              {hasButton && (
                <a
                  className="button button--light page-hero-button gallery-hero-button"
                  href={gallery.buttonUrl}
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  {gallery.buttonText}
                </a>
              )}
            </div>
          </div>
        </section>

        {hasIntroSection && (
          <section
            className="section gallery-intro-section"
            aria-labelledby={
              gallery.introHeading ? "gallery-intro-title" : undefined
            }
          >
            <div className="wrap" data-aos="fade-up">
              {gallery.introSubHeading && (
                <p className="eyebrow gallery-intro-eyebrow">
                  {gallery.introSubHeading}
                </p>
              )}
              {gallery.introHeading && (
                <h2 id="gallery-intro-title">{gallery.introHeading}</h2>
              )}
              {gallery.introDescription && <p>{gallery.introDescription}</p>}
            </div>
          </section>
        )}

        {gallery.galleryItems.length > 0 && (
          <GalleryFilterGrid items={gallery.galleryItems} />
        )}

        {(gallery.pattooCastleHeading ||
          gallery.pattooCastleSubHeading ||
          gallery.pattooCastleImages.length > 0) && (
          <section className="section gallery-pattoo-section">
            <div className="wrap">
              <div
                className="gallery-pattoo-quote"
                data-aos="fade-up"
                data-aos-delay="50"
              >
                <span aria-hidden="true">“</span>
                {gallery.pattooCastleHeading && (
                  <h2>{gallery.pattooCastleHeading}</h2>
                )}
                {gallery.pattooCastleSubHeading && (
                  <p className="eyebrow">{gallery.pattooCastleSubHeading}</p>
                )}
              </div>

              {gallery.pattooCastleImages.length > 0 && (
                <div className="gallery-pattoo-images">
                  {gallery.pattooCastleImages
                    .slice(0, 2)
                    .map((image, index) => (
                      <img
                        src={image.src}
                        alt={image.alt || `Pattoo Castle gallery highlight ${index + 1}`}
                        key={`${image.src}-${index}`}
                        data-aos="fade-up"
                        data-aos-delay={String(index * 100)}
                      />
                    ))}
                </div>
              )}
            </div>
          </section>
        )}

        {hasReserveSection && (
          <ReserveStaySection
            backgroundImage={gallery.reserveYourStayImage?.src}
            buttonText={gallery.reserveYourStayDate.buttonText}
            buttonUrl={gallery.reserveYourStayDate.buttonUrl}
            content={gallery.reserveYourStayDate.content}
            logoAlt={gallery.reserveYourStayDate.logo?.alt}
            logoSrc={gallery.reserveYourStayDate.logo?.src || getAssetSrc(logo)}
            title={gallery.reserveYourStayDate.title}
            videoSrc={gallery.reserveYourStayVideo}
          />
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
