import {
  getContentfulAssetSrc,
  getFirstContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  richTextToReact,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./OptionalToursActivitiesPage.module.css";

function getActivityBlocks(items) {
  return Array.isArray(items)
    ? items.map((item) => {
        const fields = item?.fields || {};
        return {
          id: item?.sys?.id,
          image: getFirstContentfulImage(fields.images),
          title: fields.title || "",
          content: fields.content || null,
        };
      }).filter((item) =>
        item.image?.src || item.title || richTextToPlainText(item.content).trim(),
      )
    : [];
}

export default function OptionalToursActivitiesPage({
  footerEntry = null,
  headerEntry = null,
  optionalToursActivitiesEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const fields = optionalToursActivitiesEntry?.fields || {};
  const bannerImage = getContentfulAssetSrc(fields.bannerImage);
  const bannerHeading = fields.bannerHeading || "";
  const activities = getActivityBlocks(fields.optionalToursActivitiesBlocks);

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="section page-hero location-hero"
          style={
            bannerImage
              ? { "--location-banner-image": `url(${bannerImage})` }
              : undefined
          }
          aria-labelledby={bannerHeading ? "optional-tours-title" : undefined}
        >
          <div className="page-hero-content location-hero-content">
            {bannerHeading && (
              <h1 id="optional-tours-title" data-aos="fade-up" data-aos-delay="50">
                {bannerHeading}
              </h1>
            )}
          </div>
        </section>
        {activities.length > 0 && (
          <section
            className={`section ${styles.activitiesSection}`}
            aria-label="Optional tours and activities"
          >
            <div className={`wrap ${styles.activitiesGrid}`}>
              {activities.map((activity, index) => (
                <article
                  className={styles.activityCard}
                  key={`${activity.id || "activity"}-${index}`}
                >
                  {activity.image?.src && (
                    <img
                      className={styles.activityImage}
                      src={activity.image.src}
                      alt={activity.image.alt || activity.title || "Negril activity"}
                      loading="lazy"
                    />
                  )}
                  {activity.title && <h2>{activity.title}</h2>}
                  {activity.content && (
                    <div className={styles.activityContent}>
                      {richTextToReact(activity.content, `activity-${index}`, true)}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
