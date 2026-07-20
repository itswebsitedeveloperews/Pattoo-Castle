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

    (node.marks || []).forEach((mark) => {
      if (mark.type === "bold") {
        value = <strong>{value}</strong>;
      }

      if (mark.type === "italic") {
        value = <em>{value}</em>;
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
  const hasRoomButton = Boolean(stay.roomButtonText && stay.roomButtonUrl);
  const hasRoomsSection = Boolean(
    stay.roomSubHeading ||
      stay.roomHeading ||
      stay.roomContent ||
      hasRoomButton ||
      stay.roomBox.length,
  );
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
    <main>
      <section
        className="page-hero stay-hero"
        style={
          stay.bannerImage
            ? {
                "--stay-banner-image": `url(${stay.bannerImage})`,
              }
            : undefined
        }
        aria-labelledby={stay.bannerHeading ? "stay-title" : undefined}
      >
        <SiteHeader header={header} />

        <div className="page-hero-content stay-hero-content">
          {stay.bannerSubHeading && (
            <p className="page-hero-eyebrow stay-hero-eyebrow">{stay.bannerSubHeading}</p>
          )}
          {stay.bannerHeading && <h1 id="stay-title">{stay.bannerHeading}</h1>}
          {stay.bannerContent && <p>{stay.bannerContent}</p>}
          {hasButton && (
            <a className="button button--light page-hero-button stay-hero-button" href={stay.buttonUrl}>
              {stay.buttonText}
            </a>
          )}
        </div>
      </section>

      {stay.stayInformation.length > 0 && (
        <section className="stay-info-section" aria-label="Stay information">
          <div className="stay-info-grid">
            {stay.stayInformation.map((item, index) => (
              <article className="stay-info-card" key={`${item.title}-${index}`}>
                {item.iconSrc && <img src={item.iconSrc} alt="" />}
                {item.title && <h2>{item.title}</h2>}
                {item.content && <p>{item.content}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="stay-inquiry-section" aria-labelledby="stay-inquiry-title">
        <form className="stay-inquiry-form" id="stay-inquiry-form">
          <div className="stay-inquiry-heading">
            <span className="stay-inquiry-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 12.25a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                <path d="M5.75 19.5a6.25 6.25 0 0 1 12.5 0" />
              </svg>
            </span>
            <h2 id="stay-inquiry-title">Contact Information</h2>
          </div>

          <div className="stay-inquiry-grid">
            <label className="stay-inquiry-field">
              <span>First Name</span>
              <input type="text" name="firstName" placeholder="Enter first name" />
            </label>

            <label className="stay-inquiry-field">
              <span>Last Name</span>
              <input type="text" name="lastName" placeholder="Enter last name" />
            </label>

            <label className="stay-inquiry-field">
              <span>Email</span>
              <input type="email" name="email" placeholder="Enter email name" />
            </label>

            <label className="stay-inquiry-field">
              <span>Phone</span>
              <input type="tel" name="phone" placeholder="Enter Phone number" />
            </label>

            <label className="stay-inquiry-field stay-inquiry-field--half">
              <span>Check-in Date</span>
              <input type="date" name="checkIn" aria-label="Check-in date" />
            </label>

            <label className="stay-inquiry-field stay-inquiry-field--half">
              <span>Check-Out Date</span>
              <input type="date" name="checkOut" aria-label="Check-out date" />
            </label>

            <label className="stay-inquiry-field stay-inquiry-field--full">
              <span>Details</span>
              <textarea name="details" placeholder="Tell us more about your stay..." />
            </label>
          </div>
        </form>

        <button className="stay-inquiry-submit" type="submit" form="stay-inquiry-form">
          Send Inquiry
        </button>
      </section>

      {hasRoomsSection && (
        <section
          className="stay-rooms-section"
          aria-labelledby={stay.roomHeading ? "stay-rooms-title" : undefined}
        >
          <div className="stay-rooms-copy">
            {stay.roomSubHeading && (
              <p className="stay-rooms-eyebrow">{stay.roomSubHeading}</p>
            )}
            {stay.roomHeading && <h2 id="stay-rooms-title">{stay.roomHeading}</h2>}
            {stay.roomContent && <p>{stay.roomContent}</p>}
            {hasRoomButton && (
              <a className="button button--brown stay-rooms-button" href={stay.roomButtonUrl}>
                {stay.roomButtonText}
              </a>
            )}
          </div>

          {stay.roomBox.length > 0 && (
            <div className="stay-rooms-grid">
              {stay.roomBox.map((item, index) => {
                const hasCardButton = Boolean(item.buttonText && item.buttonUrl);

                return (
                  <article className="stay-room-card" key={`${item.title}-${index}`}>
                    {item.imageSrc && <img src={item.imageSrc} alt="" />}
                    <div className="stay-room-card-body">
                      {item.title && <h3>{item.title}</h3>}
                      {item.content && <p>{item.content}</p>}
                      {hasCardButton && (
                        <a href={item.buttonUrl}>{item.buttonText}</a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {hasVillaSection && (
        <section
          className="stay-villa-section"
          aria-labelledby={stay.villaHeading ? "stay-villa-title" : undefined}
        >
          <div className="stay-villa-copy">
            {stay.villaSubHeading && (
              <p className="stay-villa-eyebrow">{stay.villaSubHeading}</p>
            )}
            {stay.villaHeading && <h2 id="stay-villa-title">{stay.villaHeading}</h2>}
            {stay.villaContent && <p>{stay.villaContent}</p>}
          </div>

          {stay.villaBox.length > 0 && (
            <div className="stay-villa-grid">
              {stay.villaBox.map((item, index) => (
                <article className="stay-villa-card" key={`${item.title}-${index}`}>
                  {item.imageSrc && <img src={item.imageSrc} alt="" />}
                  {item.title && <h3>{item.title}</h3>}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {hasExperienceSection && (
        <section
          className="stay-experience-section"
          aria-labelledby={
            stay.experienceHeading ? "stay-experience-title" : undefined
          }
        >
          <div className="stay-experience-copy">
            {stay.experienceSubHeading && (
              <p className="stay-experience-eyebrow">
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
        </section>
      )}

      {hasCtaSection && (
        <section
          className="stay-cta-section"
          style={
            stay.ctaImage
              ? {
                  "--stay-cta-image": `url(${stay.ctaImage})`,
                }
              : undefined
          }
          aria-labelledby={stay.ctaHeading ? "stay-cta-title" : undefined}
        >
          <div className="stay-cta-content">
            {stay.ctaSubHeading && (
              <p className="stay-cta-eyebrow">{stay.ctaSubHeading}</p>
            )}
            {stay.ctaHeading && <h2 id="stay-cta-title">{stay.ctaHeading}</h2>}
            {stay.ctaContent && (
              <div className="stay-cta-text">{renderRichText(stay.ctaContent)}</div>
            )}
            {stay.ctaButtonText && stay.ctaButtonUrl && (
              <a className="button button--light stay-cta-button" href={stay.ctaButtonUrl}>
                {stay.ctaButtonText}
              </a>
            )}
          </div>
        </section>
      )}

      <SiteFooter footer={footer} />
    </main>
  );
}
