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

function renderTextNode(node, key) {
  return (node.marks || []).reduce((value, mark, markIndex) => {
    const markKey = `${key}-${mark.type}-${markIndex}`;

    if (mark.type === "bold") {
      return <strong key={markKey}>{value}</strong>;
    }

    if (mark.type === "italic") {
      return <em key={markKey}>{value}</em>;
    }

    if (mark.type === "underline") {
      return <u key={markKey}>{value}</u>;
    }

    return value;
  }, node.value || "");
}

function renderRichTextNode(node, key) {
  if (!node) {
    return null;
  }

  if (node.nodeType === "text") {
    return renderTextNode(node, key);
  }

  const children = (node.content || []).map((child, childIndex) =>
    renderRichTextNode(child, `${key}-${childIndex}`),
  );

  switch (node.nodeType) {
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading-1":
      return <h1 key={key}>{children}</h1>;
    case "heading-2":
      return <h2 key={key}>{children}</h2>;
    case "heading-3":
      return <h3 key={key}>{children}</h3>;
    case "heading-4":
      return <h4 key={key}>{children}</h4>;
    case "heading-5":
      return <h5 key={key}>{children}</h5>;
    case "heading-6":
      return <h6 key={key}>{children}</h6>;
    case "unordered-list":
      return <ul key={key}>{children}</ul>;
    case "ordered-list":
      return <ol key={key}>{children}</ol>;
    case "list-item":
      return <li key={key}>{children}</li>;
    case "hyperlink":
      return (
        <a href={node.data?.uri || "#"} key={key}>
          {children}
        </a>
      );
    default:
      return children.map((child, index) => (
        <span key={`${key}-fragment-${index}`}>{child}</span>
      ));
  }
}

function renderRichText(value, keyPrefix = "location-rich-text") {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item, index) => <p key={`${keyPrefix}-${index}`}>{item}</p>);
  }

  return (value.content || []).map((node, index) =>
    renderRichTextNode(node, `${keyPrefix}-${index}`),
  );
}

