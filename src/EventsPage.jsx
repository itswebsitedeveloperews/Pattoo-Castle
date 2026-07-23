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

function richTextToListItems(value) {
  if (!value || typeof value !== "object") {
    return [];
  }

  const items = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") {
      return;
    }

    if (node.nodeType === "list-item") {
      const text = richTextToPlainText(node);

      if (text) {
        items.push(text);
      }

      return;
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(walk);
    }
  };

  walk(value);
  return items;
}

function richTextToParagraphText(value) {
  if (!value || typeof value !== "object") {
    return richTextToPlainText(value);
  }

  const paragraphs = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") {
      return;
    }

    if (node.nodeType === "list-item" || node.nodeType === "unordered-list") {
      return;
    }

    if (node.nodeType === "paragraph") {
      const text = richTextToPlainText(node);

      if (text) {
        paragraphs.push(text);
      }

      return;
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(walk);
    }
  };

  walk(value);
  return paragraphs.join(" ");
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
    experienceSubHeading: fields.experienceSubHeading || "",
    experienceHeading: fields.experienceHeading || "",
    experienceContent: richTextToParagraphText(fields.experienceContent),
    experienceListItems: richTextToListItems(fields.experienceContent),
    experienceButtonText: fields.experienceButtonText || "",
    experienceButtonUrl: fields.experienceButtonUrl || "",
    experienceImage: getContentfulAssetSrc(fields.experienceImage),
    planImage: getContentfulAssetSrc(fields.planImage),
    planContent: richTextToPlainText(fields.planContent),
    planButtonText: fields.planButtonText || "",
    planButtonUrl: fields.planButtonUrl || "",
    memoriesSubHeading: fields.memoriesSubHeading || "",
    memoriesHeading: fields.memoriesHeading || "",
    memoriesImages: Array.isArray(fields.memoriesImages)
      ? fields.memoriesImages.map(getContentfulAssetSrc).filter(Boolean)
      : [],
    memoriesButtonText: fields.memoriesButtonText || "",
    memoriesButtonUrl: fields.memoriesButtonUrl || "",
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
  const hasExperienceSection = Boolean(
    event.experienceSubHeading ||
    event.experienceHeading ||
    event.experienceContent ||
    (event.experienceButtonText && event.experienceButtonUrl) ||
    event.experienceImage,
  );
  const hasPlanSection = Boolean(
    event.planImage ||
    event.planContent ||
    (event.planButtonText && event.planButtonUrl),
  );
  const hasMemoriesSection = Boolean(
    event.memoriesSubHeading ||
    event.memoriesHeading ||
    event.memoriesImages.length ||
    (event.memoriesButtonText && event.memoriesButtonUrl),
  );

  return (
    <>
      <SiteHeader header={header} />
      <main>
        <section
          className="section page-hero events-hero"
          style={
            event.bannerImage
              ? { "--events-banner-image": `url(${event.bannerImage})` }
              : undefined
          }
          aria-labelledby={event.bannerHeading ? "events-title" : undefined}
        >
          <div className="wrap">
            <div className="page-hero-content events-hero-content">
              {event.bannerSubHeading && (
                <p className="eyebrow page-hero-eyebrow events-hero-eyebrow">
                  {event.bannerSubHeading}
                </p>
              )}
              {event.bannerHeading && (
                <h1 id="events-title">{event.bannerHeading}</h1>
              )}
              {event.bannerContent && <p>{event.bannerContent}</p>}
              {hasButton && (
                <a
                  className="button button--light page-hero-button events-hero-button"
                  href={event.buttonUrl}
                >
                  {event.buttonText}
                </a>
              )}
            </div>
          </div>
        </section>

        {hasIntroSection && (
          <section className="section events-intro-section">
            <div className="wrap">
              <div className="events-intro-copy">
                {event.introSubHeading && (
                  <p className="eyebrow events-intro-eyebrow">
                    {event.introSubHeading}
                  </p>
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
            </div>
          </section>
        )}

        {hasEventSection && (
          <section className="section events-host-section">
            <div className="wrap">
              <div className="events-host-header">
                {event.eventSubHeading && (
                  <p className="eyebrow events-host-eyebrow">
                    {event.eventSubHeading}
                  </p>
                )}
                {event.eventHeading && <h2>{event.eventHeading}</h2>}
              </div>

              {event.eventBox.length > 0 && (
                <div className="events-host-grid">
                  {event.eventBox.map((item, index) => (
                    <article className="events-host-card" key={index}>
                      {item.imageSrc &&
                        (item.buttonUrl ? (
                          <a
                            className="events-host-card-image-link"
                            href={item.buttonUrl}
                          >
                            <img src={item.imageSrc} alt="" />
                          </a>
                        ) : (
                          <img src={item.imageSrc} alt="" />
                        ))}
                      {item.title &&
                        (item.buttonUrl ? (
                          <h3>
                            <a
                              className="events-host-card-title-link"
                              href={item.buttonUrl}
                            >
                              {item.title}
                            </a>
                          </h3>
                        ) : (
                          <h3>{item.title}</h3>
                        ))}
                      {item.content && <p>{item.content}</p>}
                      {item.buttonText && item.buttonUrl && (
                        <a
                          className="events-host-card-button"
                          href={item.buttonUrl}
                        >
                          {item.buttonText}
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {hasExperienceSection && (
          <section className="section events-experience-section">
            <div className="wrap">
              <div className="events-experience-content">
                {event.experienceSubHeading && (
                  <p className="eyebrow events-experience-eyebrow">
                    {event.experienceSubHeading}
                  </p>
                )}
                {event.experienceHeading && <h2>{event.experienceHeading}</h2>}
                {event.experienceContent && <p>{event.experienceContent}</p>}
                {event.experienceListItems.length > 0 && (
                  <ul>
                    {event.experienceListItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                {event.experienceButtonText && event.experienceButtonUrl && (
                  <a
                    className="button button--brown events-experience-button"
                    href={event.experienceButtonUrl}
                  >
                    {event.experienceButtonText}
                  </a>
                )}
              </div>

              {event.experienceImage && (
                <figure className="events-experience-image">
                  <img src={event.experienceImage} alt="" />
                </figure>
              )}
            </div>
          </section>
        )}

        {hasPlanSection && (
          <section
            className="section events-plan-section"
            style={
              event.planImage
                ? { "--events-plan-image": `url(${event.planImage})` }
                : undefined
            }
          >
            <div className="wrap">
              <div className="events-plan-content">
                {event.planContent && (
                  <blockquote>{event.planContent}</blockquote>
                )}
                {event.planButtonText && event.planButtonUrl && (
                  <a
                    className="button button--light events-plan-button"
                    href={event.planButtonUrl}
                  >
                    {event.planButtonText}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {hasMemoriesSection && (
          <section className="section events-memories-section">
            <div className="wrap">
              <div className="events-memories-header">
                {event.memoriesSubHeading && (
                  <p className="eyebrow events-memories-eyebrow">
                    {event.memoriesSubHeading}
                  </p>
                )}
                {event.memoriesHeading && <h2>{event.memoriesHeading}</h2>}
              </div>

              {event.memoriesImages.length > 0 && (
                <div className="events-memories-grid">
                  {event.memoriesImages.map((imageSrc, index) => (
                    <figure
                      className="events-memories-image"
                      key={`${imageSrc}-${index}`}
                    >
                      <img src={imageSrc} alt="" />
                    </figure>
                  ))}
                </div>
              )}

              {event.memoriesButtonText && event.memoriesButtonUrl && (
                <a
                  className="button button--brown events-memories-button"
                  href={event.memoriesButtonUrl}
                >
                  {event.memoriesButtonText}
                </a>
              )}
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
