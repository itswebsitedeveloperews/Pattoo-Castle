import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./LegalPage.module.css";

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

function renderRichText(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item, index) => <p key={`legal-text-${index}`}>{item}</p>);
  }

  return (value.content || []).map((node, index) =>
    renderRichTextNode(node, `legal-content-${index}`),
  );
}

function getLegalContent(entry) {
  const fields = entry?.fields || {};

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || fields.title || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    content:
      fields.termsConditionContent ||
      fields.termsAndConditionContent ||
      fields.termsConditionsContent ||
      fields.privacyPolicyContent ||
      fields.legalContent ||
      fields.content ||
      null,
  };
}

export default function LegalPage({
  footerEntry = null,
  headerEntry = null,
  legalEntry = null,
  pageId = "legal",
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const legal = getLegalContent(legalEntry);
  const hasButton = Boolean(legal.buttonText && legal.buttonUrl);
  const titleId = `${pageId}-title`;

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className={`page-hero ${styles.legalHero}`}
          style={
            legal.bannerImage
              ? {
                  "--legal-banner-image": `url(${legal.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={legal.bannerHeading ? titleId : undefined}
        >
          <div className="page-hero-content">
            {legal.bannerSubHeading && (
              <p
                className="eyebrow page-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {legal.bannerSubHeading}
              </p>
            )}
            {legal.bannerHeading && (
              <h1 id={titleId} data-aos="fade-up" data-aos-delay="50">
                {legal.bannerHeading}
              </h1>
            )}
            {legal.bannerContent && (
              <p data-aos="fade-up" data-aos-delay="100">
                {legal.bannerContent}
              </p>
            )}
            {hasButton && (
              <a
                className="button button--light page-hero-button"
                href={legal.buttonUrl}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {legal.buttonText}
              </a>
            )}
          </div>
        </section>

        {legal.content && (
          <section className={styles.contentSection}>
            <div className={styles.contentInner} data-aos="fade-up">
              {renderRichText(legal.content)}
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
