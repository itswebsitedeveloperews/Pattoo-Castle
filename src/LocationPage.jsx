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
import styles from "./LocationPage.module.css";

function renderTextNode(node, key) {
  const textWithLineBreaks = (node.value || "")
    .split(/\r?\n/)
    .flatMap((line, index) =>
      index === 0 ? [line] : [<br key={`${key}-line-break-${index}`} />, line],
    );

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
  }, textWithLineBreaks);
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
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "hr":
      return <hr key={key} />;
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
  const exploreCards = getImageBoxItems(fields.exploreCards);
  const adventureExploreCards = getImageBoxItems(fields.adventureExploreCards);
  const jamaicaRightCards = getImageBoxItems(fields.jamaicaRightCards);

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || "",
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
    exploreNegrilBlocks: getImageBoxItems(fields.exploreNegrilBlocks).filter(
      (item) => item.image?.src || item.title,
    ),
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
            {location.bannerHeading && (
              <h1 id="location-title" data-aos="fade-up" data-aos-delay="50">
                {location.bannerHeading}
              </h1>
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
            className="section stay-cta-section"
            style={
              location.adventureImage?.src
                ? {
                    "--stay-cta-image": `url(${location.adventureImage.src})`,
                  }
                : undefined
            }
            aria-labelledby={
              location.adventureHeading ? "location-adventure-title" : undefined
            }
          >
            <div className="wrap stay-cta-content">
              {location.adventureSubHeading && (
                <p
                  className="eyebrow stay-cta-eyebrow"
                  data-aos="fade-up"
                  data-aos-delay="20"
                >
                  {location.adventureSubHeading}
                </p>
              )}
              {location.adventureHeading && (
                <h2
                  id="location-adventure-title"
                  data-aos="fade-up"
                  data-aos-delay="50"
                >
                  {location.adventureHeading}
                </h2>
              )}
              {location.adventureContent && (
                <div
                  className="stay-cta-text"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {location.adventureContent}
                </div>
              )}
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
                      <article className="location-jamaica-card" key={index}>
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

        {location.exploreNegrilBlocks.length > 0 && (
          <section
            className={`section ${styles.exploreNegrilSection}`}
            aria-label="Explore Negril"
          >
            <div className={`wrap ${styles.exploreNegrilGrid}`}>
              {location.exploreNegrilBlocks.map((item, index) => {
                const cardContent = (
                  <>
                    {item.image?.src && (
                      <img
                        className={styles.cardImage}
                        src={item.image.src}
                        alt={item.image.alt || item.title || "Explore Negril"}
                        loading="lazy"
                      />
                    )}
                    {item.title && (
                      <h2 className={styles.cardTitle}>{item.title}</h2>
                    )}
                  </>
                );

                return (
                  <article
                    className={styles.exploreNegrilCard}
                    key={`${item.image?.src || item.title}-${index}`}
                  >
                    {item.buttonUrl ? (
                      <a
                        className={styles.cardLink}
                        href={item.buttonUrl}
                        aria-label={item.title || item.buttonText || "Explore Negril"}
                      >
                        {cardContent}
                      </a>
                    ) : cardContent}
                  </article>
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
