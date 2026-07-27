import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
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
            content: richTextToPlainText(itemFields.content),
            buttonText: itemFields.buttonText || "",
            buttonUrl: itemFields.buttonUrl || "",
          };
        })
        .filter(
          (item) =>
            item.image?.src ||
            item.title ||
            item.content ||
            (item.buttonText && item.buttonUrl),
        )
    : [];
  const caribbeanLivingFacilities = Array.isArray(
    fields.caribbeanLivingFacilities,
  )
    ? fields.caribbeanLivingFacilities
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.title || item.content)
    : [];

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
    overviewBlocks,
    villaImage: getContentfulImage(fields.villaImage),
    villaSubHeading: fields.villaSubHeading || "",
    villaHeading: fields.villaHeading || "",
    villaContent: richTextToPlainText(fields.villaContent),
    villaButtonText: fields.villaButtonText || "",
    villaButtonUrl: fields.villaButtonUrl || "",
    caribbeanLivingSubHeading: fields.caribbeanLivingSubHeading || "",
    caribbeanLivingHeading: fields.caribbeanLivingHeading || "",
    caribbeanLivingFacilities,
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
  const hasButton = Boolean(overview.buttonText && overview.buttonUrl);
  const hasIntroSection = Boolean(
    overview.introSubHeading ||
    overview.introHeading ||
    overview.introDescription,
  );
  const hasOverviewBlocks = overview.overviewBlocks.length > 0;
  const hasVillaButton = Boolean(
    overview.villaButtonText && overview.villaButtonUrl,
  );
  const hasVillaSection = Boolean(
    overview.villaImage?.src ||
    overview.villaSubHeading ||
    overview.villaHeading ||
    overview.villaContent ||
    hasVillaButton,
  );
  const hasCaribbeanLivingSection = Boolean(
    overview.caribbeanLivingSubHeading ||
    overview.caribbeanLivingHeading ||
    overview.caribbeanLivingFacilities.length,
  );

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
            {overview.bannerSubHeading && (
              <p
                className="eyebrow page-hero-eyebrow overview-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {overview.bannerSubHeading}
              </p>
            )}
            {overview.bannerHeading && (
              <h1 id="overview-title" data-aos="fade-up" data-aos-delay="50">
                {overview.bannerHeading}
              </h1>
            )}
            {overview.bannerContent && (
              <p data-aos="fade-up" data-aos-delay="100">
                {overview.bannerContent}
              </p>
            )}
            {hasButton && (
              <a
                className="button button--light page-hero-button overview-hero-button"
                href={overview.buttonUrl}
                data-aos="fade-up"
                data-aos-delay="150"
              >
                {overview.buttonText}
              </a>
            )}
          </div>
        </section>

        {hasIntroSection && (
          <section
            className="section overview-intro-section"
            aria-labelledby={
              overview.introHeading ? "overview-intro-title" : undefined
            }
          >
            <div className="wrap">
              {overview.introSubHeading && (
                <p
                  className="eyebrow overview-intro-eyebrow"
                  data-aos="fade-up"
                  data-aos-delay="50"
                >
                  {overview.introSubHeading}
                </p>
              )}
              {overview.introHeading && (
                <h2
                  id="overview-intro-title"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {overview.introHeading}
                </h2>
              )}
              {overview.introDescription && (
                <p data-aos="fade-up" data-aos-delay="150">
                  {overview.introDescription}
                </p>
              )}
            </div>
          </section>
        )}

        {hasOverviewBlocks && (
          <section
            className="section overview-blocks-section"
            aria-label="Overview links"
          >
            <div className="wrap overview-blocks-grid">
              {overview.overviewBlocks.map((item, index) => {
                const hasBlockButton = Boolean(
                  item.buttonText && item.buttonUrl,
                );

                return (
                  <article
                    className="overview-block-card"
                    key={`${item.title}-${index}`}
                    data-aos="fade-up"
                    data-aos-delay={String(index * 100)}
                  >
                    {item.image?.src && (
                      <img
                        src={item.image.src}
                        alt={item.image.alt || `Pattoo Castle overview ${index + 1}`}
                      />
                    )}
                    <div className="overview-block-content">
                      {item.title && <h2>{item.title}</h2>}
                      {item.content && <p>{item.content}</p>}
                      {hasBlockButton && (
                        <a
                          className="button button--brown overview-block-button"
                          href={item.buttonUrl}
                        >
                          {item.buttonText}
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {hasVillaSection && (
          <section
            className="section overview-villa-section"
            aria-labelledby={
              overview.villaHeading ? "overview-villa-title" : undefined
            }
          >
            <div className="wrap">
              {overview.villaImage?.src && (
                <div
                  className="overview-villa-image"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <img
                    src={overview.villaImage.src}
                    alt={overview.villaImage.alt || "Pattoo Castle villa overview"}
                  />
                </div>
              )}

              <div
                className="overview-villa-content"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {overview.villaSubHeading && (
                  <p className="eyebrow overview-villa-eyebrow">
                    {overview.villaSubHeading}
                  </p>
                )}

                {overview.villaHeading && (
                  <h2 id="overview-villa-title">{overview.villaHeading}</h2>
                )}

                {overview.villaContent && <p>{overview.villaContent}</p>}

                {hasVillaButton && (
                  <a
                    className="button button--brown overview-villa-button"
                    href={overview.villaButtonUrl}
                  >
                    {overview.villaButtonText}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {hasCaribbeanLivingSection && (
          <section
            className="section overview-living-section"
            aria-labelledby={
              overview.caribbeanLivingHeading
                ? "overview-living-title"
                : undefined
            }
          >
            <div className="wrap">
              {overview.caribbeanLivingSubHeading && (
                <p
                  className="eyebrow overview-living-eyebrow"
                  data-aos="fade-up"
                >
                  {overview.caribbeanLivingSubHeading}
                </p>
              )}

              {overview.caribbeanLivingHeading && (
                <h2 id="overview-living-title" data-aos="fade-up">
                  {overview.caribbeanLivingHeading}
                </h2>
              )}

              {overview.caribbeanLivingFacilities.length > 0 && (
                <div className="overview-living-grid">
                  {overview.caribbeanLivingFacilities.map((item, index) => (
                    <article
                      className="overview-living-item"
                      key={`${item.title}-${index}`}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 100)}
                    >
                      {item.title && <h3>{item.title}</h3>}
                      {item.content && <p>{item.content}</p>}
                    </article>
                  ))}
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
