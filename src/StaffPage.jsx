import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFirstContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./StaffPage.module.css";

function getDedicatedIcon(item) {
  const fields = item?.fields || {};

  return {
    icon: getContentfulImage(fields.galleryImage),
    title: fields.galleryImageType || "",
  };
}

function getTeamMember(item) {
  const fields = item?.fields || {};

  return {
    image: getFirstContentfulImage(fields.images),
    name: fields.title || "",
    role: fields.count || "",
    content: richTextToPlainText(fields.content),
  };
}

function getRichTextListItems(value) {
  if (!value || typeof value === "string") {
    return [];
  }

  const items = [];

  function walk(node) {
    if (!node) {
      return;
    }

    if (node.nodeType === "list-item") {
      const text = richTextToPlainText(node).trim();
      if (text) {
        items.push(text);
      }
      return;
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(walk);
    }
  }

  walk(value);
  return items;
}

function getRichTextParagraphText(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return (value.content || [])
    .filter((node) => node.nodeType === "paragraph")
    .map((node) => richTextToPlainText(node).trim())
    .filter(Boolean)
    .join(" ");
}

function getStaffContent(entry) {
  const fields = entry?.fields || {};
  const dedicatedIcons = Array.isArray(fields.dedicatedIconBox)
    ? fields.dedicatedIconBox
        .map(getDedicatedIcon)
        .filter((item) => item.icon?.src || item.title)
    : [];
  const teamDetails = Array.isArray(fields.teamDetails)
    ? fields.teamDetails
        .map(getTeamMember)
        .filter((item) => item.image?.src || item.name || item.content)
    : [];

  return {
    title: fields.title || "",
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || fields.title || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    dedicatedImage: getFirstContentfulImage(fields.dedicatedImage),
    dedicatedSubHeading: fields.dedicatedSubHeading || "",
    dedicatedHeading: fields.dedicatedHeading || "",
    dedicatedContent: richTextToPlainText(fields.dedicatedContent),
    dedicatedIcons,
    teamSubHeading: fields.teamSubHeading || "",
    teamHeading: fields.teamHeading || "",
    teamContent: richTextToPlainText(fields.teamContent),
    teamDetails,
    staffServiceImage: getContentfulImage(fields.staffServiceImage),
    staffServiceSubHeading: fields.staffServiceSubHeading || "",
    staffServiceHeading: fields.staffServiceHeading || "",
    staffServiceContent:
      getRichTextParagraphText(fields.staffServiceContent) ||
      richTextToPlainText(fields.staffServiceContent),
    staffServiceListItems: getRichTextListItems(fields.staffServiceContent),
  };
}

