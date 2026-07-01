import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  SiteFooter,
  SiteHeader,
} from "./App";

function getFirstContentfulAssetSrc(assets) {
  if (Array.isArray(assets)) {
    return getContentfulAssetSrc(assets[0]);
  }

  return getContentfulAssetSrc(assets);
}

function getEventContent(entry) {
  const fields = entry?.fields || {};
  const numberBlock = Array.isArray(fields.numberBlock)
    ? fields.numberBlock
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            iconSrc: getFirstContentfulAssetSrc(itemFields.images),
            count: itemFields.count || "",
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
          };
        })
        .filter(
          (item) => item.iconSrc || item.count || item.title || item.content,
        )
    : [];
  const eventBox = Array.isArray(fields.eventBox)
    ? fields.eventBox
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            imageSrc: getFirstContentfulAssetSrc(itemFields.images),
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
            buttonText: itemFields.buttonText || "",
            buttonUrl: itemFields.buttonUrl || "",
          };
        })
        .filter(
          (item) =>
            item.imageSrc ||
            item.title ||
            item.content ||
            (item.buttonText && item.buttonUrl),
        )
    : [];

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    introSubHeading: fields.introSubHeading || "",
    introHeading: fields.introHeading || "",
    introDescription: richTextToPlainText(fields.introDescription),
    numberBlock,
    eventSubHeading: fields.eventSubHeading || "",
    eventHeading: fields.eventHeading || "",
    eventBox,
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
  const hasButton = Boolean(event.buttonText && event.buttonUrl);
  const hasIntroSection = Boolean(
    event.introSubHeading ||
      event.introHeading ||
      event.introDescription ||
      event.numberBlock.length,
  );
  const hasEventSection = Boolean(
    event.eventSubHeading || event.eventHeading || event.eventBox.length,
  );

  return (
    <main>
      <section
        className="events-hero"
        style={
          event.bannerImage
            ? { "--events-banner-image": `url(${event.bannerImage})` }
            : undefined
        }
        aria-labelledby={event.bannerHeading ? "events-title" : undefined}
      >
        <SiteHeader header={header} />

        <div className="events-hero-content">
          {event.bannerSubHeading && (
            <p className="events-hero-eyebrow">{event.bannerSubHeading}</p>
          )}
          {event.bannerHeading && (
            <h1 id="events-title">{event.bannerHeading}</h1>
          )}
          {event.bannerContent && <p>{event.bannerContent}</p>}
          {hasButton && (
            <a className="button button--light events-hero-button" href={event.buttonUrl}>
              {event.buttonText}
            </a>
          )}
        </div>
      </section>

      {hasIntroSection && (
        <section className="events-intro-section">
          <div className="events-intro-copy">
            {event.introSubHeading && (
              <p className="events-intro-eyebrow">{event.introSubHeading}</p>
            )}
            {event.introHeading && <h2>{event.introHeading}</h2>}
            {event.introDescription && <p>{event.introDescription}</p>}
          </div>

          {event.numberBlock.length > 0 && (
            <div className="events-intro-grid">
              {event.numberBlock.map((item, index) => (
                <article className="events-intro-card" key={index}>
                  {item.iconSrc && <img src={item.iconSrc} alt="" />}
                  {item.count && <strong>{item.count}</strong>}
                  {item.title && <h3>{item.title}</h3>}
                  {item.content && <p>{item.content}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {hasEventSection && (
        <section className="events-host-section">
          <div className="events-host-header">
            {event.eventSubHeading && (
              <p className="events-host-eyebrow">{event.eventSubHeading}</p>
            )}
            {event.eventHeading && <h2>{event.eventHeading}</h2>}
          </div>

          {event.eventBox.length > 0 && (
            <div className="events-host-grid">
              {event.eventBox.map((item, index) => (
                <article className="events-host-card" key={index}>
                  {item.imageSrc && <img src={item.imageSrc} alt="" />}
                  {item.title && <h3>{item.title}</h3>}
                  {item.content && <p>{item.content}</p>}
                  {item.buttonText && item.buttonUrl && (
                    <a href={item.buttonUrl}>{item.buttonText}</a>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <SiteFooter footer={footer} />
    </main>
  );
}
