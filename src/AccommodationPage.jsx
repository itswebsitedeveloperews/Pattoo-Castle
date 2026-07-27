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

function getAccommodationContent(entry) {
  const fields = entry?.fields || {};
  const introBox = Array.isArray(fields.introBox)
    ? fields.introBox
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            icon: getFirstContentfulImage(itemFields.images),
            value: itemFields.count || "",
            label: itemFields.title || "",
            description: richTextToPlainText(itemFields.content),
          };
        })
        .filter(
          (item) =>
            item.icon?.src || item.value || item.label || item.description,
        )
    : [];
  const roomBox = Array.isArray(fields.roomBox)
    ? fields.roomBox
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            image: getFirstContentfulImage(itemFields.images),
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.image?.src || item.title || item.content)
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
    memoriesImage: getFirstContentfulImage(fields.memoriesImage),
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
    accommodation.memoriesImage?.src,
  );
  const hasCaribbeanLivingSection = Boolean(
    accommodation.caribbeanLivingSubHeading ||
    accommodation.caribbeanLivingHeading ||
    accommodation.caribbeanLivingFacilities.length,
  );

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
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
              <p
                className="eyebrow page-hero-eyebrow accommodation-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {accommodation.bannerSubHeading}
              </p>
            )}
            {accommodation.bannerHeading && (
              <h1
                id="accommodation-title"
                data-aos="fade-up"
                data-aos-delay="60"
              >
                {accommodation.bannerHeading}
              </h1>
            )}
            {accommodation.bannerContent && (
              <p data-aos="fade-up" data-aos-delay="100">
                {accommodation.bannerContent}
              </p>
            )}
            {hasButton && (
              <a
                className="button button--light page-hero-button accommodation-hero-button"
                href={accommodation.buttonUrl}
                data-aos="fade-up"
                data-aos-delay="150"
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
                <div data-aos="fade-up" data-aos-delay="50">
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
                  <p
                    className="accommodation-intro-description"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
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
                      data-aos="fade-up"
                      data-aos-delay={String(index * 100)}
                    >
                      {item.icon?.src && (
                        <img
                          className="accommodation-intro-icon"
                          src={item.icon.src}
                          alt={item.icon.alt || (item.label ? `${item.label} icon` : "")}
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
              <div className="accommodation-rooms-header" data-aos="fade-up">
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
                      data-aos="fade-up"
                      data-aos-delay={String(index * 100)}
                    >
                      {item.image?.src && (
                        <img
                          src={item.image.src}
                          alt={item.image.alt || `Pattoo Castle accommodation ${index + 1}`}
                        />
                      )}
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
              <div
                className="accommodation-memories-content"
                data-aos="fade-up"
                data-aos-delay="100"
              >
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

              {accommodation.memoriesImage?.src && (
                <div
                  className="accommodation-memories-image"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <img
                    src={accommodation.memoriesImage.src}
                    alt={accommodation.memoriesImage.alt || "Pattoo Castle guest memories"}
                  />
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
                <p
                  className="eyebrow accommodation-living-eyebrow"
                  data-aos="fade-up"
                >
                  {accommodation.caribbeanLivingSubHeading}
                </p>
              )}

              {accommodation.caribbeanLivingHeading && (
                <h2 id="accommodation-living-title" data-aos="fade-up">
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
                        data-aos="fade-up"
                        data-aos-delay={String(index * 100)}
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
