import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFirstContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function getAboutContent(entry) {
  const fields = entry?.fields || {};
  const numberBlock = Array.isArray(fields.numberBlock)
    ? fields.numberBlock
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            image: getFirstContentfulImage(itemFields.images),
            value: itemFields.title || "",
            label: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.image?.src || item.value || item.label)
    : [];
  const experienceImages = Array.isArray(fields.experienceImages)
    ? fields.experienceImages
        .map((item) => {
          const itemFields = item?.fields || {};
          const imageAsset = Array.isArray(itemFields.images)
            ? itemFields.images[0]
            : itemFields.images;

          return {
            image: getContentfulImage(imageAsset),
            caption: itemFields.title || "",
          };
        })
        .filter((item) => item.image?.src || item.caption)
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
    villaImage: getContentfulImage(fields.villaImage),
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
    about.villaImage?.src ||
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
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="section page-hero about-hero"
          style={
            about.bannerImage
              ? { "--about-banner-image": `url(${about.bannerImage})` }
              : undefined
          }
          aria-labelledby={about.bannerHeading ? "about-title" : undefined}
        >
          <div className="page-hero-content about-hero-content">
            {about.bannerSubHeading && (
              <p
                className="eyebrow page-hero-eyebrow about-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {about.bannerSubHeading}
              </p>
            )}
            {about.bannerHeading && (
              <h1 id="about-title" data-aos="fade-up" data-aos-delay="50">
                {about.bannerHeading}
              </h1>
            )}
            {about.bannerContent && (
              <p data-aos="fade-up" data-aos-delay="100">
                {about.bannerContent}
              </p>
            )}
            {hasButton && (
              <a
                className="button button--light page-hero-button about-hero-button"
                href={about.buttonUrl}
                data-aos="fade-up"
                data-aos-delay="150"
              >
                {about.buttonText}
              </a>
            )}
          </div>
        </section>

        {hasIntroSection && (
          <section
            className="section about-intro-section"
            aria-labelledby={
              about.introHeading ? "about-intro-title" : undefined
            }
          >
            {about.introSubHeading && (
              <p
                className="eyebrow about-intro-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {about.introSubHeading}
              </p>
            )}

            {about.introHeading && (
              <h2 id="about-intro-title" data-aos="fade-up" data-aos-delay="50">
                {about.introHeading}
              </h2>
            )}

            {about.introDescription && (
              <p
                className="about-intro-description"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {about.introDescription}
              </p>
            )}

            {about.numberBlock.length > 0 && (
              <div
                className="number-block"
                aria-label="Villa highlights"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                {about.numberBlock.map((item, index) => (
                  <div
                    className="number-item"
                    key={`${item.value}-${index}`}
                    data-aos="fade-up"
                    data-aos-delay={String(index * 100)}
                  >
                    {item.image?.src && (
                      <img
                        className="number-icon"
                        src={item.image.src}
                        alt={
                          item.image.alt ||
                          (item.label ? `${item.label} icon` : "")
                        }
                      />
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
            className="section about-villa-section"
            aria-labelledby={
              about.villaHeading ? "about-villa-title" : undefined
            }
          >
            <div className="wrap">
              {about.villaImage?.src && (
                <div
                  className="about-villa-image"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <img
                    src={about.villaImage.src}
                    alt={about.villaImage.alt || "Pattoo Castle villa"}
                  />
                </div>
              )}

              <div
                className="about-villa-content"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {about.villaSubHeading && (
                  <p className="eyebrow about-villa-eyebrow">
                    {about.villaSubHeading}
                  </p>
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
            </div>
          </section>
        )}

        {hasExperienceSection && (
          <section
            className="section about-experience-section"
            aria-labelledby={
              about.experienceHeading ? "about-experience-title" : undefined
            }
          >
            <div className="wrap">
              {about.experienceSubHeading && (
                <p
                  className="eyebrow about-experience-eyebrow"
                  data-aos="fade-up"
                >
                  {about.experienceSubHeading}
                </p>
              )}

              {about.experienceHeading && (
                <h2 id="about-experience-title" data-aos="fade-up">
                  {about.experienceHeading}
                </h2>
              )}

              {about.experienceImages.length > 0 && (
                <div className="about-experience-grid" data-aos="fade-up">
                  {about.experienceImages.map((item, index) => (
                    <figure
                      className="about-experience-card"
                      key={`${item.image?.src || item.caption}-${index}`}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 100)}
                    >
                      <div className="experience-card-content">
                        {item.image?.src && (
                          <img
                            src={item.image.src}
                            alt={
                              item.image.alt ||
                              `Pattoo Castle experience ${index + 1}`
                            }
                          />
                        )}
                        {item.caption && (
                          <figcaption>{item.caption}</figcaption>
                        )}
                      </div>
                    </figure>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {hasCaribbeanLivingSection && (
          <section
            className="section about-living-section"
            aria-labelledby={
              about.caribbeanLivingHeading ? "about-living-title" : undefined
            }
          >
            <div className="wrap">
              {about.caribbeanLivingSubHeading && (
                <p className="eyebrow about-living-eyebrow" data-aos="fade-up">
                  {about.caribbeanLivingSubHeading}
                </p>
              )}

              {about.caribbeanLivingHeading && (
                <h2 id="about-living-title" data-aos="fade-up">
                  {about.caribbeanLivingHeading}
                </h2>
              )}

              {about.caribbeanLivingFacilities.length > 0 && (
                <div className="about-living-grid">
                  {about.caribbeanLivingFacilities.map((item, index) => (
                    <article
                      className="about-living-item"
                      key={`${item.title}-${index}`}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 100)}
                    >
                      {item.title && <h3>{item.title}</h3>}
                      {item.content && <p>{item.content}</p>}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {hasLocationSection && (
          <section
            className="section about-location-section"
            aria-labelledby={
              about.locationHeading ? "about-location-title" : undefined
            }
          >
            <div className="wrap">
              {about.locationSubHeading && (
                <p
                  className="eyebrow about-location-eyebrow"
                  data-aos="fade-up"
                >
                  {about.locationSubHeading}
                </p>
              )}

              {about.locationHeading && (
                <h2
                  id="about-location-title"
                  data-aos="fade-up"
                  data-aos-delay="50"
                >
                  {about.locationHeading}
                </h2>
              )}

              {about.locationContent && (
                <p data-aos="fade-up" data-aos-delay="100">
                  {about.locationContent}
                </p>
              )}

              {hasLocationButton && (
                <a
                  className="button button--brown about-location-button"
                  href={about.locationButtonUrl}
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  {about.locationButtonText}
                </a>
              )}
            </div>
          </section>
        )}

        {hasStorySection && (
          <section
            className="section about-story-section"
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
            <div className="wrap">
              <div className="about-story-content" data-aos="fade-up">
                {about.reserveYourStory.content && (
                  <p className="eyebrow about-story-eyebrow">
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
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
