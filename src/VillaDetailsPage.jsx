import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFooterContent,
  getHeaderContent,
} from "./App";
import AosInitializer from "./AosInitializer";
import BedroomImageSlider from "./BedroomImageSlider";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./VillaDetailsPage.module.css";

function renderRichTextNode(node, key) {
  if (!node) {
    return null;
  }

  if (node.nodeType === "text") {
    let value = node.value || "";

    (node.marks || []).forEach((mark, markIndex) => {
      if (mark.type === "bold") {
        value = <strong key={`${key}-bold-${markIndex}`}>{value}</strong>;
      }

      if (mark.type === "italic") {
        value = <em key={`${key}-italic-${markIndex}`}>{value}</em>;
      }

      if (mark.type === "underline") {
        value = <u key={`${key}-underline-${markIndex}`}>{value}</u>;
      }
    });

    return value;
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
      return children;
  }
}

function renderRichText(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item, index) => (
        <p key={`bedroom-text-${index}`}>{item}</p>
      ));
  }

  return (value.content || []).map((node, index) =>
    renderRichTextNode(node, `bedroom-content-${index}`),
  );
}

function getBedroomBlock(item) {
  const fields = item?.fields || {};
  const images = (Array.isArray(fields.images) ? fields.images : []).map(getContentfulImage).filter((image) => image?.src);

  return {
    images,
    title: fields.title || "",
    content: fields.content || null,
  };
}

function getVillaDetailsContent(entry) {
  const fields = entry?.fields || {};
  const bedroomBlocks = Array.isArray(fields.bedroomBlocks)
    ? fields.bedroomBlocks.map(getBedroomBlock).filter(
        (item) => item.images.length || item.title || item.content,
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
                      data-aos-delay={String((index % 2) * 80)}
                      key={`${item.title}-${index}`}
                    >
                      <BedroomImageSlider images={item.images} title={item.title || `Bedroom ${index + 1}`} />
                      {item.title && <h2>{item.title}</h2>}
                      <div className={styles.bedroomContent}>{renderRichText(item.content)}</div>
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
