import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToReact,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function getGettingHereContent(entry) {
  const fields = entry?.fields || {};

  return {
    bannerSubHeading: fields.bannerSubHeading || "",
    title: fields.title || "",
    bannerContent: richTextToReact(fields.bannerContent, "getting-here-banner"),
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    gettingHereSubHeading: fields.gettingHereSubHeading || "",
    gettingHereHeading: fields.gettingHereHeading || "",
    gettingHereContent: richTextToReact(
      fields.gettingHereContent,
      "getting-here-content",
    ),
    gettingHereImage: getContentfulImage(fields.gettingHereImage),
    ctaImage: getContentfulAssetSrc(fields.ctaImage),
    ctaSubHeading: fields.ctaSubHeading || "",
    ctaHeading: fields.ctaHeading || "",
    ctaContent: richTextToReact(fields.ctaContent, "getting-here-cta"),
    ctaButtonText: fields.ctaButtonText || "",
    ctaButtonUrl: fields.ctaButtonUrl || "",
  };
}

export default function GettingHerePage({
  footerEntry = null,
  gettingHereEntry = null,
  headerEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const page = getGettingHereContent(gettingHereEntry);
  const hasBannerContent = Boolean(page.bannerContent);
  const hasGettingHereSection = Boolean(
    page.gettingHereSubHeading ||
    page.gettingHereHeading ||
    page.gettingHereContent ||
    page.gettingHereImage?.src,
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
          className="section page-hero getting-here-hero"
          style={
            page.bannerImage
              ? { "--getting-here-banner-image": `url(${page.bannerImage})` }
              : undefined
          }
          aria-labelledby={
            page.bannerHeading ? "getting-here-title" : undefined
          }
        >
          <div className="page-hero-content getting-here-hero-content">
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
            {hasBannerContent && (
              <div
                className="getting-here-banner-content"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {page.bannerContent}
              </div>
            )}
          </div>
        </section>

        {hasGettingHereSection && (
          <section
            className="section getting-here-detail-section"
            aria-labelledby={
              page.gettingHereHeading ? "getting-here-detail-title" : undefined
            }
          >
            <div className="wrap getting-here-detail-grid">
              {page.gettingHereImage?.src && (
                <div
                  className="getting-here-detail-image"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <img
                    src={page.gettingHereImage.src}
                    alt={
                      page.gettingHereImage.alt ||
                      "Getting to Pattoo Castle in Negril"
                    }
                  />
                </div>
              )}

              <div
                className="getting-here-detail-content"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {page.gettingHereSubHeading && (
                  <p className="eyebrow getting-here-detail-eyebrow">
                    {page.gettingHereSubHeading}
                  </p>
                )}

                {page.gettingHereHeading && (
                  <h2 id="getting-here-detail-title">
                    {page.gettingHereHeading}
                  </h2>
                )}

                {page.gettingHereContent && (
                  <div className="getting-here-rich-text">
                    {page.gettingHereContent}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {hasCtaSection && (
          <section
            className="section stay-cta-section"
            style={
              page.ctaImage
                ? { "--stay-cta-image": `url(${page.ctaImage})` }
                : undefined
            }
            aria-labelledby={
              page.ctaHeading ? "getting-here-cta-title" : undefined
            }
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
                <h2
                  id="getting-here-cta-title"
                  data-aos="fade-up"
                  data-aos-delay="50"
                >
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
