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
            item.count ||
            item.title ||
            item.content ||
            item.buttonText ||
            item.buttonUrl,
        )
    : [];
  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || "",
    connectWithUs,
    contactSubTitle: fields.contactSubTitle || "",
    contactTitle: fields.contactTitle || "",
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
  const hasConnectSection = contact.connectWithUs.length > 0;
  const hasContactFormSection = Boolean(
    contact.contactSubTitle || contact.contactTitle,
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
              {contact.bannerHeading && (
                <h1 id="contact-title" data-aos="fade-up" data-aos-delay="50">
                  {contact.bannerHeading}
                </h1>
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
                {contact.contactTitle && (
                  <h2 id="contact-planning-title">{contact.contactTitle}</h2>
                )}
                {contact.contactSubTitle && <p>{contact.contactSubTitle}</p>}
              </div>

              <NetlifyForm
                className="contact-planning-form"
                formName="contact"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="contact-fields-panel">
                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-company">Company</label>
                  <input id="contact-company" name="company" placeholder="Enter company name" type="text" />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-person-title">Title</label>
                  <input id="contact-person-title" name="title" placeholder="Enter title" type="text" />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-first-name">First Name *</label>
                  <input
                    id="contact-first-name"
                    name="firstName" placeholder="Enter first name"
                    required
                    type="text"
                  />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-last-name">Last Name *</label>
                  <input
                    id="contact-last-name"
                    name="lastName" placeholder="Enter last name"
                    required
                    type="text"
                  />
                </div>

                <div className="contact-form-field contact-form-field--full">
                  <label htmlFor="contact-address">Address</label>
                  <input id="contact-address" name="address" placeholder="Enter address" type="text" />
                </div>

                <div className="contact-form-field contact-form-field--seven">
                  <label htmlFor="contact-address-line-2">Address Line 2</label>
                  <input
                    id="contact-address-line-2"
                    name="addressLine2" placeholder="Enter address line 2"
                    type="text"
                  />
                </div>

                <div className="contact-form-field contact-form-field--five">
                  <label htmlFor="contact-city">City</label>
                  <input id="contact-city" name="city" placeholder="Enter city" type="text" />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-state">State</label>
                  <select id="contact-state" name="state" defaultValue="">
                    <option value="">Select state</option>
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
                    name="postalCode" placeholder="Enter postal code"
                    type="text"
                  />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-email">Email Address *</label>
                  <input
                    id="contact-email"
                    name="email" placeholder="Enter email address"
                    required
                    type="email"
                  />
                </div>

                <div className="contact-form-field contact-form-field--quarter">
                  <label htmlFor="contact-phone">Phone *</label>
                  <input id="contact-phone" name="phone" placeholder="Enter phone number" required type="tel" />
                </div>

                <div className="contact-form-field contact-form-field--full">
                  <label htmlFor="contact-comments">Comments *</label>
                  <textarea
                    id="contact-comments"
                    name="comments" placeholder="Enter comments"
                    required
                    rows="2"
                  />
                </div>

                </div>

                <div className="contact-form-submit-row">
                  <button className="contact-form-submit" type="submit">
                    Send Here
                  </button>
                </div>
              </NetlifyForm>
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
