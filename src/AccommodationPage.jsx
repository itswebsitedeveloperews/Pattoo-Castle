import {
  getContentfulAssetSrc,
  getFirstContentfulImage,
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
    blocks: Array.isArray(fields.accommodationBlocks)
      ? fields.accommodationBlocks.map((entry, index) => {
          const block = entry?.fields || {};
          return {
            id: entry?.sys?.id || `accommodation-block-${index}`,
            image: getFirstContentfulImage(block.images),
            title: block.title || "",
            url: block.buttonUrl || "",
          };
        }).filter((block) => block.image?.src || block.title)
      : [],
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
        {accommodation.blocks.length > 0 && (
          <section
            className="section accommodation-blocks-section"
            aria-label="Accommodation options"
          >
            <div className="accommodation-blocks-grid">
              {accommodation.blocks.map((block) => {
                const Element = block.url ? "a" : "article";
                return (
                  <Element
                    className="accommodation-image-box"
                    key={block.id}
                    {...(block.url ? { href: block.url } : {})}
                  >
                    {block.image?.src && (
                      <img
                        src={block.image.src}
                        alt={block.image.alt || block.title}
                        loading="lazy"
                      />
                    )}
                    {block.title && <h2>{block.title}</h2>}
                  </Element>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
