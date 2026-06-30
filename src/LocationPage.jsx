import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  SiteFooter,
  SiteHeader,
} from "./App";

function getFirstContentfulAssetSrc(assets) {
  if (Array.isArray(assets)) {
    return getContentfulAssetSrc(assets[0]);
  }

  return getContentfulAssetSrc(assets);
}

function getLocationContent(entry) {
  const fields = entry?.fields || {};
  const locationHighlights = Array.isArray(fields.locationHighlights)
    ? fields.locationHighlights
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            iconSrc: getFirstContentfulAssetSrc(itemFields.images),
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.iconSrc || item.title || item.content)
    : [];

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    locationSubHeading: fields.locationSubHeading || "",
    locationHeading: fields.locationHeading || "",
    locationContent: richTextToPlainText(fields.locationContent),
    locationButtonText: fields.locationButtonText || "",
    locationButtonUrl: fields.locationButtonUrl || "",
    locationImage: getContentfulAssetSrc(fields.locationImage),
    locationHighlightsHeading: fields.locationHighlightsHeading || "",
    locationHighlights,
  };
}

export default function LocationPage({
  footerEntry = null,
  headerEntry = null,
  locationEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const location = getLocationContent(locationEntry);
  const hasButton = Boolean(location.buttonText && location.buttonUrl);
  const hasLocationButton = Boolean(
    location.locationButtonText && location.locationButtonUrl,
  );
  const hasLocationSection = Boolean(
    location.locationSubHeading ||
      location.locationHeading ||
      location.locationContent ||
      hasLocationButton ||
      location.locationImage,
  );
  const hasHighlightsSection = Boolean(
    location.locationHighlightsHeading || location.locationHighlights.length,
  );

  return (
    <main>
      <section
        className="location-hero"
        style={
          location.bannerImage
            ? { "--location-banner-image": `url(${location.bannerImage})` }
            : undefined
        }
        aria-labelledby={location.bannerHeading ? "location-title" : undefined}
      >
        <SiteHeader header={header} />

        <div className="location-hero-content">
          {location.bannerSubHeading && (
            <p className="location-hero-eyebrow">
              {location.bannerSubHeading}
            </p>
          )}
          {location.bannerHeading && (
            <h1 id="location-title">{location.bannerHeading}</h1>
          )}
          {location.bannerContent && <p>{location.bannerContent}</p>}
          {hasButton && (
            <a
              className="button button--light location-hero-button"
              href={location.buttonUrl}
            >
              {location.buttonText}
            </a>
          )}
        </div>
      </section>

      {hasLocationSection && (
        <section className="location-map-section">
          <div className="location-map-content">
            {location.locationSubHeading && (
              <p className="location-map-eyebrow">
                {location.locationSubHeading}
              </p>
            )}
            {location.locationHeading && <h2>{location.locationHeading}</h2>}
            {location.locationContent && <p>{location.locationContent}</p>}
            {hasLocationButton && (
              <a
                className="button button--brown location-map-button"
                href={location.locationButtonUrl}
              >
                {location.locationButtonText}
              </a>
            )}
          </div>

          {location.locationImage && (
            <figure className="location-map-image">
              <img src={location.locationImage} alt="" />
            </figure>
          )}
        </section>
      )}

      {hasHighlightsSection && (
        <section className="location-highlights-section">
          {location.locationHighlightsHeading && (
            <h2>{location.locationHighlightsHeading}</h2>
          )}

          {location.locationHighlights.length > 0 && (
            <div className="location-highlights-grid">
              {location.locationHighlights.map((item, index) => (
                <article className="location-highlight-card" key={index}>
                  {item.iconSrc && <img src={item.iconSrc} alt="" />}
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
