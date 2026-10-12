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

const guestReviews = [
  {
    name: "J",
    text: "Gary is an amazing host…he ensured we had a great stay and stayed in communication regarding updates. The views of the castle are breathtaking…",
  },
  {
    name: "Lia",
    text: "Just book the castle! Everything about this Airbnb is amazing. Gary made the booking a seamless process, had fast responses and answered all of our…",
  },
  {
    name: "Paulina",
    text: "To say this was an amazing experience is an absolute understatement!! Pattoo is incredible in itself but everyone we met and spent our time with on the property…",
  },
];

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
  const airbnbUrl = stay.findUsBlocks.find((block) =>
    /airbnb/i.test(block.title),
  )?.url;

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
