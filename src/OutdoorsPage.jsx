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
import styles from "./OutdoorsPage.module.css";

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

function getOutdoorsIcon(item) {
  const fields = item?.fields || {};

  return {
    icon: getContentfulImage(fields.galleryImage),
    title: fields.galleryImageType || "",
  };
}

function getOutdoorsContent(entry) {
  const fields = entry?.fields || {};
  const outdoorsIcons = Array.isArray(fields.outdoorsIconBox)
    ? fields.outdoorsIconBox
        .map(getOutdoorsIcon)
        .filter((item) => item.icon?.src || item.title)
    : [];
  const outdoorsListItems = getRichTextListItems(fields.outdoorsContent);
  const balconiesImages = Array.isArray(fields.balconiesImages)
    ? fields.balconiesImages
        .map((asset) => getContentfulImage(asset))
        .filter((image) => image?.src)
    : [];
  const exploreSpacesImages = Array.isArray(fields.exploreSpacesImages)
    ? fields.exploreSpacesImages
        .map((asset) => getContentfulImage(asset))
        .filter((image) => image?.src)
    : [];

  return {
    title: fields.title || "",
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || fields.title || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    outdoorsImage: getContentfulImage(fields.outdoorsImage),
    outdoorsSubHeading: fields.outdoorsSubHeading || "",
    outdoorsHeading: fields.outdoorsHeading || "",
    outdoorsContent: outdoorsListItems.length
      ? ""
      : richTextToPlainText(fields.outdoorsContent),
    outdoorsListItems,
    outdoorsIcons,
    balconiesSubHeading: fields.balconiesSubHeading || "",
    balconiesHeading: fields.balconiesHeading || "",
    balconiesContent: richTextToPlainText(fields.balconiesContent),
    balconiesImages,
    exploreSpacesSubHeading: fields.exploreSpacesSubHeading || "",
    exploreSpacesHeading: fields.exploreSpacesHeading || "",
    exploreSpacesContent: richTextToPlainText(fields.exploreSpacesContent),
    exploreSpacesImages,
  };
}

