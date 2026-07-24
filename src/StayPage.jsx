import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  SiteFooter,
  SiteHeader,
} from "./App";

function getFirstContentfulAssetSrc(assets) {
  if (Array.isArray(assets)) {
    return getContentfulAssetSrc(assets[0]);
  }

  return getContentfulAssetSrc(assets);
}

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
    case "unordered-list":
      return <ul key={key}>{children}</ul>;
    case "ordered-list":
      return <ol key={key}>{children}</ol>;
    case "list-item":
      return (
        <li key={key}>
          {(node.content || []).map((child, childIndex) => {
            if (child.nodeType === "paragraph") {
              return (child.content || []).map((grandchild, grandchildIndex) =>
                renderRichTextNode(
                  grandchild,
                  `${key}-${childIndex}-${grandchildIndex}`,
                ),
              );
            }

            return renderRichTextNode(child, `${key}-${childIndex}`);
          })}
        </li>
      );
    case "hyperlink":
      return (
        <a key={key} href={node.data?.uri || "#"}>
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
    return <p>{value}</p>;
  }

  return (value.content || []).map((node, index) =>
    renderRichTextNode(node, `rich-text-${index}`),
  );
}

function getStayContent(entry) {
  const fields = entry?.fields || {};
  const stayInformation = Array.isArray(fields.stayInformation)
    ? fields.stayInformation
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            iconSrc: getFirstContentfulAssetSrc(itemFields.images),
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.iconSrc || item.title || item.content)
    : [];
  const roomBox = Array.isArray(fields.roomBox)
    ? fields.roomBox
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            imageSrc: getFirstContentfulAssetSrc(itemFields.images),
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
            buttonText: itemFields.buttonText || "",
            buttonUrl: itemFields.buttonUrl || "",
          };
        })
        .filter(
          (item) =>
            item.imageSrc ||
            item.title ||
            item.content ||
            (item.buttonText && item.buttonUrl),
        )
    : [];
  const villaBox = Array.isArray(fields.villaBox)
    ? fields.villaBox
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            imageSrc: getFirstContentfulAssetSrc(itemFields.images),
            title: itemFields.title || "",
          };
        })
        .filter((item) => item.imageSrc || item.title)
    : [];

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    stayInformation,
    roomSubHeading: fields.roomSubHeading || "",
    roomHeading: fields.roomHeading || "",
    roomContent: richTextToPlainText(fields.roomContent),
    roomButtonText: fields.roomButtonText || "",
    roomButtonUrl: fields.roomButtonUrl || "",
    roomBox,
    villaSubHeading: fields.villaSubHeading || "",
    villaHeading: fields.villaHeading || "",
    villaContent: richTextToPlainText(fields.villaContent),
    villaBox,
    experienceSubHeading: fields.experienceSubHeading || "",
    experienceHeading: fields.experienceHeading || "",
    experienceContent: fields.experienceContent || null,
    experienceImage: getContentfulAssetSrc(fields.experienceImage),
    review: fields.review || "",
    reviewAuthor: fields.reviewAuthor || "",
    ctaImage: getContentfulAssetSrc(fields.ctaImage),
    ctaSubHeading: fields.ctaSubHeading || "",
    ctaHeading: fields.ctaHeading || "",
    ctaContent: fields.ctaContent || null,
    ctaButtonText: fields.ctaButtonText || "",
    ctaButtonUrl: fields.ctaButtonUrl || "",
  };
}

