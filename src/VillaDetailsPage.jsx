import {
  getContentfulAssetSrc,
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

function getVillaDetailsContent(entry) {
  const fields = entry?.fields || {};
  const bedroomBlocks = Array.isArray(fields.bedroomBlocks)
    ? fields.bedroomBlocks.map(getBedroomBlock).filter(
        (item) => item.image?.src || item.title || item.content || item.contentItems.length,
      )
    : [];

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || fields.title || "",
    bedroomBlocks,
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
  const hasBedroomSection = villaDetails.bedroomBlocks.length > 0;

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="section page-hero accommodation-hero villa-details-hero"
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
            {villaDetails.bannerHeading && (
              <h1
                id="villa-details-title"
                data-aos="fade-up"
                data-aos-delay="60"
              >
                {villaDetails.bannerHeading}
              </h1>
            )}
          </div>
        </section>

        {hasBedroomSection && (
          <section
            className={`section ${styles.bedroomSection}`}
            aria-label="Villa bedrooms"
          >
            <div className="wrap">
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
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
