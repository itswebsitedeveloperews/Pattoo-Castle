import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToReact,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function parseMapIframe(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const src = value.match(/\ssrc=["']([^"']+)["']/i)?.[1] || value;

  if (!/^https?:\/\//i.test(src)) {
    return null;
  }

  return {
    src,
    title:
      value.match(/\stitle=["']([^"']+)["']/i)?.[1] ||
      "Pattoo Castle location map",
  };
}

function getOverviewLocationContent(entry) {
  const fields = entry?.fields || {};

  return {
    title: fields.title || "",
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    location: parseMapIframe(fields.location),
    directionsButton: fields.directionsButton || "",
    directionsButtonLink: fields.directionsButtonLink || "",
    locationContent: richTextToReact(
      fields.locationContent,
      "overview-location-content",
    ),
    ctaImage: getContentfulAssetSrc(fields.ctaImage),
    ctaSubHeading: fields.ctaSubHeading || "",
    ctaHeading: fields.ctaHeading || "",
    ctaContent: richTextToReact(fields.ctaContent, "overview-location-cta"),
    ctaButtonText: fields.ctaButtonText || "",
    ctaButtonUrl: fields.ctaButtonUrl || "",
  };
}

export default function OverviewLocationPage({
  footerEntry = null,
  headerEntry = null,
  overviewLocationEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const page = getOverviewLocationContent(overviewLocationEntry);
  const hasDirectionsButton = Boolean(
    page.directionsButton && page.directionsButtonLink,
  );
  const hasDetailsSection = Boolean(
    page.location || page.locationContent || hasDirectionsButton,
  );

  const hasCtaSection = Boolean(
    page.ctaSubHeading ||
    page.ctaHeading ||
    page.ctaContent ||
    (page.ctaButtonText && page.ctaButtonUrl),
  );

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main>
        <section
          className="section page-hero overview-location-hero"
          style={
            page.bannerImage
              ? {
                  "--overview-location-banner-image": `url(${page.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={page.title ? "overview-location-title" : undefined}
        >
          <div className="page-hero-content overview-location-hero-content">
            {page.bannerSubHeading && (
              <p
                className="eyebrow page-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {page.bannerSubHeading}
              </p>
            )}
            {page.title && (
              <h1
                id="overview-location-title"
                data-aos="fade-up"
                data-aos-delay="50"
              >
                {page.title}
              </h1>
            )}
          </div>
        </section>

        {hasDetailsSection && (
          <section
            className="section overview-location-section"
            aria-label="Pattoo Castle location details"
          >
            <div className="wrap overview-location-grid">
              <div
                className="overview-location-copy"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {page.locationContent && (
                  <div className="overview-location-rich-text">
                    {page.locationContent}
                  </div>
                )}

                {hasDirectionsButton && (
                  <a
                    className="button button--brown overview-location-button"
                    href={page.directionsButtonLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {page.directionsButton}
                  </a>
                )}
              </div>

              {page.location && (
                <div
                  className="overview-location-map-frame"
                  data-aos="fade-in"
                  data-aos-delay="200"
                >
                  <iframe
                    src={page.location.src}
                    title={page.location.title}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {hasCtaSection && (
          <section
            className="section stay-cta-section"
            style={
              page.ctaImage
                ? {
                    "--stay-cta-image": `url(${page.ctaImage})`,
                  }
                : undefined
            }
            aria-labelledby={page.ctaHeading ? "stay-cta-title" : undefined}
          >
            <div className="wrap stay-cta-content">
              {page.ctaSubHeading && (
                <p
                  className="eyebrow stay-cta-eyebrow"
                  data-aos="fade-up"
                  data-aos-delay="20"
                >
                  {page.ctaSubHeading}
                </p>
              )}
              {page.ctaHeading && (
                <h2 id="stay-cta-title" data-aos="fade-up" data-aos-delay="50">
                  {page.ctaHeading}
                </h2>
              )}
              {page.ctaContent && (
                <div
                  className="stay-cta-text"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {page.ctaContent}
                </div>
              )}
              {page.ctaButtonText && page.ctaButtonUrl && (
                <a
                  className="button button--light stay-cta-button"
                  href={page.ctaButtonUrl}
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  {page.ctaButtonText}
                </a>
              )}
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