export default function OutdoorsPage({
  footerEntry = null,
  headerEntry = null,
  outdoorsEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const outdoors = getOutdoorsContent(outdoorsEntry);
  const hasButton = Boolean(outdoors.buttonText && outdoors.buttonUrl);
  const hasOutdoorsSection = Boolean(
    outdoors.outdoorsImage?.src ||
      outdoors.outdoorsSubHeading ||
      outdoors.outdoorsHeading ||
      outdoors.outdoorsContent ||
      outdoors.outdoorsListItems.length ||
      outdoors.outdoorsIcons.length,
  );
  const hasBalconiesSection = Boolean(
    outdoors.balconiesSubHeading ||
      outdoors.balconiesHeading ||
      outdoors.balconiesContent ||
      outdoors.balconiesImages.length,
  );
  const hasExploreSpacesSection = Boolean(
    outdoors.exploreSpacesSubHeading ||
      outdoors.exploreSpacesHeading ||
      outdoors.exploreSpacesContent ||
      outdoors.exploreSpacesImages.length,
  );

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="page-hero accommodation-hero outdoors-hero"
          style={
            outdoors.bannerImage
              ? {
                  "--accommodation-banner-image": `url(${outdoors.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={outdoors.bannerHeading ? "outdoors-title" : undefined}
        >
          <div className="page-hero-content accommodation-hero-content">
            {outdoors.bannerSubHeading && (
              <p
                className="eyebrow page-hero-eyebrow accommodation-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {outdoors.bannerSubHeading}
              </p>
            )}
            {outdoors.bannerHeading && (
              <h1 id="outdoors-title" data-aos="fade-up" data-aos-delay="60">
                {outdoors.bannerHeading}
              </h1>
            )}
            {outdoors.bannerContent && (
              <p data-aos="fade-up" data-aos-delay="100">
                {outdoors.bannerContent}
              </p>
            )}
            {hasButton && (
              <a
                className="button button--light page-hero-button accommodation-hero-button"
                href={outdoors.buttonUrl}
                data-aos="fade-up"
                data-aos-delay="150"
              >
                {outdoors.buttonText}
              </a>
            )}
          </div>
        </section>

        {hasOutdoorsSection && (
          <section
            className={styles.outdoorsSection}
            aria-labelledby={
              outdoors.outdoorsHeading ? "outdoors-section-title" : undefined
            }
          >
            <div className={styles.outdoorsInner}>
              {outdoors.outdoorsImage?.src && (
                <img
                  className={styles.outdoorsImage}
                  src={outdoors.outdoorsImage.src}
                  alt={outdoors.outdoorsImage.alt || "Pattoo Castle outdoor pool"}
                />
              )}

              <div className={styles.outdoorsContent}>
                {outdoors.outdoorsSubHeading && (
                  <p className={styles.outdoorsEyebrow}>
                    {outdoors.outdoorsSubHeading}
                  </p>
                )}
                {outdoors.outdoorsHeading && (
                  <h2 id="outdoors-section-title">{outdoors.outdoorsHeading}</h2>
                )}
                {outdoors.outdoorsListItems.length > 0 ? (
                  <ul className={styles.outdoorsList}>
                    {outdoors.outdoorsListItems.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  outdoors.outdoorsContent && <p>{outdoors.outdoorsContent}</p>
                )}

                {outdoors.outdoorsIcons.length > 0 && (
                  <div className={styles.outdoorsIconGrid}>
                    {outdoors.outdoorsIcons.map((item, index) => (
                      <article
                        className={styles.outdoorsIconItem}
                        data-aos="fade-up"
                        data-aos-delay={String(index * 65)}
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
            </div>
          </section>
        )}

        {hasBalconiesSection && (
          <section
            className={styles.balconiesSection}
            aria-labelledby={
              outdoors.balconiesHeading ? "balconies-title" : undefined
            }
          >
            <div className={styles.balconiesInner}>
              <div className={styles.balconiesContent}>
                {outdoors.balconiesSubHeading && (
                  <p className={styles.balconiesEyebrow}>
                    {outdoors.balconiesSubHeading}
                  </p>
                )}
                {outdoors.balconiesHeading && (
                  <h2 id="balconies-title">{outdoors.balconiesHeading}</h2>
                )}
                {outdoors.balconiesContent && (
                  <p>{outdoors.balconiesContent}</p>
                )}
              </div>

              {outdoors.balconiesImages.length > 0 && (
                <div className={styles.balconiesImageGrid}>
                  {outdoors.balconiesImages.slice(0, 3).map((image, index) => (
                    <img
                      className={
                        index === 0
                          ? styles.balconiesImageLarge
                          : styles.balconiesImageSmall
                      }
                      data-aos="fade-up"
                      data-aos-delay={String(index * 80)}
                      src={image.src}
                      alt={
                        image.alt ||
                        `Pattoo Castle patio or balcony ${index + 1}`
                      }
                      key={`${image.src}-${index}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {hasExploreSpacesSection && (
          <section
            className={styles.exploreSpacesSection}
            aria-labelledby={
              outdoors.exploreSpacesHeading
                ? "explore-spaces-title"
                : undefined
            }
          >
            <div className={styles.exploreSpacesInner}>
              <div className={styles.exploreSpacesHeader}>
                {outdoors.exploreSpacesSubHeading && (
                  <p className={styles.exploreSpacesEyebrow}>
                    {outdoors.exploreSpacesSubHeading}
                  </p>
                )}
                {outdoors.exploreSpacesHeading && (
                  <h2 id="explore-spaces-title">
                    {outdoors.exploreSpacesHeading}
                  </h2>
                )}
                {outdoors.exploreSpacesContent && (
                  <p>{outdoors.exploreSpacesContent}</p>
                )}
              </div>

              {outdoors.exploreSpacesImages.length > 0 && (
                <div className={styles.exploreSpacesGrid}>
                  {outdoors.exploreSpacesImages.slice(0, 5).map((image, index) => (
                    <img
                      data-aos="fade-up"
                      data-aos-delay={String(index * 70)}
                      src={image.src}
                      alt={
                        image.alt ||
                        `Pattoo Castle outdoor space ${index + 1}`
                      }
                      key={`${image.src}-${index}`}
                    />
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