function getImageBoxItems(items) {
  return Array.isArray(items)
    ? items
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
}

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
  const exploreNearbyBox = getImageBoxItems(fields.exploreNearbyBox);
  const theCoastCards = getImageBoxItems(fields.theCoastCards);
  const exploreCards = getImageBoxItems(fields.exploreCards);
  const adventureExploreCards = getImageBoxItems(fields.adventureExploreCards);
  const jamaicaRightCards = getImageBoxItems(fields.jamaicaRightCards);

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    exploreSubHeading: fields.exploreSubHeading || "",
    exploreHeading: fields.exploreHeading || "",
    exploreCards,
    adventureImage: getContentfulImage(fields.adventureImage),
    adventureSubHeading: fields.adventureSubHeading || "",
    adventureHeading: fields.adventureHeading || "",
    adventureContent: richTextToPlainText(fields.adventureContent),
    adventureExploreSubHeading: fields.adventureExploreSubHeading || "",
    adventureExploreHeading: fields.adventureExploreHeading || "",
    adventureExploreCards,
    jamaicaLeftSubHeading: fields.jamaicaLeftSubHeading || "",
    jamaicaLeftHeading: fields.jamaicaLeftHeading || "",
    jamaicaLeftImage: getContentfulImage(fields.jamaicaLeftImage),
    jamaicaLeftContent: fields.jamaicaLeftContent || null,
    jamaicaRightSubHeading: fields.jamaicaRightSubHeading || "",
    jamaicaRightHeading: fields.jamaicaRightHeading || "",
    jamaicaRightCards,
    locationSubHeading: fields.locationSubHeading || "",
    locationHeading: fields.locationHeading || "",
    locationContent: richTextToPlainText(fields.locationContent),
    locationButtonText: fields.locationButtonText || "",
    locationButtonUrl: fields.locationButtonUrl || "",
    locationImage: getContentfulImage(fields.locationImage),
    negrilHistoryImage: getContentfulImage(fields.negrilHistoryImage),
    negrilHistoryHeading: fields.negrilHistoryHeading || "",
    negrilHistoryContent: fields.negrilHistoryContent || null,
    locationHighlightsHeading: fields.locationHighlightsHeading || "",
    locationHighlights,
    theCoastSubHeading: fields.theCoastSubHeading || "",
    theCoastHeading: fields.theCoastHeading || "",
    theCoastCards,
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
  const hasExploreSection = Boolean(
    location.exploreSubHeading ||
    location.exploreHeading ||
    location.exploreCards.length,
  );
  const hasAdventureSection = Boolean(
    location.adventureImage?.src ||
    location.adventureSubHeading ||
    location.adventureHeading ||
    location.adventureContent,
  );
  const hasAdventureExploreSection = Boolean(
    location.adventureExploreSubHeading ||
    location.adventureExploreHeading ||
    location.adventureExploreCards.length,
  );
  const hasJamaicaSection = Boolean(
    location.jamaicaLeftSubHeading ||
    location.jamaicaLeftHeading ||
    location.jamaicaLeftImage?.src ||
    richTextToPlainText(location.jamaicaLeftContent) ||
    location.jamaicaRightSubHeading ||
    location.jamaicaRightHeading ||
    location.jamaicaRightCards.length,
  );
  const hasHighlightsSection = Boolean(
    location.locationHighlightsHeading || location.locationHighlights.length,
  );
  const hasNegrilHistorySection = Boolean(
    location.negrilHistoryImage?.src ||
    location.negrilHistoryHeading ||
    richTextToPlainText(location.negrilHistoryContent),
  );
  const hasTheCoastSection = Boolean(
    location.theCoastSubHeading ||
    location.theCoastHeading ||
    location.theCoastCards.length,
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
          className="section page-hero location-hero"
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

        {hasExploreSection && (
          <section className="section location-explore-section">
            <div className="wrap">
              {(location.exploreSubHeading || location.exploreHeading) && (
                <div
                  className="location-explore-header"
                  data-aos="fade-up"
                  data-aos-delay="80"
                >
                  {location.exploreSubHeading && (
                    <p className="eyebrow location-explore-eyebrow">
                      {location.exploreSubHeading}
                    </p>
                  )}
                  {location.exploreHeading && (
                    <h2>{location.exploreHeading}</h2>
                  )}
                </div>
              )}

              {location.exploreCards.length > 0 && (
                <div className="location-explore-grid">
                  {location.exploreCards.map((item, index) => (
                    <article
                      className="location-explore-card"
                      key={index}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 80)}
                    >
                      {item.image?.src && (
                        <img
                          src={item.image.src}
                          alt={
                            item.image.alt ||
                            item.title ||
                            `Negril activity ${index + 1}`
                          }
                        />
                      )}
                      {item.title && <h3>{item.title}</h3>}
                      {item.content && <p>{item.content}</p>}
                      {item.buttonText && item.buttonUrl && (
                        <a href={item.buttonUrl}>{item.buttonText}</a>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {hasAdventureSection && (
          <section
            className="location-adventure-section"
            style={
              location.adventureImage?.src
                ? {
                    "--location-adventure-image": `url(${location.adventureImage.src})`,
                  }
                : undefined
            }
            aria-labelledby={
              location.adventureHeading ? "location-adventure-title" : undefined
            }
          >
            <div
              className="location-adventure-content"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {location.adventureSubHeading && (
                <p className="eyebrow location-adventure-eyebrow">
                  {location.adventureSubHeading}
                </p>
              )}
              {location.adventureHeading && (
                <h2 id="location-adventure-title">
                  {location.adventureHeading}
                </h2>
              )}
              {location.adventureContent && <p>{location.adventureContent}</p>}
            </div>
          </section>
        )}

        {hasAdventureExploreSection && (
          <section className="section location-adventure-explore-section">
            <div className="wrap">
              {(location.adventureExploreSubHeading ||
                location.adventureExploreHeading) && (
                <div
                  className="location-adventure-explore-header"
                  data-aos="fade-up"
                  data-aos-delay="80"
                >
                  {location.adventureExploreSubHeading && (
                    <p className="eyebrow location-adventure-explore-eyebrow">
                      {location.adventureExploreSubHeading}
                    </p>
                  )}
                  {location.adventureExploreHeading && (
                    <h2>{location.adventureExploreHeading}</h2>
                  )}
                </div>
              )}

              {location.adventureExploreCards.length > 0 && (
                <div className="location-adventure-explore-grid">
                  {location.adventureExploreCards.map((item, index) => (
                    <article
                      className="location-adventure-explore-card"
                      key={index}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 80)}
                    >
                      {item.image?.src && (
                        <img
                          src={item.image.src}
                          alt={
                            item.image.alt ||
                            item.title ||
                            `Negril adventure ${index + 1}`
                          }
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

        {hasJamaicaSection && (
          <section className="section location-jamaica-section">
            <div className="wrap location-jamaica-grid">
              <div
                className="location-jamaica-left"
                data-aos="fade-up"
                data-aos-delay="80"
              >
                {location.jamaicaLeftSubHeading && (
                  <p className="eyebrow location-jamaica-eyebrow">
                    {location.jamaicaLeftSubHeading}
                  </p>
                )}
                {location.jamaicaLeftHeading && (
                  <h2>{location.jamaicaLeftHeading}</h2>
                )}

                <div className="location-jamaica-left-body">
                  {location.jamaicaLeftImage?.src && (
                    <figure className="location-jamaica-image">
                      <img
                        src={location.jamaicaLeftImage.src}
                        alt={
                          location.jamaicaLeftImage.alt ||
                          location.jamaicaLeftHeading ||
                          "Jamaica natural beauty"
                        }
                      />
                    </figure>
                  )}
                  {location.jamaicaLeftContent && (
                    <div className="location-jamaica-rich-text">
                      {renderRichText(
                        location.jamaicaLeftContent,
                        "location-jamaica-left-content",
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div
                className="location-jamaica-right"
                data-aos="fade-up"
                data-aos-delay="160"
              >
                {location.jamaicaRightSubHeading && (
                  <p className="eyebrow location-jamaica-eyebrow">
                    {location.jamaicaRightSubHeading}
                  </p>
                )}
                {location.jamaicaRightHeading && (
                  <h2>{location.jamaicaRightHeading}</h2>
                )}

                {location.jamaicaRightCards.length > 0 && (
                  <div className="location-jamaica-card-grid">
                    {location.jamaicaRightCards.map((item, index) => (
                      <article
                        className="location-jamaica-card"
                        key={index}
                      >
                        {item.image?.src && (
                          <img
                            src={item.image.src}
                            alt={
                              item.image.alt ||
                              item.title ||
                              `Jamaica excursion ${index + 1}`
                            }
                          />
                        )}
                        {item.title && <h3>{item.title}</h3>}
                        {item.content && <p>{item.content}</p>}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

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

        {hasNegrilHistorySection && (
          <section className="section location-history-section">
            <div className="wrap location-history-grid">
              {location.negrilHistoryImage?.src && (
                <figure
                  className="location-history-image"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <img
                    src={location.negrilHistoryImage.src}
                    alt={
                      location.negrilHistoryImage.alt ||
                      "Negril history near Pattoo Castle"
                    }
                  />
                </figure>
              )}

              <div
                className="location-history-content"
                data-aos="fade-up"
                data-aos-delay="180"
              >
                {location.negrilHistoryHeading && (
                  <h2>{location.negrilHistoryHeading}</h2>
                )}
                {location.negrilHistoryContent && (
                  <div className="location-history-rich-text">
                    {renderRichText(
                      location.negrilHistoryContent,
                      "location-history-content",
                    )}
                  </div>
                )}
              </div>
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

        {hasTheCoastSection && (
          <section className="section location-coast-section">
            <div className="wrap">
              {(location.theCoastSubHeading || location.theCoastHeading) && (
                <div
                  className="location-coast-header"
                  data-aos="fade-up"
                  data-aos-delay="80"
                >
                  {location.theCoastSubHeading && (
                    <p className="eyebrow location-coast-eyebrow">
                      {location.theCoastSubHeading}
                    </p>
                  )}
                  {location.theCoastHeading && (
                    <h2>{location.theCoastHeading}</h2>
                  )}
                </div>
              )}

              {location.theCoastCards.length > 0 && (
                <div className="location-coast-grid">
                  {location.theCoastCards.map((item, index) => (
                    <article
                      className="location-coast-card"
                      key={index}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 100)}
                    >
                      {item.image?.src && (
                        <img
                          src={item.image.src}
                          alt={item.image.alt || item.title || "Negril coast"}
                        />
                      )}
                      {item.title && <h3>{item.title}</h3>}
                      {item.content && <p>{item.content}</p>}
                      {item.buttonText && item.buttonUrl && (
                        <a href={item.buttonUrl}>{item.buttonText}</a>
                      )}
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
