import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  SiteFooter,
  SiteHeader,
} from "./App";

function getAboutContent(entry) {
  const fields = entry?.fields || {};
  const numberBlock = Array.isArray(fields.numberBlock)
    ? fields.numberBlock
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            imageSrc: getContentfulAssetSrc(
              Array.isArray(itemFields.images)
                ? itemFields.images[0]
                : itemFields.images,
            ),
            value: itemFields.title || "",
            label: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.imageSrc || item.value || item.label)
    : [];
  const experienceImages = Array.isArray(fields.experienceImages)
    ? fields.experienceImages
        .map((item) => {
          const itemFields = item?.fields || {};
          const imageAsset = Array.isArray(itemFields.images)
            ? itemFields.images[0]
            : itemFields.images;

          return {
            imageSrc: getContentfulAssetSrc(imageAsset),
            caption: itemFields.title || "",
          };
        })
        .filter((item) => item.imageSrc || item.caption)
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
  const reserveYourStoryFields = fields.reserveYourStory?.fields || {};
  const reserveYourStoryImage = Array.isArray(reserveYourStoryFields.images)
    ? reserveYourStoryFields.images[0]
    : reserveYourStoryFields.images;
  const reserveYourStory = {
    imageSrc: getContentfulAssetSrc(reserveYourStoryImage),
    title: reserveYourStoryFields.title || "",
    content: richTextToPlainText(reserveYourStoryFields.content),
    buttonText: reserveYourStoryFields.buttonText || "",
    buttonUrl: reserveYourStoryFields.buttonUrl || "",
  };

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
    villaImage: getContentfulAssetSrc(fields.villaImage),
    villaSubHeading: fields.villaSubHeading || "",
    villaHeading: fields.villaHeading || "",
    villaContent: richTextToPlainText(fields.villaContent),
    villaButtonText: fields.villaButtonText || "",
    villaButtonUrl: fields.villaButtonUrl || "",
    experienceSubHeading: fields.experienceSubHeading || "",
    experienceHeading: fields.experienceHeading || "",
    experienceImages,
    caribbeanLivingSubHeading: fields.caribbeanLivingSubHeading || "",
    caribbeanLivingHeading: fields.caribbeanLivingHeading || "",
    caribbeanLivingFacilities,
    locationSubHeading: fields.locationSubHeading || "",
    locationHeading: fields.locationHeading || "",
    locationContent: richTextToPlainText(fields.locationContent),
    locationButtonText: fields.locationButtonText || "",
    locationButtonUrl: fields.locationButtonUrl || "",
    reserveYourStory,
  };
}

