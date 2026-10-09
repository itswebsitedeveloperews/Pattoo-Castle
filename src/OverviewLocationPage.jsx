import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  richTextToReact,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function parseMapIframe(value) {
  const markup = richTextToPlainText(value)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  if (!markup) {
    return null;
  }

  const src = markup.match(/\ssrc=["']([^"']+)["']/i)?.[1] || markup;

  if (!/^https?:\/\//i.test(src)) {
    return null;
  }

  return {
    src,
    title:
      markup.match(/\stitle=["']([^"']+)["']/i)?.[1] ||
      "Pattoo Castle location map",
  };
}

function getOverviewLocationContent(entry) {
  const fields = entry?.fields || {};

  return {
    title: fields.bannerHeading || fields.title || "",
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    location: parseMapIframe(fields.location),
    directionsButton: fields.directionsButton || "",
    directionsButtonLink: fields.directionsButtonLink || "",
    locationContent: richTextToReact(
      fields.locationContent,
      "overview-location-content",
      true,
    ),
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

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main>
        <section
          className="pt-0 pb-0 section page-hero overview-location-hero"
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
                    className="btn btn--brown overview-location-button"
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

      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
