import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function getAccommodationContent(entry) {
  const fields = entry?.fields || {};
  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || "",
  };
}

export default function AccommodationPage({
  accommodationEntry = null,
  footerEntry = null,
  headerEntry = null,
}) {
  const accommodation = getAccommodationContent(accommodationEntry);
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="page-hero accommodation-hero"
          style={
            accommodation.bannerImage
              ? {
                  "--accommodation-banner-image": `url(${accommodation.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={
            accommodation.bannerHeading ? "accommodation-title" : undefined
          }
        >
          <div className="page-hero-content accommodation-hero-content">
            {accommodation.bannerHeading && (
              <h1
                id="accommodation-title"
                data-aos="fade-up"
                data-aos-delay="60"
              >
                {accommodation.bannerHeading}
              </h1>
            )}
          </div>
        </section>

      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