export default function StayPage({
  footerEntry = null,
  headerEntry = null,
  stayEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const stay = getStayContent(stayEntry);
  const hasButton = Boolean(stay.buttonText && stay.buttonUrl);
  const hasVillaSection = Boolean(
    stay.villaSubHeading ||
    stay.villaHeading ||
    stay.villaContent ||
    stay.villaBox.length,
  );
  const hasExperienceSection = Boolean(
    stay.experienceSubHeading ||
    stay.experienceHeading ||
    stay.experienceContent ||
    stay.experienceImage ||
    stay.review ||
    stay.reviewAuthor,
  );
  const hasCtaSection = Boolean(
    stay.ctaSubHeading ||
    stay.ctaHeading ||
    stay.ctaContent ||
    (stay.ctaButtonText && stay.ctaButtonUrl),
  );

  return (
    <>
      <SiteHeader header={header} />
      <main>
        <section
          className="section page-hero stay-hero"
          style={
            stay.bannerImage
              ? {
                  "--stay-banner-image": `url(${stay.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={stay.bannerHeading ? "stay-title" : undefined}
        >
          <div className="wrap">
            <div className="page-hero-content stay-hero-content">
              {stay.bannerSubHeading && (
                <p className="eyebrow page-hero-eyebrow stay-hero-eyebrow">
                  {stay.bannerSubHeading}
                </p>
              )}
              {stay.bannerHeading && (
                <h1 id="stay-title">{stay.bannerHeading}</h1>
              )}
              {stay.bannerContent && <p>{stay.bannerContent}</p>}
              {hasButton && (
                <a
                  className="button button--light page-hero-button stay-hero-button"
                  href={stay.buttonUrl}
                >
                  {stay.buttonText}
                </a>
              )}
            </div>
          </div>
        </section>

        {stay.stayInformation.length > 0 && (
          <section
            className="section stay-info-section"
            aria-label="Stay information"
          >
            <div className="wrap">
              <div className="stay-info-grid">
                {stay.stayInformation.map((item, index) => (
                  <article
                    className="stay-info-card"
                    key={`${item.title}-${index}`}
                  >
                    {item.iconSrc && <img src={item.iconSrc} alt="" />}
                    {item.title && <h2>{item.title}</h2>}
                    {item.content && <p>{item.content}</p>}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section
          className="section stay-inquiry-section"
          aria-labelledby="stay-inquiry-title"
        >
          <div className="wrap">
            <form className="stay-inquiry-form" id="stay-inquiry-form">
              <div className="stay-inquiry-heading">
                <span className="event-inquiry-icon" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.4167 4.58398H4.58333C3.57081 4.58398 2.75 5.4048 2.75 6.41732V17.4173C2.75 18.4298 3.57081 19.2507 4.58333 19.2507H17.4167C18.4292 19.2507 19.25 18.4298 19.25 17.4173V6.41732C19.25 5.4048 18.4292 4.58398 17.4167 4.58398Z"
                      stroke="#B9802E"
                      strokeWidth="1.55833"
                    ></path>
                    <path
                      d="M14.6667 2.75V6.41667M7.33333 2.75V6.41667M2.75 9.16667H19.25"
                      stroke="#B9802E"
                      strokeWidth="1.55833"
                    ></path>
                  </svg>
                </span>
                Contact Information
              </div>

              <div className="event-inquiry-grid event-inquiry-grid--contact">
                <label className="event-inquiry-field">
                  <span>First Name</span>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                  />
                </label>

                <label className="event-inquiry-field">
                  <span>Last Name</span>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                  />
                </label>

                <label className="event-inquiry-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email name"
                  />
                </label>

                <label className="event-inquiry-field">
                  <span>Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter Phone number"
                  />
                </label>

                <label className="event-inquiry-field event-inquiry-field--half">
                  <span>Check-in Date</span>
                  <input
                    type="date"
                    name="checkIn"
                    aria-label="Check-in date"
                  />
                </label>

                <label className="event-inquiry-field event-inquiry-field--half">
                  <span>Check-Out Date</span>
                  <input
                    type="date"
                    name="checkOut"
                    aria-label="Check-out date"
                  />
                </label>

                <label className="event-inquiry-field event-inquiry-field--full">
                  <span>Details</span>
                  <textarea
                    name="details"
                    placeholder="Tell us more about your stay..."
                  />
                </label>
              </div>
            </form>

            <button
              className="button event-inquiry-submit"
              type="submit"
              form="stay-inquiry-form"
            >
              Send Inquiry
            </button>
          </div>
        </section>

        {hasVillaSection && (
          <section
            className="section stay-villa-section"
            aria-labelledby={stay.villaHeading ? "stay-villa-title" : undefined}
          >
            <div className="wrap">
              <div className="stay-villa-copy">
                {stay.villaSubHeading && (
                  <p className="eyebrow stay-villa-eyebrow">
                    {stay.villaSubHeading}
                  </p>
                )}
                {stay.villaHeading && (
                  <h2 id="stay-villa-title">{stay.villaHeading}</h2>
                )}
                {stay.villaContent && <p>{stay.villaContent}</p>}
              </div>

              {stay.villaBox.length > 0 && (
                <div className="stay-villa-grid">
                  {stay.villaBox.map((item, index) => (
                    <article
                      className="stay-villa-card"
                      key={`${item.title}-${index}`}
                    >
                      {item.imageSrc && <img src={item.imageSrc} alt="" />}
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
            className="section stay-experience-section"
            aria-labelledby={
              stay.experienceHeading ? "stay-experience-title" : undefined
            }
          >
            <div className="wrap">
              <div className="stay-experience-copy">
                {stay.experienceSubHeading && (
                  <p className="eyebrow stay-experience-eyebrow">
                    {stay.experienceSubHeading}
                  </p>
                )}
                {stay.experienceHeading && (
                  <h2 id="stay-experience-title">{stay.experienceHeading}</h2>
                )}
                {stay.experienceContent && (
                  <div className="stay-experience-content">
                    {renderRichText(stay.experienceContent)}
                  </div>
                )}
              </div>

              {stay.experienceImage && (
                <img
                  className="stay-experience-image"
                  src={stay.experienceImage}
                  alt=""
                />
              )}

              {(stay.review || stay.reviewAuthor) && (
                <div className="stay-experience-review">
                  <span aria-hidden="true">“</span>
                  {stay.review && <blockquote>{stay.review}</blockquote>}
                  {stay.reviewAuthor && <p>{stay.reviewAuthor}</p>}
                </div>
              )}
            </div>
          </section>
        )}

        {hasCtaSection && (
          <section
            className="section stay-cta-section"
            style={
              stay.ctaImage
                ? {
                    "--stay-cta-image": `url(${stay.ctaImage})`,
                  }
                : undefined
            }
            aria-labelledby={stay.ctaHeading ? "stay-cta-title" : undefined}
          >
            <div className="wrap stay-cta-content">
              {stay.ctaSubHeading && (
                <p className="eyebrow stay-cta-eyebrow">{stay.ctaSubHeading}</p>
              )}
              {stay.ctaHeading && (
                <h2 id="stay-cta-title">{stay.ctaHeading}</h2>
              )}
              {stay.ctaContent && (
                <div className="stay-cta-text">
                  {renderRichText(stay.ctaContent)}
                </div>
              )}
              {stay.ctaButtonText && stay.ctaButtonUrl && (
                <a
                  className="button button--light stay-cta-button"
                  href={stay.ctaButtonUrl}
                >
                  {stay.ctaButtonText}
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
