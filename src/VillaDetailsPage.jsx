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
import styles from "./VillaDetailsPage.module.css";

function getRichTextListItems(value) {
  if (!value || typeof value === "string") {
    return [];
  }

  const items = [];

  function walk(node) {
    if (!node || typeof node !== "object") {
      return;
    }

    if (node.nodeType === "list-item") {
      const text = richTextToPlainText(node).trim();

      if (text) {
        items.push(text);
      }

      return;
    }

    (node.content || []).forEach(walk);
  }

  walk(value);
  return items;
}

function getBedroomBlock(item) {
  const fields = item?.fields || {};
  const image = getFirstContentfulImage(fields.images);
  const contentItems = getRichTextListItems(fields.content);
  const plainContent = richTextToPlainText(fields.content);

  return {
    image,
    title: fields.title || "",
    contentItems,
    content: contentItems.length ? "" : plainContent,
  };
}

function getAmenityIcon(item) {
  const fields = item?.fields || {};

  return {
    icon: getContentfulImage(fields.galleryImage),
    title: fields.galleryImageType || "",
  };
}

function getVillaDetailsContent(entry) {
  const fields = entry?.fields || {};
  const bedroomBlocks = Array.isArray(fields.bedroomBlocks)
    ? fields.bedroomBlocks.map(getBedroomBlock).filter(
        (item) =>
          item.image?.src ||
          item.title ||
          item.content ||
          item.contentItems.length,
      )
    : [];
  const thoughtfulAmenitiesIcons = Array.isArray(fields.thoughtfulAmenitiesIconBox)
    ? fields.thoughtfulAmenitiesIconBox
        .map(getAmenityIcon)
        .filter((item) => item.icon?.src || item.title)
    : [];

  return {
    title: fields.title || "",
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || fields.title || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    bedroomSubHeading: fields.bedroomSubHeading || "",
    bedroomHeading: fields.bedroomHeading || "",
    bedroomContent: richTextToPlainText(fields.bedroomContent),
    bedroomBlocks,
    thoughtfulAmenitiesImage: getContentfulAssetSrc(
      fields.thoughtfulAmenitiesImage,
    ),
    thoughtfulAmenitiesSubHeading: fields.thoughtfulAmenitiesSubHeading || "",
    thoughtfulAmenitiesHeading: fields.thoughtfulAmenitiesHeading || "",
    thoughtfulAmenitiesIcons,
    experienceImage: getContentfulImage(fields.experienceImage),
    experienceSubHeading: fields.experienceSubHeading || "",
    experienceHeading: fields.experienceHeading || "",
    experienceContent: richTextToPlainText(fields.experienceContent),
    experienceButtonText: fields.experienceButtonText || "",
    experienceButtonUrl: fields.experienceButtonUrl || "",
  };
}

