import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
} from "./App";
import AosInitializer from "./AosInitializer";
import NetlifyForm from "./NetlifyForm";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function getFirstContentfulAsset(assets) {
  return Array.isArray(assets) ? assets[0] : assets;
}

function richTextToParagraphs(value) {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap(richTextToParagraphs);
  }

  if (typeof value !== "object") {
    return [];
  }

  if (value.nodeType === "paragraph") {
    const text = richTextToPlainText(value).trim();
    return text ? [text] : [];
  }

  if (typeof value.value === "string") {
    const text = value.value.trim();
    return text ? [text] : [];
  }

  return richTextToParagraphs(value.content);
}

function getContactContent(entry) {
  const fields = entry?.fields || {};
  const mapImageBox = (item) => {
    const itemFields = item?.fields || {};
    const iconAsset = getFirstContentfulAsset(itemFields.images);
    const contentLines = richTextToParagraphs(itemFields.content);

    return {
      icon: getContentfulImage(iconAsset),
      iconLabel: getContentfulImage(iconAsset)?.alt || "",
      count: itemFields.count || "",
      title: itemFields.title || "",
      content: richTextToPlainText(itemFields.content),
      contentLines,
      buttonText: itemFields.buttonText || "",
      buttonUrl: itemFields.buttonUrl || "",
    };
  };
  const connectWithUs = Array.isArray(fields.connectWithUs)
    ? fields.connectWithUs
        .map(mapImageBox)
        .filter(
          (item) =>
            item.icon?.src ||
            item.iconLabel ||
            item.count ||
            item.title ||
            item.content ||
            item.buttonText ||
            item.buttonUrl,
        )
    : [];
  const pattooCastleExperience = Array.isArray(fields.thePattooCastleExperience)
    ? fields.thePattooCastleExperience
        .map(mapImageBox)
        .filter((item) => item.count || item.title || item.content)
    : [];

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    connectWithUs,
    pattooCastleExperience,
    contactSubTitle: fields.contactSubTitle || "",
    contactTitle: fields.contactTitle || "",
    contactContent: richTextToPlainText(fields.contactContent),
    findUsImage: getContentfulImage(fields.findUsImage),
    findUsSubHeading: fields.findUsSubHeading || "",
    findUsHeading: fields.findUsHeading || "",
    findUsContent: richTextToPlainText(fields.findUsContent),
    findUsButtonText: fields.findUsButtonText || "",
    findUsButtonUrl: fields.findUsButtonUrl || "",
    pattooCastleHeading: fields.pattooCastleHeading || "",
    pattooCastleSubHeading: fields.pattooCastleSubHeading || "",
    ctaImage: getContentfulAssetSrc(fields.ctaImage),
    ctaSubHeading: fields.ctaSubHeading || "",
    ctaHeading: fields.ctaHeading || "",
    ctaContent: richTextToPlainText(fields.ctaContent),
    ctaButtonText: fields.ctaButtonText || "",
    ctaButtonUrl: fields.ctaButtonUrl || "",
  };
}

