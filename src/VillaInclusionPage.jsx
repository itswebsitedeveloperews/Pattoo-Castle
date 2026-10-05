import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFooterContent,
  getHeaderContent,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import VillaInclusionImageSlider from "./VillaInclusionImageSlider";
import styles from "./VillaInclusionPage.module.css";

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
        <p key={`villa-inclusion-text-${index}`}>{item}</p>
      ));
  }

  return (value.content || []).map((node, index) =>
    renderRichTextNode(node, `villa-inclusion-content-${index}`),
  );
}

function getVillaInclusionContent(entry) {
  const fields = entry?.fields || {};
  const bedroomsImages = Array.isArray(fields.bedroomsEnsuiteBathroomsImages)
    ? fields.bedroomsEnsuiteBathroomsImages
        .map((asset) => getContentfulImage(asset))
        .filter(Boolean)
    : [];
  const additionalChargeImages = Array.isArray(
    fields.additionalChargeAmenitiesImages,
  )
    ? fields.additionalChargeAmenitiesImages
        .map((asset) => getContentfulImage(asset))
        .filter(Boolean)
    : [];
  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),    bannerHeading: fields.bannerHeading || "",    bedroomsImages,
    bedroomsHeading: fields.bedroomsEnsuiteBathroomsHeading || "",
    bedroomsContent: fields.bedroomsEnsuiteBathroomsContent || null,
    additionalChargeImages,
    additionalChargeHeading: fields.additionalChargeAmenitiesHeading || "",
    additionalChargeContent: fields.additionalChargeAmenitiesContent || null,
  };
}

export default function VillaInclusionPage({
  footerEntry = null,
  headerEntry = null,
  villaInclusionEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const villaInclusion = getVillaInclusionContent(villaInclusionEntry);
  const hasBedroomsSection = Boolean(
    villaInclusion.bedroomsImages.length ||
    villaInclusion.bedroomsHeading ||
    villaInclusion.bedroomsContent,
  );
  const hasAdditionalChargeSection = Boolean(
    villaInclusion.additionalChargeImages.length ||
    villaInclusion.additionalChargeHeading ||
    villaInclusion.additionalChargeContent,
  );
  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="section page-hero accommodation-hero villa-inclusion-hero"
          style={
            villaInclusion.bannerImage
              ? {
                  "--accommodation-banner-image": `url(${villaInclusion.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={
            villaInclusion.bannerHeading ? "villa-inclusion-title" : undefined
          }
        >
          <div className="page-hero-content accommodation-hero-content">
            {villaInclusion.bannerHeading && (
              <h1
                id="villa-inclusion-title"
                data-aos="fade-up"
                data-aos-delay="60"
              >
                {villaInclusion.bannerHeading}
              </h1>
            )}
          </div>
        </section>

        {hasBedroomsSection && (
          <section
            className={`section bedrooms-section ${styles.bedroomsSection}`}
            aria-labelledby={
              villaInclusion.bedroomsHeading
                ? "villa-inclusion-bedrooms-title"
                : undefined
            }
          >
            <div className={`wrap ${styles.bedroomsInner}`}>
              <VillaInclusionImageSlider
                images={villaInclusion.bedroomsImages}
              />

              <div className={styles.bedroomsContent}>
                {villaInclusion.bedroomsHeading && (
                  <h2 id="villa-inclusion-bedrooms-title">
                    {villaInclusion.bedroomsHeading}
                  </h2>
                )}
                {villaInclusion.bedroomsContent && (
                  <div className={styles.richText}>
                    {renderRichText(villaInclusion.bedroomsContent)}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {hasAdditionalChargeSection && (
          <section
            className={`section ${styles.additionalChargeSection}`}
            aria-labelledby={
              villaInclusion.additionalChargeHeading
                ? "villa-inclusion-additional-charge-title"
                : undefined
            }
          >
            <div className={`wrap ${styles.additionalChargeInner}`}>
              <div className={styles.additionalChargeContent}>
                {villaInclusion.additionalChargeHeading && (
                  <h2 id="villa-inclusion-additional-charge-title">
                    {villaInclusion.additionalChargeHeading}
                  </h2>
                )}
                {villaInclusion.additionalChargeContent && (
                  <div className={styles.richText}>
                    {renderRichText(villaInclusion.additionalChargeContent)}
                  </div>
                )}
              </div>

              <VillaInclusionImageSlider
                images={villaInclusion.additionalChargeImages}
              />
            </div>
          </section>
        )}

      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
