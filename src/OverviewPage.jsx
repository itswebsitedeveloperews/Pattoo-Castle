import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  SiteFooter,
  SiteHeader,
} from "./App";

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
            imageSrc: getContentfulAssetSrc(imageAsset),
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
            buttonText: itemFields.buttonText || "",
            buttonUrl: itemFields.buttonUrl || "",
          };
        })
        .filter(
          (item) =>
            item.imageSrc ||
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
    villaImage: getContentfulAssetSrc(fields.villaImage),
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
    overview.villaImage ||
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
    <main>
      <section
        className="page-hero overview-hero"
        style={
          overview.bannerImage
            ? { "--overview-banner-image": `url(${overview.bannerImage})` }
            : undefined
        }
        aria-labelledby={overview.bannerHeading ? "overview-title" : undefined}
      >
        <SiteHeader header={header} />

        <div className="page-hero-content overview-hero-content">
          {overview.bannerSubHeading && (
            <p className="page-hero-eyebrow overview-hero-eyebrow">
              {overview.bannerSubHeading}
            </p>
          )}
          {overview.bannerHeading && (
            <h1 id="overview-title">{overview.bannerHeading}</h1>
          )}
          {overview.bannerContent && <p>{overview.bannerContent}</p>}
          {hasButton && (
            <a
              className="button button--light page-hero-button overview-hero-button"
              href={overview.buttonUrl}
            >
              {overview.buttonText}
            </a>
          )}
        </div>
      </section>

      {hasIntroSection && (
        <section
          className="overview-intro-section"
          aria-labelledby={
            overview.introHeading ? "overview-intro-title" : undefined
          }
        >
          {overview.introSubHeading && (
            <p className="overview-intro-eyebrow">
              {overview.introSubHeading}
            </p>
          )}
          {overview.introHeading && (
            <h2 id="overview-intro-title">{overview.introHeading}</h2>
          )}
          {overview.introDescription && <p>{overview.introDescription}</p>}
        </section>
      )}

      {hasOverviewBlocks && (
        <section className="overview-blocks-section" aria-label="Overview links">
          <div className="overview-blocks-grid">
            {overview.overviewBlocks.map((item, index) => {
              const hasBlockButton = Boolean(item.buttonText && item.buttonUrl);

              return (
                <article className="overview-block-card" key={`${item.title}-${index}`}>
                  {item.imageSrc && <img src={item.imageSrc} alt="" />}
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
          className="overview-villa-section"
          aria-labelledby={
            overview.villaHeading ? "overview-villa-title" : undefined
          }
        >
          {overview.villaImage && (
            <div className="overview-villa-image">
              <img src={overview.villaImage} alt="" />
            </div>
          )}

          <div className="overview-villa-content">
            {overview.villaSubHeading && (
              <p className="overview-villa-eyebrow">
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
        </section>
      )}

      {hasCaribbeanLivingSection && (
        <section
          className="overview-living-section"
          aria-labelledby={
            overview.caribbeanLivingHeading
              ? "overview-living-title"
              : undefined
          }
        >
          {overview.caribbeanLivingSubHeading && (
            <p className="overview-living-eyebrow">
              {overview.caribbeanLivingSubHeading}
            </p>
          )}

          {overview.caribbeanLivingHeading && (
            <h2 id="overview-living-title">
              {overview.caribbeanLivingHeading}
            </h2>
          )}

          {overview.caribbeanLivingFacilities.length > 0 && (
            <div className="overview-living-grid">
              {overview.caribbeanLivingFacilities.map((item, index) => (
                <article
                  className="overview-living-item"
                  key={`${item.title}-${index}`}
                >
                  {item.title && <h3>{item.title}</h3>}
                  {item.content && <p>{item.content}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <SiteFooter footer={footer} />
    </main>
  );
}
