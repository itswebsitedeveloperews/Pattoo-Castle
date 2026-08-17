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
      .map((item, index) => <p key={`villa-inclusion-text-${index}`}>{item}</p>);
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
  const whatsIncludedIcons = Array.isArray(fields.whatsIncludedIcons)
    ? fields.whatsIncludedIcons
        .map((item) => {
          const itemFields = item?.fields || {};
          const images = Array.isArray(itemFields.images)
            ? itemFields.images
            : [itemFields.images];
          const icon = images.map((asset) => getContentfulImage(asset)).find(Boolean);

          return {
            icon,
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.icon?.src || item.title || item.content)
    : [];

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    bedroomsImages,
    bedroomsHeading: fields.bedroomsEnsuiteBathroomsHeading || "",
    bedroomsContent: fields.bedroomsEnsuiteBathroomsContent || null,
    additionalChargeImages,
    additionalChargeHeading: fields.additionalChargeAmenitiesHeading || "",
    additionalChargeContent: fields.additionalChargeAmenitiesContent || null,
    readyForStayImage: getContentfulAssetSrc(
      fields.readyForYourStayBannerImage,
    ),
    readyForStaySubHeading: fields.readyForYourStayBannerSubHeading || "",
    readyForStayHeading: fields.readyForYourStayBannerHeading || "",
    readyForStayContent: richTextToPlainText(
      fields.readyForYourStayBannerContent,
    ),
    whatsIncludedSubHeading: fields.whatsIncludedSubHeading || "",
    whatsIncludedHeading: fields.whatsIncludedHeading || "",
    whatsIncludedIcons,
    experienceImage: getContentfulAssetSrc(fields.experiencePattooCastleImage),
    experienceSubHeading: fields.experiencePattooCastleSubHeading || "",
    experienceHeading: fields.experiencePattooCastleHeading || "",
    experienceContent: richTextToPlainText(
      fields.experiencePattooCastleContent,
    ),
    experienceButtonText: fields.experiencePattooCastleButtonText || "",
    experienceButtonUrl:
      fields.experiencePattooCastleButtonUrl ||
      fields.experiencePattooCastleButtonURL ||
      "",
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
  const hasButton = Boolean(
    villaInclusion.buttonText && villaInclusion.buttonUrl,
  );
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
  const hasReadyForStaySection = Boolean(
    villaInclusion.readyForStayImage ||
      villaInclusion.readyForStaySubHeading ||
      villaInclusion.readyForStayHeading ||
      villaInclusion.readyForStayContent,
  );
  const hasWhatsIncludedSection = Boolean(
    villaInclusion.whatsIncludedSubHeading ||
      villaInclusion.whatsIncludedHeading ||
      villaInclusion.whatsIncludedIcons.length,
  );
  const hasExperienceSection = Boolean(
    villaInclusion.experienceImage ||
      villaInclusion.experienceSubHeading ||
      villaInclusion.experienceHeading ||
      villaInclusion.experienceContent ||
      (villaInclusion.experienceButtonText &&
        villaInclusion.experienceButtonUrl),
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
            {villaInclusion.bannerSubHeading && (
              <p
                className="eyebrow page-hero-eyebrow accommodation-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {villaInclusion.bannerSubHeading}
              </p>
            )}
            {villaInclusion.bannerHeading && (
              <h1
                id="villa-inclusion-title"
                data-aos="fade-up"
                data-aos-delay="60"
              >
                {villaInclusion.bannerHeading}
              </h1>
            )}
            {villaInclusion.bannerContent && (
              <p data-aos="fade-up" data-aos-delay="100">
                {villaInclusion.bannerContent}
              </p>
            )}
            {hasButton && (
              <a
                className="button button--light page-hero-button accommodation-hero-button"
                href={villaInclusion.buttonUrl}
                data-aos="fade-up"
                data-aos-delay="150"
              >
                {villaInclusion.buttonText}
              </a>
            )}
          </div>
        </section>

        {hasBedroomsSection && (
          <section
            className={styles.bedroomsSection}
            aria-labelledby={
              villaInclusion.bedroomsHeading
                ? "villa-inclusion-bedrooms-title"
                : undefined
            }
          >
            <div className={styles.bedroomsInner}>
              <VillaInclusionImageSlider images={villaInclusion.bedroomsImages} />

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
            className={styles.additionalChargeSection}
            aria-labelledby={
              villaInclusion.additionalChargeHeading
                ? "villa-inclusion-additional-charge-title"
                : undefined
            }
          >
            <div className={styles.additionalChargeInner}>
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

        {hasReadyForStaySection && (
          <section
            className={styles.readyForStaySection}
            style={
              villaInclusion.readyForStayImage
                ? {
                    "--ready-for-stay-image": `url(${villaInclusion.readyForStayImage})`,
                  }
                : undefined
            }
            aria-labelledby={
              villaInclusion.readyForStayHeading
                ? "villa-inclusion-ready-for-stay-title"
                : undefined
            }
          >
            <div className={styles.readyForStayContent}>
              {villaInclusion.readyForStaySubHeading && (
                <p className={styles.readyForStayEyebrow}>
                  {villaInclusion.readyForStaySubHeading}
                </p>
              )}
              {villaInclusion.readyForStayHeading && (
                <h2 id="villa-inclusion-ready-for-stay-title">
                  {villaInclusion.readyForStayHeading}
                </h2>
              )}
              {villaInclusion.readyForStayContent && (
                <p>{villaInclusion.readyForStayContent}</p>
              )}
            </div>
          </section>
        )}

        {hasWhatsIncludedSection && (
          <section
            className={styles.whatsIncludedSection}
            aria-labelledby={
              villaInclusion.whatsIncludedHeading
                ? "villa-inclusion-whats-included-title"
                : undefined
            }
          >
            <div className={styles.whatsIncludedInner}>
              <div className={styles.whatsIncludedHeader}>
                {villaInclusion.whatsIncludedSubHeading && (
                  <p className={styles.whatsIncludedEyebrow}>
                    {villaInclusion.whatsIncludedSubHeading}
                  </p>
                )}
                {villaInclusion.whatsIncludedHeading && (
                  <h2 id="villa-inclusion-whats-included-title">
                    {villaInclusion.whatsIncludedHeading}
                  </h2>
                )}
              </div>

              {villaInclusion.whatsIncludedIcons.length > 0 && (
                <div className={styles.whatsIncludedGrid}>
                  {villaInclusion.whatsIncludedIcons.map((item, index) => (
                    <article
                      className={styles.whatsIncludedItem}
                      key={`${item.title}-${index}`}
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
          <section
            className={styles.experienceSection}
            style={
              villaInclusion.experienceImage
                ? {
                    "--experience-image": `url(${villaInclusion.experienceImage})`,
                  }
                : undefined
            }
            aria-labelledby={
              villaInclusion.experienceHeading
                ? "villa-inclusion-experience-title"
                : undefined
            }
          >
            <div className={styles.experienceContent}>
              {villaInclusion.experienceSubHeading && (
                <p className={styles.experienceEyebrow}>
                  {villaInclusion.experienceSubHeading}
                </p>
              )}
              {villaInclusion.experienceHeading && (
                <h2 id="villa-inclusion-experience-title">
                  {villaInclusion.experienceHeading}
                </h2>
              )}
              {villaInclusion.experienceContent && (
                <p>{villaInclusion.experienceContent}</p>
              )}
              {villaInclusion.experienceButtonText &&
                villaInclusion.experienceButtonUrl && (
                  <a
                    className={styles.experienceButton}
                    href={villaInclusion.experienceButtonUrl}
                  >
                    {villaInclusion.experienceButtonText}
                  </a>
                )}
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
