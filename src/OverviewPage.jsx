import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFooterContent,
  getHeaderContent,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function getOverviewContent(entry) {
  const fields = entry?.fields || {};
  const overviewBlocks = Array.isArray(fields.overviewBlocks)
    ? fields.overviewBlocks
        .map((item) => {
          const itemFields = item?.fields || {};
          const imageAsset = Array.isArray(itemFields.images)
            ? itemFields.images[0]
            : itemFields.images;

          return {
            image: getContentfulImage(imageAsset),
            title: itemFields.title || "",
            buttonUrl: itemFields.buttonUrl || "",
          };
        })
        .filter(
          (item) =>
            item.image?.src ||
            item.title ||
            item.buttonUrl,
        )
    : [];

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || "",
    overviewBlocks,
  };
}

export default function OverviewPage({
  footerEntry = null,
  headerEntry = null,
  overviewEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const overview = getOverviewContent(overviewEntry);
  const hasOverviewBlocks = overview.overviewBlocks.length > 0;

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main>
        <section
          className="section page-hero overview-hero"
          style={
            overview.bannerImage
              ? { "--overview-banner-image": `url(${overview.bannerImage})` }
              : undefined
          }
          aria-labelledby={
            overview.bannerHeading ? "overview-title" : undefined
          }
        >
          <div className="page-hero-content overview-hero-content">
            {overview.bannerHeading && (
              <h1 id="overview-title" data-aos="fade-up" data-aos-delay="50">
                {overview.bannerHeading}
              </h1>
            )}
          </div>
        </section>

        {hasOverviewBlocks && (
          <section
            className="section overview-blocks-section"
            aria-label="Overview links"
          >
            <div className="wrap overview-blocks-grid">
              {overview.overviewBlocks.map((item, index) => {
                const BlockElement = item.buttonUrl ? "a" : "article";
                const blockProps = item.buttonUrl
                  ? {
                      href: item.buttonUrl,
                      "aria-label": item.title
                        ? `Open ${item.title}`
                        : `Open overview item ${index + 1}`,
                    }
                  : {};

                return (
                  <BlockElement
                    className="overview-block-card"
                    key={`${item.title}-${index}`}
                    data-aos="fade-up"
                    data-aos-delay={String(index * 100)}
                    {...blockProps}
                  >
                    {item.image?.src && (
                      <img
                        src={item.image.src}
                        alt={item.image.alt || `Pattoo Castle overview ${index + 1}`}
                      />
                    )}
                    <div className="overview-block-content">
                      {item.title && <h2>{item.title}</h2>}
                    </div>
                  </BlockElement>
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
