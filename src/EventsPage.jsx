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
import styles from "./EventsPage.module.css";

function getEventContent(entry) {
  const fields = entry?.fields || {};

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || "",
    blocks: Array.isArray(fields.eventsBlocks)
      ? fields.eventsBlocks.map((item) => {
          const block = item?.fields || {};
          return {
            id: item?.sys?.id,
            image: getFirstContentfulImage(block.images),
            title: block.title || "",
            content: block.content || null,
            buttonText: block.buttonText || "",
            buttonUrl: block.buttonUrl || "",
          };
        }).filter((block) =>
          block.image?.src || block.title || richTextToPlainText(block.content).trim() ||
          (block.buttonText && block.buttonUrl),
        )
      : [],
  };
}

export default function EventsPage({
  eventEntry = null,
  footerEntry = null,
  headerEntry = null,
}) {
  const event = getEventContent(eventEntry);
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main>
        <section
          className="pt-0 pb-0 section page-hero events-hero"
          style={
            event.bannerImage
              ? { "--events-banner-image": `url(${event.bannerImage})` }
              : undefined
          }
          aria-labelledby={event.bannerHeading ? "events-title" : undefined}
        >
          <div className="wrap">
            <div className="page-hero-content events-hero-content">
              {event.bannerHeading && (
                <h1 id="events-title" data-aos="fade-up" data-aos-delay="60">
                  {event.bannerHeading}
                </h1>
              )}
            </div>
          </div>
        </section>
        {event.blocks.length > 0 && (
          <section className={`section ${styles.blocksSection}`} aria-label="Events at Pattoo Castle">
            <div className={`wrap ${styles.blocksGrid}`}>
              {event.blocks.map((block, index) => (
                <article className={styles.block} key={`${block.id || "event-block"}-${index}`}>
                  {block.image?.src && (
                    block.buttonUrl ? (
                      <a className={styles.blockImageLink} href={block.buttonUrl}>
                        <img
                          className={styles.blockImage}
                          src={block.image.src}
                          alt={block.image.alt || block.title || "Pattoo Castle event"}
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <img
                        className={styles.blockImage}
                        src={block.image.src}
                        alt={block.image.alt || block.title || "Pattoo Castle event"}
                        loading="lazy"
                      />
                    )
                  )}
                  <div className={styles.blockBody}>
                    {block.title && (
                      <h2>
                        {block.buttonUrl ? (
                          <a className={styles.blockTitleLink} href={block.buttonUrl}>
                            {block.title}
                          </a>
                        ) : block.title}
                      </h2>
                    )}
                    {block.content && (
                      <div className={styles.blockContent}>
                        {richTextToReact(block.content, `event-block-${index}`, true)}
                      </div>
                    )}
                    {block.buttonText && block.buttonUrl && (
                      <a className={`btn btn--brown ${styles.blockButton}`} href={block.buttonUrl}>
                        {block.buttonText}
                      </a>
                    )}
                  </div>
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
