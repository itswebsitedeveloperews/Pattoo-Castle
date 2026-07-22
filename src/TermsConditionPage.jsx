import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  SiteFooter,
  SiteHeader,
} from "./App";
import styles from "./TermsConditionPage.module.css";

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
      .map((item, index) => <p key={`terms-text-${index}`}>{item}</p>);
  }

  return (value.content || []).map((node, index) =>
    renderRichTextNode(node, `terms-condition-content-${index}`),
  );
}

function getTermsConditionContent(entry) {
  const fields = entry?.fields || {};

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    termsContent:
      fields.termsConditionContent ||
      fields.termsAndConditionContent ||
      fields.termsConditionsContent ||
      null,
  };
}

export default function TermsConditionPage({
  footerEntry = null,
  headerEntry = null,
  termsConditionEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const termsCondition = getTermsConditionContent(termsConditionEntry);
  const hasButton = Boolean(
    termsCondition.buttonText && termsCondition.buttonUrl,
  );

  return (
    <main>
      <section
        className={`page-hero ${styles.termsConditionHero}`}
        style={
          termsCondition.bannerImage
            ? {
                "--terms-condition-banner-image": `url(${termsCondition.bannerImage})`,
              }
            : undefined
        }
        aria-labelledby={
          termsCondition.bannerHeading ? "terms-condition-title" : undefined
        }
      >
        <SiteHeader header={header} />

        <div className="page-hero-content">
          {termsCondition.bannerSubHeading && (
            <p className="page-hero-eyebrow">
              {termsCondition.bannerSubHeading}
            </p>
          )}
          {termsCondition.bannerHeading && (
            <h1 id="terms-condition-title">{termsCondition.bannerHeading}</h1>
          )}
          {termsCondition.bannerContent && (
            <p>{termsCondition.bannerContent}</p>
          )}
          {hasButton && (
            <a
              className="button button--light page-hero-button"
              href={termsCondition.buttonUrl}
            >
              {termsCondition.buttonText}
            </a>
          )}
        </div>
      </section>

      {termsCondition.termsContent && (
        <section className={styles.contentSection}>
          <div className={styles.contentInner}>
            {renderRichText(termsCondition.termsContent)}
          </div>
        </section>
      )}

      <SiteFooter footer={footer} />
    </main>
  );
}
