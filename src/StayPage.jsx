import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  richTextToReact,
} from "./App";
import AosInitializer from "./AosInitializer";
import StayInquiryForm from "./StayInquiryForm";
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
    findUsBlocks: getImageBoxBlocks(fields.findUsBlocks).filter(block => block.title),
    informationBlocks: getImageBoxBlocks(fields.informationBlocks).filter(
      block => block.title || richTextToPlainText(block.content).trim(),
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
            <div className={`wrap ${styles.findUsInner}`}>
              {stay.findUsHeading && <h2 id="find-us-title">{stay.findUsHeading}</h2>}
              {stay.findUsBlocks.length > 0 && (
                <ul className={styles.findUsGrid}>
                  {stay.findUsBlocks.map((block, index) => (
                    <li className={styles.findUsCard} key={`${block.id || "find-us"}-${index}`}>
                      {block.url ? <a href={block.url}>{block.title}</a> : <span>{block.title}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {stay.informationBlocks.length > 0 && (
          <section className={`section ${styles.informationSection}`} aria-label="Stay information and policies">
            <div className={`wrap ${styles.informationGrid}`}>
              {stay.informationBlocks.map((block, index) => (
                <article className={styles.informationBlock} key={`${block.id || "information"}-${index}`}>
                  {block.title && <h2>{block.title}</h2>}
                  {block.content && (
                    <div className={styles.informationContent}>
                      {richTextToReact(block.content, `stay-information-${index}`, true)}
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