export default function StaffPage({
  footerEntry = null,
  headerEntry = null,
  staffEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const staff = getStaffContent(staffEntry);
  const hasButton = Boolean(staff.buttonText && staff.buttonUrl);
  const hasDedicatedSection = Boolean(
    staff.dedicatedImage?.src ||
      staff.dedicatedSubHeading ||
      staff.dedicatedHeading ||
      staff.dedicatedContent ||
      staff.dedicatedIcons.length,
  );
  const hasTeamSection = Boolean(
    staff.teamSubHeading ||
      staff.teamHeading ||
      staff.teamContent ||
      staff.teamDetails.length,
  );
  const hasStaffServiceSection = Boolean(
    staff.staffServiceImage?.src ||
      staff.staffServiceSubHeading ||
      staff.staffServiceHeading ||
      staff.staffServiceContent ||
      staff.staffServiceListItems.length,
  );

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="section page-hero accommodation-hero staff-hero"
          style={
            staff.bannerImage
              ? {
                  "--accommodation-banner-image": `url(${staff.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={staff.bannerHeading ? "staff-title" : undefined}
        >
          <div className="page-hero-content accommodation-hero-content">
            {staff.bannerSubHeading && (
              <p
                className="eyebrow page-hero-eyebrow accommodation-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {staff.bannerSubHeading}
              </p>
            )}
            {staff.bannerHeading && (
              <h1 id="staff-title" data-aos="fade-up" data-aos-delay="60">
                {staff.bannerHeading}
              </h1>
            )}
            {staff.bannerContent && (
              <p data-aos="fade-up" data-aos-delay="100">
                {staff.bannerContent}
              </p>
            )}
            {hasButton && (
              <a
                className="button button--light page-hero-button accommodation-hero-button"
                href={staff.buttonUrl}
                data-aos="fade-up"
                data-aos-delay="150"
              >
                {staff.buttonText}
              </a>
            )}
          </div>
        </section>

        {hasDedicatedSection && (
          <section
            className={styles.dedicatedSection}
            aria-labelledby={
              staff.dedicatedHeading ? "staff-dedicated-title" : undefined
            }
          >
            <div
              className={`${styles.dedicatedInner} ${
                staff.dedicatedImage?.src ? "" : styles.dedicatedInnerNoImage
              }`}
            >
              <div className={styles.dedicatedContent}>
                {staff.dedicatedSubHeading && (
                  <p className={styles.dedicatedEyebrow}>
                    {staff.dedicatedSubHeading}
                  </p>
                )}
                {staff.dedicatedHeading && (
                  <h2 id="staff-dedicated-title">{staff.dedicatedHeading}</h2>
                )}
                {staff.dedicatedContent && <p>{staff.dedicatedContent}</p>}

                {staff.dedicatedIcons.length > 0 && (
                  <div className={styles.dedicatedIconGrid}>
                    {staff.dedicatedIcons.map((item, index) => (
                      <article
                        className={styles.dedicatedIconItem}
                        data-aos="fade-up"
                        data-aos-delay={String(index * 70)}
                        key={`${item.title}-${index}`}
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
                        {item.title && <h3>{item.title}</h3>}
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {staff.dedicatedImage?.src && (
                <img
                  className={styles.dedicatedImage}
                  src={staff.dedicatedImage.src}
                  alt={staff.dedicatedImage.alt || "Pattoo Castle staff"}
                />
              )}
            </div>
          </section>
        )}

        {hasTeamSection && (
          <section
            className={styles.teamSection}
            aria-labelledby={staff.teamHeading ? "staff-team-title" : undefined}
          >
            <div className={styles.teamInner}>
              <div className={styles.teamHeader}>
                {staff.teamSubHeading && (
                  <p className={styles.teamEyebrow}>{staff.teamSubHeading}</p>
                )}
                {staff.teamHeading && (
                  <h2 id="staff-team-title">{staff.teamHeading}</h2>
                )}
                {staff.teamContent && <p>{staff.teamContent}</p>}
              </div>

              {staff.teamDetails.length > 0 && (
                <div className={styles.teamGrid}>
                  {staff.teamDetails.map((item, index) => (
                    <article
                      className={styles.teamCard}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 70)}
                      key={`${item.name}-${index}`}
                    >
                      {item.image?.src && (
                        <img
                          src={item.image.src}
                          alt={
                            item.image.alt ||
                            (item.name ? `${item.name} staff portrait` : "")
                          }
                        />
                      )}
                      {item.name && <h3>{item.name}</h3>}
                      {item.role && (
                        <p className={styles.teamRole}>{item.role}</p>
                      )}
                      {item.content && <p>{item.content}</p>}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {hasStaffServiceSection && (
          <section
            className={styles.staffServiceSection}
            aria-labelledby={
              staff.staffServiceHeading ? "staff-service-title" : undefined
            }
          >
            <div className={styles.staffServiceInner}>
              {staff.staffServiceImage?.src && (
                <img
                  className={styles.staffServiceImage}
                  src={staff.staffServiceImage.src}
                  alt={
                    staff.staffServiceImage.alt ||
                    "Pattoo Castle staff service setting"
                  }
                />
              )}

              <div className={styles.staffServiceContent}>
                {staff.staffServiceSubHeading && (
                  <p className={styles.staffServiceEyebrow}>
                    {staff.staffServiceSubHeading}
                  </p>
                )}
                {staff.staffServiceHeading && (
                  <h2 id="staff-service-title">{staff.staffServiceHeading}</h2>
                )}
                {staff.staffServiceContent && <p>{staff.staffServiceContent}</p>}

                {staff.staffServiceListItems.length > 0 && (
                  <ul className={styles.staffServiceList}>
                    {staff.staffServiceListItems.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
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
