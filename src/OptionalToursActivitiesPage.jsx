import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function OptionalToursActivitiesPage({
  footerEntry = null,
  headerEntry = null,
  optionalToursActivitiesEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const fields = optionalToursActivitiesEntry?.fields || {};
  const bannerImage = getContentfulAssetSrc(fields.bannerImage);
  const bannerHeading = fields.bannerHeading || "";

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="section page-hero location-hero"
          style={
            bannerImage
              ? { "--location-banner-image": `url(${bannerImage})` }
              : undefined
          }
          aria-labelledby={bannerHeading ? "optional-tours-title" : undefined}
        >
          <div className="page-hero-content location-hero-content">
            {bannerHeading && (
              <h1 id="optional-tours-title" data-aos="fade-up" data-aos-delay="50">
                {bannerHeading}
              </h1>
            )}
          </div>
        </section>
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
