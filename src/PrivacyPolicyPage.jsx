import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  SiteFooter,
  SiteHeader,
} from "./App";
import styles from "./PrivacyPolicyPage.module.css";

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
      .map((item, index) => <p key={`policy-text-${index}`}>{item}</p>);
  }

  return (value.content || []).map((node, index) =>
    renderRichTextNode(node, `privacy-policy-content-${index}`),
  );
}

function getPrivacyPolicyContent(entry) {
  const fields = entry?.fields || {};

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    policyContent: fields.privacyPolicyContent || null,
  };
}

export default function PrivacyPolicyPage({
  footerEntry = null,
  headerEntry = null,
  privacyPolicyEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const privacyPolicy = getPrivacyPolicyContent(privacyPolicyEntry);
  const hasButton = Boolean(privacyPolicy.buttonText && privacyPolicy.buttonUrl);

  return (
    <main>
      <section
        className={`page-hero ${styles.privacyPolicyHero}`}
        style={
          privacyPolicy.bannerImage
            ? {
                "--privacy-policy-banner-image": `url(${privacyPolicy.bannerImage})`,
              }
            : undefined
        }
        aria-labelledby={
          privacyPolicy.bannerHeading ? "privacy-policy-title" : undefined
        }
      >
        <SiteHeader header={header} />

        <div className="page-hero-content">
          {privacyPolicy.bannerSubHeading && (
            <p className="page-hero-eyebrow">
              {privacyPolicy.bannerSubHeading}
            </p>
          )}
          {privacyPolicy.bannerHeading && (
            <h1 id="privacy-policy-title">{privacyPolicy.bannerHeading}</h1>
          )}
          {privacyPolicy.bannerContent && <p>{privacyPolicy.bannerContent}</p>}
          {hasButton && (
            <a
              className="button button--light page-hero-button"
              href={privacyPolicy.buttonUrl}
            >
              {privacyPolicy.buttonText}
            </a>
          )}
        </div>
      </section>

      {privacyPolicy.policyContent && (
        <section className={styles.contentSection}>
          <div className={styles.contentInner}>
            {renderRichText(privacyPolicy.policyContent)}
          </div>
        </section>
      )}

      <SiteFooter footer={footer} />
    </main>
  );
}