export default function ContactPage({
  contactEntry = null,
  footerEntry = null,
  headerEntry = null,
}) {
  const contact = getContactContent(contactEntry);
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const hasButton = Boolean(contact.buttonText && contact.buttonUrl);
  const hasConnectSection = contact.connectWithUs.length > 0;
  const hasExperienceSection = contact.pattooCastleExperience.length > 0;
  const hasContactFormSection = Boolean(
    contact.contactSubTitle || contact.contactTitle || contact.contactContent,
  );
  const hasFindUsButton = Boolean(
    contact.findUsButtonText && contact.findUsButtonUrl,
  );
  const hasFindUsSection = Boolean(
    contact.findUsImage?.src ||
    contact.findUsSubHeading ||
    contact.findUsHeading ||
    contact.findUsContent ||
    hasFindUsButton,
  );
  const hasPattooCastleQuoteSection = Boolean(
    contact.pattooCastleHeading || contact.pattooCastleSubHeading,
  );
  const hasCtaButton = Boolean(contact.ctaButtonText && contact.ctaButtonUrl);
  const hasCtaSection = Boolean(
    contact.ctaImage ||
    contact.ctaSubHeading ||
    contact.ctaHeading ||
    contact.ctaContent ||
    hasCtaButton,
  );

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main>
        <section
          className="section page-hero contact-hero"
          style={
            contact.bannerImage
              ? { "--contact-banner-image": `url(${contact.bannerImage})` }
              : undefined
          }
          aria-labelledby={contact.bannerHeading ? "contact-title" : undefined}
        >
          <div className="wrap">
            <div className="page-hero-content contact-hero-content">
              {contact.bannerSubHeading && (
                <p
                  className="eyebrow page-hero-eyebrow contact-hero-eyebrow"
                  data-aos="fade-up"
                  data-aos-delay="20"
                >
                  {contact.bannerSubHeading}
                </p>
              )}
              {contact.bannerHeading && (
                <h1 id="contact-title" data-aos="fade-up" data-aos-delay="50">
                  {contact.bannerHeading}
                </h1>
              )}
              {contact.bannerContent && (
                <p data-aos="fade-up" data-aos-delay="100">
                  {contact.bannerContent}
                </p>
              )}
              {hasButton && (
                <a
                  className="button button--light page-hero-button contact-hero-button"
                  href={contact.buttonUrl}
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  {contact.buttonText}
                </a>
              )}
            </div>
          </div>
        </section>

        {hasConnectSection && (
          <section
            className="section contact-connect-section"
            aria-label="Connect with us"
          >
            <div className="wrap">
              <div className="contact-connect-grid">
                {contact.connectWithUs.map((item, index) => (
                  <article
                    className="contact-connect-card"
                    key={`${item.title}-${index}`}
                    data-aos="fade-up"
                    data-aos-delay={String(index * 100)}
                  >
                    {item.icon?.src && (
                      <img
                        src={item.icon.src}
                        alt={item.icon.alt || item.title || "Contact icon"}
                      />
                    )}
                    {item.iconLabel && (
                      <p className="contact-connect-label">{item.iconLabel}</p>
                    )}
                    {item.title && <div className="title">{item.title}</div>}
                    {item.contentLines.map((line, lineIndex) => (
                      <p key={`${item.title}-content-${lineIndex}`}>{line}</p>
                    ))}
                    {item.buttonText &&
                      (item.buttonUrl ? (
                        <a
                          className="contact-connect-detail-link"
                          href={item.buttonUrl}
                        >
                          {item.buttonText}
                        </a>
                      ) : (
                        <p>{item.buttonText}</p>
                      ))}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {hasContactFormSection && (
          <section
            id="contact-planning-section"
            className="section contact-planning-section"
            aria-labelledby={
              contact.contactTitle ? "contact-planning-title" : undefined
            }
          >
            <div className="wrap">
              <div
                className="contact-planning-copy"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {contact.contactSubTitle && (
                  <p className="eyebrow contact-planning-eyebrow">
                    {contact.contactSubTitle}
                  </p>
                )}
                <span className="contact-planning-divider" aria-hidden="true" />
                {contact.contactTitle && (
                  <h2 id="contact-planning-title">{contact.contactTitle}</h2>
                )}
                {contact.contactContent && <p>{contact.contactContent}</p>}
              </div>

              <NetlifyForm
                className="contact-planning-form"
                formName="contact"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-company">Company</label>
                  <input id="contact-company" name="company" type="text" />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-title">Title</label>
                  <input id="contact-title" name="title" type="text" />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-first-name">First Name *</label>
                  <input
                    id="contact-first-name"
                    name="firstName"
                    required
                    type="text"
                  />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-last-name">Last Name *</label>
                  <input
                    id="contact-last-name"
                    name="lastName"
                    required
                    type="text"
                  />
                </div>

                <div className="contact-form-field contact-form-field--full">
                  <label htmlFor="contact-address">Address</label>
                  <input id="contact-address" name="address" type="text" />
                </div>

                <div className="contact-form-field contact-form-field--seven">
                  <label htmlFor="contact-address-line-2">Address Line 2</label>
                  <input
                    id="contact-address-line-2"
                    name="addressLine2"
                    type="text"
                  />
                </div>

                <div className="contact-form-field contact-form-field--five">
                  <label htmlFor="contact-city">City</label>
                  <input id="contact-city" name="city" type="text" />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-state">State</label>
                  <select id="contact-state" name="state" defaultValue="">
                    <option value="" aria-label="Select state" />
                    <option value="jamaica">Jamaica</option>
                    <option value="alabama">Alabama</option>
                    <option value="california">California</option>
                    <option value="florida">Florida</option>
                    <option value="new-york">New York</option>
                    <option value="texas">Texas</option>
                  </select>
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-postal-code">Postal Code</label>
                  <input
                    id="contact-postal-code"
                    name="postalCode"
                    type="text"
                  />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-email">Email Address *</label>
                  <input
                    id="contact-email"
                    name="email"
                    required
                    type="email"
                  />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-phone">Phone *</label>
                  <input id="contact-phone" name="phone" required type="tel" />
                </div>

                <div className="contact-form-field contact-form-field--full">
                  <label htmlFor="contact-comments">Comments *</label>
                  <textarea
                    id="contact-comments"
                    name="comments"
                    required
                    rows="6"
                  />
                </div>

                <div className="contact-form-submit-row">
                  <button className="contact-form-submit" type="submit">
                    <span aria-hidden="true">{"\u2723"}</span>
                    <strong>Send Inquiry</strong>
                  </button>
                </div>
              </NetlifyForm>
            </div>
          </section>
        )}

        {hasExperienceSection && (
          <section
            className="section contact-experience-section"
            aria-label="The Pattoo Castle experience"
          >
            <div className="wrap">
              <div className="contact-experience-grid">
                {contact.pattooCastleExperience.map((item, index) => (
                  <article
                    className="contact-experience-card"
                    key={`${item.title}-${index}`}
                    data-aos="fade-up"
                    data-aos-delay={String(index * 100)}
                  >
                    {item.count && (
                      <p className="eyebrow contact-experience-eyebrow">
                        {item.count}
                      </p>
                    )}
                    {item.title && <h2>{item.title}</h2>}
                    {item.content && <p>{item.content}</p>}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {hasFindUsSection && (
          <section
            className="section contact-find-section"
            aria-labelledby={
              contact.findUsHeading ? "contact-find-title" : undefined
            }
          >
            <div className="wrap">
              {contact.findUsImage?.src && (
                <figure
                  className="contact-find-image"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <img
                    src={contact.findUsImage.src}
                    alt={contact.findUsImage.alt || "Pattoo Castle location and contact"}
                  />
                </figure>
              )}

              <div
                className="contact-find-content"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {contact.findUsSubHeading && (
                  <p className="eyebrow contact-find-eyebrow">
                    {contact.findUsSubHeading}
                  </p>
                )}
                {contact.findUsHeading && (
                  <h2 id="contact-find-title">{contact.findUsHeading}</h2>
                )}
                {contact.findUsContent && <p>{contact.findUsContent}</p>}
                {hasFindUsButton && (
                  <a
                    className="button button--brown contact-find-button"
                    href={contact.findUsButtonUrl}
                  >
                    {contact.findUsButtonText}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {hasPattooCastleQuoteSection && (
          <section
            className="section contact-quote-section"
            aria-label="Guest experience"
          >
            <div className="wrap">
              <div
                className="contact-quote-mark"
                aria-hidden="true"
                data-aos="fade-up"
              >
                &ldquo;
              </div>
              {contact.pattooCastleHeading && (
                <blockquote>{contact.pattooCastleHeading}</blockquote>
              )}
              {contact.pattooCastleSubHeading && (
                <p className="eyebrow">{contact.pattooCastleSubHeading}</p>
              )}
            </div>
          </section>
        )}

        {hasCtaSection && (
          <section
            className="section contact-cta-section"
            style={
              contact.ctaImage
                ? { "--contact-cta-image": `url(${contact.ctaImage})` }
                : undefined
            }
            aria-labelledby={
              contact.ctaHeading ? "contact-cta-title" : undefined
            }
          >
            <div className="wrap">
              <div className="contact-cta-content">
                {contact.ctaSubHeading && (
                  <p
                    className="eyebrow contact-cta-eyebrow"
                    data-aos="fade-up"
                    data-aos-delay="50"
                  >
                    {contact.ctaSubHeading}
                  </p>
                )}
                {contact.ctaHeading && (
                  <h2
                    id="contact-cta-title"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    {contact.ctaHeading}
                  </h2>
                )}
                {contact.ctaContent && (
                  <p data-aos="fade-up" data-aos-delay="150">
                    {contact.ctaContent}
                  </p>
                )}
                {hasCtaButton && (
                  <a
                    className="button button--light contact-cta-button"
                    href={contact.ctaButtonUrl}
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    {contact.ctaButtonText}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
