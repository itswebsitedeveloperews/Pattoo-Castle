import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFirstContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
} from "./App";
import AosInitializer from "./AosInitializer";
import NetlifyForm from "./NetlifyForm";
import StayDateRangeFields from "./StayDateRangeFields";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

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
            icon: getFirstContentfulImage(itemFields.images),
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.icon?.src || item.title || item.content)
    : [];
  const roomBox = Array.isArray(fields.roomBox)
    ? fields.roomBox
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            image: getFirstContentfulImage(itemFields.images),
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
            buttonText: itemFields.buttonText || "",
            buttonUrl: itemFields.buttonUrl || "",
          };
        })
        .filter(
          (item) =>
            item.image?.src ||
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
            image: getFirstContentfulImage(itemFields.images),
            title: itemFields.title || "",
          };
        })
        .filter((item) => item.image?.src || item.title)
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
    experienceImage: getContentfulImage(fields.experienceImage),
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
    stay.experienceImage?.src ||
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
      <AosInitializer />
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
                <p
                  className="eyebrow page-hero-eyebrow stay-hero-eyebrow"
                  data-aos="fade-up"
                  data-aos-delay="20"
                >
                  {stay.bannerSubHeading}
                </p>
              )}
              {stay.bannerHeading && (
                <h1 id="stay-title" data-aos="fade-up" data-aos-delay="50">
                  {stay.bannerHeading}
                </h1>
              )}
              {stay.bannerContent && (
                <p data-aos="fade-up" data-aos-delay="100">
                  {stay.bannerContent}
                </p>
              )}
              {hasButton && (
                <a
                  className="button button--light page-hero-button stay-hero-button"
                  href={stay.buttonUrl}
                  data-aos="fade-up"
                  data-aos-delay="150"
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
                    data-aos="fade-up"
                    data-aos-delay={String(index * 100)}
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
            <NetlifyForm
              className="stay-inquiry-form"
              id="stay-inquiry-form"
              formName="stay-inquiry"
              data-aos="fade-up"
            >
              <div className="stay-inquiry-form-content">
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
                    <span>First Name *</span>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Enter first name"
                    />
                  </label>

                  <label className="event-inquiry-field">
                    <span>Last Name *</span>
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Enter last name"
                    />
                  </label>

                  <label className="event-inquiry-field">
                    <span>Email *</span>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter email name"
                    />
                  </label>

                  <label className="event-inquiry-field">
                    <span>Phone</span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Enter Phone number"
                    />
                  </label>

                  <StayDateRangeFields />

                  <label className="event-inquiry-field event-inquiry-field--full">
                    <span>Details</span>
                    <textarea
                      name="details"
                      required
                      placeholder="Tell us more about your stay..."
                    />
                  </label>
                </div>
              </div>
              <button
                className="button event-inquiry-submit"
                type="submit"
                form="stay-inquiry-form"
                data-aos="fade-up"
              >
                Send Inquiry
              </button>
            </NetlifyForm>
          </div>
        </section>

        {hasVillaSection && (
          <section
            className="section stay-villa-section"
            aria-labelledby={stay.villaHeading ? "stay-villa-title" : undefined}
          >
            <div className="wrap">
              <div className="stay-villa-copy" data-aos="fade-up">
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
                      data-aos="fade-up"
                      data-aos-delay={String(index * 100)}
                    >
                      {item.image?.src && (
                        <img
                          src={item.image.src}
                          alt={
                            item.image.alt ||
                            `Pattoo Castle villa feature ${index + 1}`
                          }
                        />
                      )}
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
              <div
                className="stay-experience-copy"
                data-aos="fade-up"
                data-aos-delay="100"
              >
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

              {stay.experienceImage?.src && (
                <img
                  className="stay-experience-image"
                  src={stay.experienceImage.src}
                  alt={
                    stay.experienceImage.alt || "Pattoo Castle stay experience"
                  }
                  data-aos="fade-up"
                  data-aos-delay="150"
                />
              )}

              {(stay.review || stay.reviewAuthor) && (
                <div
                  className="stay-experience-review"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
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
                <p
                  className="eyebrow stay-cta-eyebrow"
                  data-aos="fade-up"
                  data-aos-delay="20"
                >
                  {stay.ctaSubHeading}
                </p>
              )}
              {stay.ctaHeading && (
                <h2 id="stay-cta-title" data-aos="fade-up" data-aos-delay="50">
                  {stay.ctaHeading}
                </h2>
              )}
              {stay.ctaContent && (
                <div
                  className="stay-cta-text"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {renderRichText(stay.ctaContent)}
                </div>
              )}
              {stay.ctaButtonText && stay.ctaButtonUrl && (
                <a
                  className="button button--light stay-cta-button"
                  href={stay.ctaButtonUrl}
                  data-aos="fade-up"
                  data-aos-delay="150"
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
