import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFirstContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function getLocationContent(entry) {
  const fields = entry?.fields || {};
  const locationHighlights = Array.isArray(fields.locationHighlights)
    ? fields.locationHighlights
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            icon: getFirstContentfulImage(itemFields.images),
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.icon?.src || item.title || item.content)
    : [];
  const exploreNearbyBox = Array.isArray(fields.exploreNearbyBox)
    ? fields.exploreNearbyBox
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            image: getFirstContentfulImage(itemFields.images),
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
    locationImage: getContentfulImage(fields.locationImage),
    locationHighlightsHeading: fields.locationHighlightsHeading || "",
    locationHighlights,
    experienceImage: getFirstContentfulImage(fields.experienceImages),
    experienceSubHeading: fields.experienceSubHeading || "",
    experienceHeading: fields.experienceHeading || "",
    experienceContent: richTextToPlainText(fields.experienceContent),
    experienceButtonText: fields.experienceButtonText || "",
    experienceButtonUrl: fields.experienceButtonUrl || "",
    exploreNearbyHeading: fields.exploreNearbyHeading || "",
    exploreNearbyBox,
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
    location.locationImage?.src,
  );
  const hasHighlightsSection = Boolean(
    location.locationHighlightsHeading || location.locationHighlights.length,
  );
  const hasExperienceButton = Boolean(
    location.experienceButtonText && location.experienceButtonUrl,
  );
  const hasExperienceSection = Boolean(
    location.experienceImage?.src ||
    location.experienceSubHeading ||
    location.experienceHeading ||
    location.experienceContent ||
    hasExperienceButton,
  );
  const hasExploreNearbySection = Boolean(
    location.exploreNearbyHeading || location.exploreNearbyBox.length,
  );

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main>
        <section
          className="page-hero location-hero"
          style={
            location.bannerImage
              ? { "--location-banner-image": `url(${location.bannerImage})` }
              : undefined
          }
          aria-labelledby={
            location.bannerHeading ? "location-title" : undefined
          }
        >
          <div className="page-hero-content location-hero-content">
            {location.bannerSubHeading && (
              <p
                className="eyebrow page-hero-eyebrow location-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {location.bannerSubHeading}
              </p>
            )}
            {location.bannerHeading && (
              <h1 id="location-title" data-aos="fade-up" data-aos-delay="50">
                {location.bannerHeading}
              </h1>
            )}
            {location.bannerContent && (
              <p data-aos="fade-up" data-aos-delay="100">
                {location.bannerContent}
              </p>
            )}
            {hasButton && (
              <a
                className="button button--light page-hero-button location-hero-button"
                href={location.buttonUrl}
                data-aos="fade-up"
                data-aos-delay="150"
              >
                {location.buttonText}
              </a>
            )}
          </div>
        </section>

        {hasLocationSection && (
          <section className="section location-map-section">
            <div className="wrap">
              <div
                className="location-map-content"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {location.locationSubHeading && (
                  <p className="eyebrow location-map-eyebrow">
                    {location.locationSubHeading}
                  </p>
                )}
                {location.locationHeading && (
                  <h2>{location.locationHeading}</h2>
                )}
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

              {location.locationImage?.src && (
                <figure
                  className="location-map-image"
                  data-aos="fade-in"
                  data-aos-delay="200"
                >
                  <img
                    src={location.locationImage.src}
                    alt={location.locationImage.alt || "Pattoo Castle Negril location"}
                  />
                </figure>
              )}
            </div>
          </section>
        )}

        {hasHighlightsSection && (
          <section className="section location-highlights-section">
            <div className="wrap">
              {location.locationHighlightsHeading && (
                <h2 data-aos="fade-up">{location.locationHighlightsHeading}</h2>
              )}

              {location.locationHighlights.length > 0 && (
                <div className="location-highlights-grid">
                  {location.locationHighlights.map((item, index) => (
                    <article
                      className="location-highlight-card"
                      key={index}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 100)}
                    >
                      {item.icon?.src && (
                        <img
                          src={item.icon.src}
                          alt={item.icon.alt || (item.title ? `${item.title} icon` : "")}
                        />
                      )}
                      {item.title && <h3>{item.title}</h3>}
                      {item.content && <p>{item.content}</p>}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {hasExperienceSection && (
          <section className="location-experience-section">
            {location.experienceImage?.src && (
              <figure
                className="location-experience-image"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <img
                  src={location.experienceImage.src}
                  alt={location.experienceImage.alt || "Negril experience near Pattoo Castle"}
                />
              </figure>
            )}

            <div
              className="location-experience-content"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {location.experienceSubHeading && (
                <p className="eyebrow location-experience-eyebrow">
                  {location.experienceSubHeading}
                </p>
              )}
              {location.experienceHeading && (
                <h2>{location.experienceHeading}</h2>
              )}
              {location.experienceContent && (
                <p>{location.experienceContent}</p>
              )}
              {hasExperienceButton && (
                <a
                  className="button button--light location-experience-button"
                  href={location.experienceButtonUrl}
                >
                  {location.experienceButtonText}
                </a>
              )}
            </div>
          </section>
        )}

        {hasExploreNearbySection && (
          <section className="section location-nearby-section">
            <div className="wrap">
              {location.exploreNearbyHeading && (
                <h2 data-aos="fade-up">{location.exploreNearbyHeading}</h2>
              )}

              {location.exploreNearbyBox.length > 0 && (
                <div className="location-nearby-grid">
                  {location.exploreNearbyBox.map((item, index) => (
                    <article
                      className="location-nearby-card"
                      key={index}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 100)}
                    >
                      {item.image?.src && (
                        <img
                          src={item.image.src}
                          alt={item.image.alt || `Negril nearby experience ${index + 1}`}
                        />
                      )}
                      {item.title && <h3>{item.title}</h3>}
                      {item.content && <p>{item.content}</p>}
                      {item.buttonText && item.buttonUrl && (
                        <a className="text-link" href={item.buttonUrl}>
                          {item.buttonText}
                        </a>
                      )}
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