export default function AboutPage({
  aboutEntry = null,
  footerEntry = null,
  headerEntry = null,
}) {
  const about = getAboutContent(aboutEntry);
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const hasButton = Boolean(about.buttonText && about.buttonUrl);
  const hasIntroSection = Boolean(
    about.introSubHeading ||
      about.introHeading ||
      about.introDescription ||
      about.numberBlock.length,
  );
  const hasVillaButton = Boolean(about.villaButtonText && about.villaButtonUrl);
  const hasVillaSection = Boolean(
    about.villaImage ||
      about.villaSubHeading ||
      about.villaHeading ||
      about.villaContent ||
      hasVillaButton,
  );
  const hasExperienceSection = Boolean(
    about.experienceSubHeading ||
      about.experienceHeading ||
      about.experienceImages.length,
  );
  const hasCaribbeanLivingSection = Boolean(
    about.caribbeanLivingSubHeading ||
      about.caribbeanLivingHeading ||
      about.caribbeanLivingFacilities.length,
  );
  const hasLocationButton = Boolean(
    about.locationButtonText && about.locationButtonUrl,
  );
  const hasLocationSection = Boolean(
    about.locationSubHeading ||
      about.locationHeading ||
      about.locationContent ||
      hasLocationButton,
  );
  const hasStoryButton = Boolean(
    about.reserveYourStory.buttonText && about.reserveYourStory.buttonUrl,
  );
  const hasStorySection = Boolean(
    about.reserveYourStory.imageSrc ||
      about.reserveYourStory.title ||
      about.reserveYourStory.content ||
      hasStoryButton,
  );

  return (
    <main>
      <section
        className="about-hero"
        style={
          about.bannerImage
            ? { "--about-banner-image": `url(${about.bannerImage})` }
            : undefined
        }
        aria-labelledby={about.bannerHeading ? "about-title" : undefined}
      >
        <SiteHeader header={header} />

        <div className="about-hero-content">
          {about.bannerSubHeading && (
            <p className="about-hero-eyebrow">{about.bannerSubHeading}</p>
          )}
          {about.bannerHeading && <h1 id="about-title">{about.bannerHeading}</h1>}
          {about.bannerContent && <p>{about.bannerContent}</p>}
          {hasButton && (
            <a className="button button--light about-hero-button" href={about.buttonUrl}>
              {about.buttonText}
            </a>
          )}
        </div>
      </section>

      {hasIntroSection && (
        <section
          className="about-intro-section"
          aria-labelledby={about.introHeading ? "about-intro-title" : undefined}
        >
          {about.introSubHeading && (
            <p className="about-intro-eyebrow">{about.introSubHeading}</p>
          )}

          {about.introHeading && (
            <h2 id="about-intro-title">{about.introHeading}</h2>
          )}

          {about.introDescription && (
            <p className="about-intro-description">
              {about.introDescription}
            </p>
          )}

          {about.numberBlock.length > 0 && (
            <div className="about-number-block" aria-label="Villa highlights">
              {about.numberBlock.map((item, index) => (
                <div
                  className="about-number-item"
                  key={`${item.value}-${index}`}
                >
                  {item.imageSrc && (
                    <img className="about-number-icon" src={item.imageSrc} alt="" />
                  )}
                  {item.value && <strong>{item.value}</strong>}
                  {item.label && <span>{item.label}</span>}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {hasVillaSection && (
        <section
          className="about-villa-section"
          aria-labelledby={about.villaHeading ? "about-villa-title" : undefined}
        >
          {about.villaImage && (
            <div className="about-villa-image">
              <img src={about.villaImage} alt="" />
            </div>
          )}

          <div className="about-villa-content">
            {about.villaSubHeading && (
              <p className="about-villa-eyebrow">{about.villaSubHeading}</p>
            )}

            {about.villaHeading && (
              <h2 id="about-villa-title">{about.villaHeading}</h2>
            )}

            {about.villaContent && <p>{about.villaContent}</p>}

            {hasVillaButton && (
              <a
                className="button button--brown about-villa-button"
                href={about.villaButtonUrl}
              >
                {about.villaButtonText}
              </a>
            )}
          </div>
        </section>
      )}

      {hasExperienceSection && (
        <section
          className="about-experience-section"
          aria-labelledby={
            about.experienceHeading ? "about-experience-title" : undefined
          }
        >
          {about.experienceSubHeading && (
            <p className="about-experience-eyebrow">
              {about.experienceSubHeading}
            </p>
          )}

          {about.experienceHeading && (
            <h2 id="about-experience-title">{about.experienceHeading}</h2>
          )}

          {about.experienceImages.length > 0 && (
            <div className="about-experience-grid">
              {about.experienceImages.map((item, index) => (
                <figure
                  className="about-experience-card"
                  key={`${item.imageSrc}-${index}`}
                >
                  {item.imageSrc && <img src={item.imageSrc} alt="" />}
                  {item.caption && <figcaption>{item.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
        </section>
      )}

      {hasCaribbeanLivingSection && (
        <section
          className="about-living-section"
          aria-labelledby={
            about.caribbeanLivingHeading ? "about-living-title" : undefined
          }
        >
          {about.caribbeanLivingSubHeading && (
            <p className="about-living-eyebrow">
              {about.caribbeanLivingSubHeading}
            </p>
          )}

          {about.caribbeanLivingHeading && (
            <h2 id="about-living-title">{about.caribbeanLivingHeading}</h2>
          )}

          {about.caribbeanLivingFacilities.length > 0 && (
            <div className="about-living-grid">
              {about.caribbeanLivingFacilities.map((item, index) => (
                <article
                  className="about-living-item"
                  key={`${item.title}-${index}`}
                >
                  {item.title && <h3>{item.title}</h3>}
                  {item.content && <p>{item.content}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {hasLocationSection && (
        <section
          className="about-location-section"
          aria-labelledby={
            about.locationHeading ? "about-location-title" : undefined
          }
        >
          {about.locationSubHeading && (
            <p className="about-location-eyebrow">
              {about.locationSubHeading}
            </p>
          )}

          {about.locationHeading && (
            <h2 id="about-location-title">{about.locationHeading}</h2>
          )}

          {about.locationContent && <p>{about.locationContent}</p>}

          {hasLocationButton && (
            <a
              className="button button--brown about-location-button"
              href={about.locationButtonUrl}
            >
              {about.locationButtonText}
            </a>
          )}
        </section>
      )}

      {hasStorySection && (
        <section
          className="about-story-section"
          style={
            about.reserveYourStory.imageSrc
              ? {
                  "--about-story-image": `url(${about.reserveYourStory.imageSrc})`,
                }
              : undefined
          }
          aria-labelledby={
            about.reserveYourStory.title ? "about-story-title" : undefined
          }
        >
          <div className="about-story-content">
            {about.reserveYourStory.content && (
              <p className="about-story-eyebrow">
                {about.reserveYourStory.content}
              </p>
            )}

            {about.reserveYourStory.title && (
              <h2 id="about-story-title">{about.reserveYourStory.title}</h2>
            )}

            {hasStoryButton && (
              <a
                className="button button--light about-story-button"
                href={about.reserveYourStory.buttonUrl}
              >
                {about.reserveYourStory.buttonText}
              </a>
            )}
          </div>
        </section>
      )}

      <SiteFooter footer={footer} />
    </main>
  );
}
