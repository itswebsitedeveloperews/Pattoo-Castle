import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  richTextToReact,
} from "./App";
import AosInitializer from "./AosInitializer";
import StayInquiryForm from "./StayInquiryForm";
import StayReviewsCarousel from "./StayReviewsCarousel";
import StayReviewMessage from "./StayReviewMessage";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./StayPage.module.css";

function getImageBoxBlocks(items) {
  return Array.isArray(items)
    ? items.map((item) => ({
        id: item?.sys?.id,
        title: item?.fields?.title || "",
        content: item?.fields?.content || null,
        url: item?.fields?.buttonUrl || "",
      }))
    : [];
}

function getStayContent(entry) {
  const fields = entry?.fields || {};

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || "",
    findUsHeading: fields.findUsHeading || "",
    reviews: (Array.isArray(fields.reviewBlocks) ? fields.reviewBlocks : [])
      .filter((item) => item?.fields)
      .map((item) => ({
        id: item.sys?.id,
        image: getContentfulAssetSrc(item.fields.image),
        name: item.fields.name || "Guest",
        date: item.fields.date || "",
        rating: Number.isInteger(item.fields.rating)
          ? Math.max(0, Math.min(5, item.fields.rating))
          : null,
        message: item.fields.reviewMessage || null,
      })),
    reviewText: fields.reviewText || null,
    findUsBlocks: getImageBoxBlocks(fields.findUsBlocks).filter(
      (block) => block.title,
    ),
    informationBlocks: getImageBoxBlocks(fields.informationBlocks).filter(
      (block) => block.title || richTextToPlainText(block.content).trim(),
    ),
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

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main>
        <section
          className="pt-0 pb-0 section page-hero stay-hero"
          style={
            stay.bannerImage
              ? {
                  "--stay-banner-image": `url(${stay.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={stay.bannerHeading ? "stay-title" : undefined}
        >
          <div className="container container-wide">
            <div className="page-hero-content stay-hero-content">
              {stay.bannerHeading && (
                <h1 id="stay-title" data-aos="fade-up" data-aos-delay="50">
                  {stay.bannerHeading}
                </h1>
              )}
            </div>
          </div>
        </section>

        <StayInquiryForm />

        {(stay.findUsHeading || stay.findUsBlocks.length > 0) && (
          <section
            className={`section ${styles.findUsSection}`}
            aria-labelledby={stay.findUsHeading ? "find-us-title" : undefined}
            aria-label={stay.findUsHeading ? undefined : "Find us on"}
          >
            <div className="container">
              {stay.findUsHeading && (
                <h2 id="find-us-title">{stay.findUsHeading}</h2>
              )}
              {stay.findUsBlocks.length > 0 && (
                <ul className={styles.findUsGrid}>
                  {stay.findUsBlocks.map((block, index) => (
                    <li
                      className={styles.findUsCard}
                      key={`${block.id || "find-us"}-${index}`}
                    >
                      {block.url ? (
                        <a
                          href={block.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {block.title}
                        </a>
                      ) : (
                        <span>{block.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {(stay.reviews.length > 0 || richTextToPlainText(stay.reviewText).trim()) && (
          <section className={styles.reviewsSection} aria-label="Guest reviews">
            <div className={`container ${styles.reviewsInner}`}>
              {stay.reviews.length > 0 && (
                <StayReviewsCarousel>
                  {stay.reviews.map((review, index) => {
                    const date = new Date(review.date);
                    const hasDate = review.date && !Number.isNaN(date.getTime());
                    return (
                      <article className={styles.reviewCard} key={review.id || index}>
                        <div className={styles.reviewHeader}>
                          {review.image ? (
                            <img className={styles.reviewAvatar} src={review.image} alt="" />
                          ) : (
                            <span className={styles.reviewAvatar} aria-hidden="true">
                              {review.name.slice(0, 1)}
                            </span>
                          )}
                          <div>
                            <strong>{review.name}</strong>
                            {hasDate && (
                              <time className={styles.reviewSource} dateTime={review.date}>
                                {date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}
                              </time>
                            )}
                          </div>
                          <span className={styles.reviewBrand} tabIndex={0} aria-label="Posted on Airbnb">
                            <img src="/review-airbnb.svg" alt="" width="18" height="20" />
                            <span className={styles.reviewTooltip} aria-hidden="true">Posted on Airbnb</span>
                          </span>
                        </div>
                        {review.rating !== null && (
                          <div className={styles.reviewStars} role="img" aria-label={`${review.rating} out of 5 stars`}>
                            <span aria-hidden="true">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                          </div>
                        )}
                        <StayReviewMessage>
                          {richTextToReact(review.message, `stay-review-${index}`, true)}
                        </StayReviewMessage>
                      </article>
                    );
                  })}
                </StayReviewsCarousel>
              )}
              {stay.reviewText && <div className={styles.reviewRating}>{richTextToReact(stay.reviewText, "stay-review-summary", true)}</div>}
            </div>
          </section>
        )}

        {stay.informationBlocks.length > 0 && (
          <section
            className={`section pt-0 ${styles.informationSection}`}
            aria-label="Stay information and policies"
          >
            <div
              className={`container container-wide ${styles.informationGrid}`}
            >
              {stay.informationBlocks.map((block, index) => (
                <article
                  className={styles.informationBlock}
                  key={`${block.id || "information"}-${index}`}
                >
                  {block.title && <h2>{block.title}</h2>}
                  {block.content && (
                    <div className={styles.informationContent}>
                      {richTextToReact(
                        block.content,
                        `stay-information-${index}`,
                        true,
                      )}
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
