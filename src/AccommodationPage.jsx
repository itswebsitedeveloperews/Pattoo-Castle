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

function getAccommodationContent(entry) {
  const fields = entry?.fields || {};
  const introBox = Array.isArray(fields.introBox)
    ? fields.introBox
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            iconSrc: getFirstContentfulAssetSrc(itemFields.images),
            value: itemFields.count || "",
            label: itemFields.title || "",
            description: richTextToPlainText(itemFields.content),
          };
        })
        .filter(
          (item) =>
            item.iconSrc || item.value || item.label || item.description,
        )
    : [];
  const roomBox = Array.isArray(fields.roomBox)
    ? fields.roomBox
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            imageSrc: getFirstContentfulAssetSrc(itemFields.images),
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.imageSrc || item.title || item.content)
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
    introBox,
    roomSubHeading: fields.roomSubHeading || "",
    roomHeading: fields.roomHeading || "",
    roomContent: richTextToPlainText(fields.roomContent),
    roomButtonText: fields.roomButtonText || "",
    roomButtonUrl: fields.roomButtonUrl || "",
    roomBox,
  };
}

export default function AccommodationPage({
  accommodationEntry = null,
  footerEntry = null,
  headerEntry = null,
}) {
  const accommodation = getAccommodationContent(accommodationEntry);
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const hasButton = Boolean(accommodation.buttonText && accommodation.buttonUrl);
  const hasIntroSection = Boolean(
    accommodation.introSubHeading ||
      accommodation.introHeading ||
      accommodation.introDescription ||
      accommodation.introBox.length,
  );
  const hasRoomButton = Boolean(
    accommodation.roomButtonText && accommodation.roomButtonUrl,
  );
  const hasRoomsSection = Boolean(
    accommodation.roomSubHeading ||
      accommodation.roomHeading ||
      accommodation.roomContent ||
      hasRoomButton ||
      accommodation.roomBox.length,
  );

  return (
    <main>
      <section
        className="accommodation-hero"
        style={
          accommodation.bannerImage
            ? {
                "--accommodation-banner-image": `url(${accommodation.bannerImage})`,
              }
            : undefined
        }
        aria-labelledby={
          accommodation.bannerHeading ? "accommodation-title" : undefined
        }
      >
        <SiteHeader header={header} />

        <div className="accommodation-hero-content">
          {accommodation.bannerSubHeading && (
            <p className="accommodation-hero-eyebrow">
              {accommodation.bannerSubHeading}
            </p>
          )}
          {accommodation.bannerHeading && (
            <h1 id="accommodation-title">{accommodation.bannerHeading}</h1>
          )}
          {accommodation.bannerContent && <p>{accommodation.bannerContent}</p>}
          {hasButton && (
            <a
              className="button button--light accommodation-hero-button"
              href={accommodation.buttonUrl}
            >
              {accommodation.buttonText}
            </a>
          )}
        </div>
      </section>

      {hasIntroSection && (
        <section
          className="accommodation-intro-section"
          aria-labelledby={
            accommodation.introHeading ? "accommodation-intro-title" : undefined
          }
        >
          <div className="accommodation-intro-header">
            <div>
              {accommodation.introSubHeading && (
                <p className="accommodation-intro-eyebrow">
                  {accommodation.introSubHeading}
                </p>
              )}
              {accommodation.introHeading && (
                <h2 id="accommodation-intro-title">
                  {accommodation.introHeading}
                </h2>
              )}
            </div>

            {accommodation.introDescription && (
              <p className="accommodation-intro-description">
                {accommodation.introDescription}
              </p>
            )}
          </div>

          {accommodation.introBox.length > 0 && (
            <div className="accommodation-intro-grid">
              {accommodation.introBox.map((item, index) => (
                <article
                  className="accommodation-intro-item"
                  key={`${item.value}-${item.label}-${index}`}
                >
                  {item.iconSrc && (
                    <img
                      className="accommodation-intro-icon"
                      src={item.iconSrc}
                      alt=""
                    />
                  )}
                  {item.value && <strong>{item.value}</strong>}
                  {item.label && <span>{item.label}</span>}
                  {item.description && <p>{item.description}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {hasRoomsSection && (
        <section
          className="accommodation-rooms-section"
          aria-labelledby={
            accommodation.roomHeading ? "accommodation-rooms-title" : undefined
          }
        >
          <div className="accommodation-rooms-header">
            {accommodation.roomSubHeading && (
              <p className="accommodation-rooms-eyebrow">
                {accommodation.roomSubHeading}
              </p>
            )}
            {accommodation.roomHeading && (
              <h2 id="accommodation-rooms-title">
                {accommodation.roomHeading}
              </h2>
            )}
            {accommodation.roomContent && <p>{accommodation.roomContent}</p>}
            {hasRoomButton && (
              <a
                className="button button--brown accommodation-rooms-button"
                href={accommodation.roomButtonUrl}
              >
                {accommodation.roomButtonText}
              </a>
            )}
          </div>

          {accommodation.roomBox.length > 0 && (
            <div className="accommodation-rooms-grid">
              {accommodation.roomBox.map((item, index) => (
                <article
                  className="accommodation-room-card"
                  key={`${item.title}-${index}`}
                >
                  {item.imageSrc && <img src={item.imageSrc} alt="" />}
                  {item.title && <h3>{item.title}</h3>}
                  {item.content && <p>{item.content}</p>}
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
