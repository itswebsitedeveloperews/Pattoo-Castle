import {
  getContentfulAssetSrc,
  getFirstContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./StaffPage.module.css";

function getTeamMember(item) {
  const fields = item?.fields || {};

  return {
    image: getFirstContentfulImage(fields.images),
    name: fields.title || "",
    role: fields.count || "",
    content: richTextToPlainText(fields.content),
  };
}

function getStaffContent(entry) {
  const fields = entry?.fields || {};
  const teamDetails = Array.isArray(fields.teamDetails)
    ? fields.teamDetails
        .map(getTeamMember)
        .filter((item) => item.image?.src || item.name || item.content)
    : [];

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || fields.title || "",
    staffBlocks: Array.isArray(fields.staffBlocks)
      ? fields.staffBlocks
          .map((item) => ({
            id: item?.sys?.id,
            title: item?.fields?.galleryImageType || "",
          }))
          .filter((item) => item.title.trim())
      : [],
    teamSubHeading: fields.teamSubHeading || "",
    teamHeading: fields.teamHeading || "",
    teamContent: richTextToPlainText(fields.teamContent),
    teamDetails,
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
  const hasTeamSection = Boolean(
    staff.teamSubHeading ||
    staff.teamHeading ||
    staff.teamContent ||
    staff.teamDetails.length,
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
            {staff.bannerHeading && (
              <h1 id="staff-title" data-aos="fade-up" data-aos-delay="60">
                {staff.bannerHeading}
              </h1>
            )}
          </div>
        </section>

        {staff.staffBlocks.length > 0 && (
          <section
            className={`section ${styles.staffBlocksSection}`}
            aria-label="Staff services"
          >
            <ul className={`wrap ${styles.staffBlocksGrid}`}>
              {staff.staffBlocks.map((block, index) => (
                <li
                  className={styles.staffBlock}
                  key={`${block.id || "staff-block"}-${index}`}
                >
                  <p>{block.title}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasTeamSection && (
          <section
            className={`section ${styles.teamSection}`}
            aria-labelledby={staff.teamHeading ? "staff-team-title" : undefined}
          >
            <div className={`wrap ${styles.teamInner}`}>
              <div className={styles.teamHeader}>
                {staff.teamSubHeading && (
                  <p className={`eyebrow ${styles.teamEyebrow}`}>
                    {staff.teamSubHeading}
                  </p>
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
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