export default function VillaDetailsPage({
  footerEntry = null,
  headerEntry = null,
  villaDetailsEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const villaDetails = getVillaDetailsContent(villaDetailsEntry);
  const hasButton = Boolean(villaDetails.buttonText && villaDetails.buttonUrl);
  const hasBedroomSection = Boolean(
    villaDetails.bedroomSubHeading ||
      villaDetails.bedroomHeading ||
      villaDetails.bedroomContent ||
      villaDetails.bedroomBlocks.length,
  );
  const hasThoughtfulAmenitiesSection = Boolean(
    villaDetails.thoughtfulAmenitiesImage ||
      villaDetails.thoughtfulAmenitiesSubHeading ||
      villaDetails.thoughtfulAmenitiesHeading ||
      villaDetails.thoughtfulAmenitiesIcons.length,
  );
  const hasExperienceSection = Boolean(
    villaDetails.experienceImage?.src ||
      villaDetails.experienceSubHeading ||
      villaDetails.experienceHeading ||
      villaDetails.experienceContent ||
      (villaDetails.experienceButtonText && villaDetails.experienceButtonUrl),
  );

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="page-hero accommodation-hero villa-details-hero"
          style={
            villaDetails.bannerImage
              ? {
                  "--accommodation-banner-image": `url(${villaDetails.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={
            villaDetails.bannerHeading ? "villa-details-title" : undefined
          }
        >
          <div className="page-hero-content accommodation-hero-content">
            {villaDetails.bannerSubHeading && (
              <p
                className="eyebrow page-hero-eyebrow accommodation-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {villaDetails.bannerSubHeading}
              </p>
            )}
            {villaDetails.bannerHeading && (
              <h1
                id="villa-details-title"
                data-aos="fade-up"
                data-aos-delay="60"
              >
                {villaDetails.bannerHeading}
              </h1>
            )}
            {villaDetails.bannerContent && (
              <p data-aos="fade-up" data-aos-delay="100">
                {villaDetails.bannerContent}
              </p>
            )}
            {hasButton && (
              <a
                className="button button--light page-hero-button accommodation-hero-button"
                href={villaDetails.buttonUrl}
                data-aos="fade-up"
                data-aos-delay="150"
              >
                {villaDetails.buttonText}
              </a>
            )}
          </div>
        </section>

        {hasBedroomSection && (
          <section
            className={styles.bedroomSection}
            aria-labelledby={
              villaDetails.bedroomHeading ? "villa-details-bedrooms-title" : undefined
            }
          >
            <div className={styles.bedroomInner}>
              <div className={styles.bedroomHeader}>
                {villaDetails.bedroomSubHeading && (
                  <p className={styles.bedroomEyebrow}>
                    {villaDetails.bedroomSubHeading}
                  </p>
                )}
                {villaDetails.bedroomHeading && (
                  <h2 id="villa-details-bedrooms-title">
                    {villaDetails.bedroomHeading}
                  </h2>
                )}
                {villaDetails.bedroomContent && (
                  <p className={styles.bedroomIntro}>
                    {villaDetails.bedroomContent}
                  </p>
                )}
              </div>

              {villaDetails.bedroomBlocks.length > 0 && (
                <div className={styles.bedroomGrid}>
                  {villaDetails.bedroomBlocks.map((item, index) => (
                    <article
                      className={styles.bedroomCard}
                      data-aos="fade-up"
                      data-aos-delay={String((index % 3) * 80)}
                      key={`${item.title}-${index}`}
                    >
                      {item.image?.src && (
                        <img
                          src={item.image.src}
                          alt={
                            item.image.alt ||
                            (item.title
                              ? `${item.title} bedroom`
                              : `Pattoo Castle bedroom ${index + 1}`)
                          }
                        />
                      )}
                      {item.title && <h3>{item.title}</h3>}
                      {item.contentItems.length > 0 ? (
                        <ul>
                          {item.contentItems.map((contentItem, itemIndex) => (
                            <li key={`${contentItem}-${itemIndex}`}>
                              {contentItem}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        item.content && <p>{item.content}</p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {hasThoughtfulAmenitiesSection && (
          <section
            className={styles.thoughtfulAmenitiesSection}
            style={
              villaDetails.thoughtfulAmenitiesImage
                ? {
                    "--thoughtful-amenities-image": `url(${villaDetails.thoughtfulAmenitiesImage})`,
                  }
                : undefined
            }
            aria-labelledby={
              villaDetails.thoughtfulAmenitiesHeading
                ? "villa-details-thoughtful-amenities-title"
                : undefined
            }
          >
            <div className={styles.thoughtfulAmenitiesInner}>
              <div className={styles.thoughtfulAmenitiesHeader}>
                {villaDetails.thoughtfulAmenitiesSubHeading && (
                  <p className={styles.thoughtfulAmenitiesEyebrow}>
                    {villaDetails.thoughtfulAmenitiesSubHeading}
                  </p>
                )}
                {villaDetails.thoughtfulAmenitiesHeading && (
                  <h2 id="villa-details-thoughtful-amenities-title">
                    {villaDetails.thoughtfulAmenitiesHeading}
                  </h2>
                )}
              </div>

              {villaDetails.thoughtfulAmenitiesIcons.length > 0 && (
                <div className={styles.thoughtfulAmenitiesGrid}>
                  {villaDetails.thoughtfulAmenitiesIcons.map((item, index) => (
                    <article
                      className={styles.thoughtfulAmenitiesItem}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 45)}
                      key={`${item.title}-${index}`}
                    >
                      {item.icon?.src && (
                        <img
                          src={item.icon.src}
                          alt={
                            item.icon.alt ||
                            (item.title ? `${item.title} icon` : "")
                          }
                        />
                      )}
                      {item.title && <h3>{item.title}</h3>}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {hasExperienceSection && (
          <section
            className={styles.experienceSection}
            aria-labelledby={
              villaDetails.experienceHeading
                ? "villa-details-experience-title"
                : undefined
            }
          >
            <div className={styles.experienceInner}>
              {villaDetails.experienceImage?.src && (
                <img
                  className={styles.experienceImage}
                  src={villaDetails.experienceImage.src}
                  alt={
                    villaDetails.experienceImage.alt ||
                    "Pattoo Castle private escape"
                  }
                />
              )}

              <div className={styles.experienceContent}>
                {villaDetails.experienceSubHeading && (
                  <p className={styles.experienceEyebrow}>
                    {villaDetails.experienceSubHeading}
                  </p>
                )}
                {villaDetails.experienceHeading && (
                  <h2 id="villa-details-experience-title">
                    {villaDetails.experienceHeading}
                  </h2>
                )}
                {villaDetails.experienceContent && (
                  <p>{villaDetails.experienceContent}</p>
                )}
                {villaDetails.experienceButtonText &&
                  villaDetails.experienceButtonUrl && (
                    <a
                      className={styles.experienceButton}
                      href={villaDetails.experienceButtonUrl}
                    >
                      {villaDetails.experienceButtonText}
                    </a>
                  )}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
