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
  const caribbeanLivingFacilities = Array.isArray(
    fields.caribbeanLivingFacilities,
  )
    ? fields.caribbeanLivingFacilities
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.title || item.content)
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
    memoriesSubHeading: fields.memoriesSubHeading || "",
    memoriesHeading: fields.memoriesHeading || "",
    memoriesContent: richTextToPlainText(fields.memoriesContent),
    memoriesButtonText: fields.memoriesButtonText || "",
    memoriesButtonUrl: fields.memoriesButtonUrl || "",
    memoriesImage: getContentfulAssetSrc(fields.memoriesImage),
    caribbeanLivingSubHeading: fields.caribbeanLivingSubHeading || "",
    caribbeanLivingHeading: fields.caribbeanLivingHeading || "",
    caribbeanLivingFacilities,
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
  const hasButton = Boolean(
    accommodation.buttonText && accommodation.buttonUrl,
  );
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
  const hasMemoriesButton = Boolean(
    accommodation.memoriesButtonText && accommodation.memoriesButtonUrl,
  );
  const hasMemoriesSection = Boolean(
    accommodation.memoriesSubHeading ||
    accommodation.memoriesHeading ||
    accommodation.memoriesContent ||
    hasMemoriesButton ||
    accommodation.memoriesImage,
  );
  const hasCaribbeanLivingSection = Boolean(
    accommodation.caribbeanLivingSubHeading ||
    accommodation.caribbeanLivingHeading ||
    accommodation.caribbeanLivingFacilities.length,
  );

  return (
    <>
      <SiteHeader header={header} />
      <main>
        <section
          className="page-hero accommodation-hero"
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
          <div className="page-hero-content accommodation-hero-content">
            {accommodation.bannerSubHeading && (
              <p className="eyebrow page-hero-eyebrow accommodation-hero-eyebrow">
                {accommodation.bannerSubHeading}
              </p>
            )}
            {accommodation.bannerHeading && (
              <h1 id="accommodation-title">{accommodation.bannerHeading}</h1>
            )}
            {accommodation.bannerContent && (
              <p>{accommodation.bannerContent}</p>
            )}
            {hasButton && (
              <a
                className="button button--light page-hero-button accommodation-hero-button"
                href={accommodation.buttonUrl}
              >
                {accommodation.buttonText}
              </a>
            )}
          </div>
        </section>

        {hasIntroSection && (
          <section
            className="section accommodation-intro-section"
            aria-labelledby={
              accommodation.introHeading
                ? "accommodation-intro-title"
                : undefined
            }
          >
            <div className="wrap">
              <div className="accommodation-intro-header">
                <div>
                  {accommodation.introSubHeading && (
                    <p className="eyebrow accommodation-intro-eyebrow">
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
            </div>
          </section>
        )}

        {hasRoomsSection && (
          <section
            className="section accommodation-rooms-section"
            aria-labelledby={
              accommodation.roomHeading
                ? "accommodation-rooms-title"
                : undefined
            }
          >
            <div className="wrap">
              <div className="accommodation-rooms-header">
                {accommodation.roomSubHeading && (
                  <p className="eyebrow accommodation-rooms-eyebrow">
                    {accommodation.roomSubHeading}
                  </p>
                )}
                {accommodation.roomHeading && (
                  <h2 id="accommodation-rooms-title">
                    {accommodation.roomHeading}
                  </h2>
                )}
                {accommodation.roomContent && (
                  <p>{accommodation.roomContent}</p>
                )}
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
            </div>
          </section>
        )}

        {hasMemoriesSection && (
          <section
            className="section accommodation-memories-section"
            aria-labelledby={
              accommodation.memoriesHeading
                ? "accommodation-memories-title"
                : undefined
            }
          >
            <div className="wrap">
              <div className="accommodation-memories-content">
                {accommodation.memoriesSubHeading && (
                  <p className="eyebrow accommodation-memories-eyebrow">
                    {accommodation.memoriesSubHeading}
                  </p>
                )}
                {accommodation.memoriesHeading && (
                  <h2 id="accommodation-memories-title">
                    {accommodation.memoriesHeading}
                  </h2>
                )}
                {accommodation.memoriesContent && (
                  <p>{accommodation.memoriesContent}</p>
                )}
                {hasMemoriesButton && (
                  <a
                    className="button button--brown accommodation-memories-button"
                    href={accommodation.memoriesButtonUrl}
                  >
                    {accommodation.memoriesButtonText}
                  </a>
                )}
              </div>

              {accommodation.memoriesImage && (
                <div className="accommodation-memories-image">
                  <img src={accommodation.memoriesImage} alt="" />
                </div>
              )}
            </div>
          </section>
        )}

        {hasCaribbeanLivingSection && (
          <section
            className="section accommodation-living-section"
            aria-labelledby={
              accommodation.caribbeanLivingHeading
                ? "accommodation-living-title"
                : undefined
            }
          >
            <div className="wrap">
              {accommodation.caribbeanLivingSubHeading && (
                <p className="eyebrow accommodation-living-eyebrow">
                  {accommodation.caribbeanLivingSubHeading}
                </p>
              )}

              {accommodation.caribbeanLivingHeading && (
                <h2 id="accommodation-living-title">
                  {accommodation.caribbeanLivingHeading}
                </h2>
              )}

              {accommodation.caribbeanLivingFacilities.length > 0 && (
                <div className="accommodation-living-grid">
                  {accommodation.caribbeanLivingFacilities.map(
                    (item, index) => (
                      <article
                        className="accommodation-living-item"
                        key={`${item.title}-${index}`}
                      >
                        {item.title && <h3>{item.title}</h3>}
                        {item.content && <p>{item.content}</p>}
                      </article>
                    ),
                  )}
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
