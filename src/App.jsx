import AosInitializer from "./AosInitializer";
import AmenitiesSlider from "./AmenitiesSlider";
import GalleryPreviewSlider from "./GalleryPreviewSlider";
import ReserveStaySection from "./ReserveStaySection";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import heroImage from "./assets/hero.png";
import logo from "./assets/patto-logo.svg";

const navItems = [
  "Accommodation",
  "Overview",
  "Gallery",
  "Stay",
  "Events",
  "Explore Negril",
];

export function richTextToPlainText(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(richTextToPlainText).filter(Boolean).join(" ");
  }

  if (typeof value === "object") {
    if (typeof value.value === "string") {
      return value.value;
    }

    return richTextToPlainText(value.content);
  }

  return "";
}

export function richTextToReact(value, keyPrefix = "rich-text") {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      richTextToReact(item, `${keyPrefix}-${index}`),
    );
  }

  if (typeof value !== "object") {
    return null;
  }

  if (typeof value.value === "string") {
    return value.value;
  }

  const children = richTextToReact(value.content, `${keyPrefix}-content`);

  switch (value.nodeType) {
    case "document":
      return children;
    case "paragraph":
      return <p key={keyPrefix}>{children}</p>;
    case "heading-1":
      return <h1 key={keyPrefix}>{children}</h1>;
    case "heading-2":
      return <h2 key={keyPrefix}>{children}</h2>;
    case "heading-3":
      return <h3 key={keyPrefix}>{children}</h3>;
    case "heading-4":
      return <h4 key={keyPrefix}>{children}</h4>;
    case "heading-5":
      return <h5 key={keyPrefix}>{children}</h5>;
    case "heading-6":
      return <h6 key={keyPrefix}>{children}</h6>;
    case "unordered-list":
      return <ul key={keyPrefix}>{children}</ul>;
    case "ordered-list":
      return <ol key={keyPrefix}>{children}</ol>;
    case "list-item":
      return <li key={keyPrefix}>{children}</li>;
    case "blockquote":
      return <blockquote key={keyPrefix}>{children}</blockquote>;
    case "hr":
      return <hr key={keyPrefix} />;
    case "hyperlink":
      return (
        <a href={value.data?.uri || "#"} key={keyPrefix}>
          {children}
        </a>
      );
    default:
      return children;
  }
}

function getHomePageContent(entry) {
  const fields = entry?.fields || {};
  const amenitiesItems = Array.isArray(fields.amenitiesItems)
    ? fields.amenitiesItems
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
            image: getFirstContentfulImage(itemFields.images),
          };
        })
        .filter((item) => item.title || item.content || item.image?.src)
    : [];
  const exploreExperiences = Array.isArray(fields.exploreExperiences)
    ? fields.exploreExperiences
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            image: getFirstContentfulImage(itemFields.images),
            title: itemFields.title || "",
            content: richTextToPlainText(itemFields.content),
            buttonText: itemFields.buttonText || "",
            buttonUrl: itemFields.buttonUrl || "",
          };
        })
        .filter(
          (item) =>
            item.image?.src ||
            item.title ||
            item.content ||
            (item.buttonText && item.buttonUrl),
        )
    : [];
  const featuredQuoteFields = fields.featuredQuote?.fields || {};
  const featuredQuote = {
    quote: featuredQuoteFields.title || "",
    credit: richTextToPlainText(featuredQuoteFields.content),
  };
  const galleryImages = Array.isArray(fields.galleryImages)
    ? fields.galleryImages
        .map((asset) => getContentfulImage(asset))
        .filter((image) => image?.src)
    : [];
  const reserveYourStayDateFields = fields.reserveYourStayDate?.fields || {};
  const reserveYourStayDate = {
    logo: getFirstContentfulImage(reserveYourStayDateFields.images),
    title: reserveYourStayDateFields.title || "",
    content: richTextToPlainText(reserveYourStayDateFields.content),
    buttonText: reserveYourStayDateFields.buttonText || "",
    buttonUrl: reserveYourStayDateFields.buttonUrl || "",
  };
  const eventCards = Array.isArray(fields.eventCards)
    ? fields.eventCards
        .map((asset) => getContentfulImage(asset))
        .filter((image) => image?.src)
    : [];
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

  return {
    heroHeading: fields.heroHeading || "",
    heroLeftText: fields.heroLeftText || "",
    heroRightText: fields.heroRightText || "",
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    button2Text: richTextToPlainText(fields.button2Text),
    button2Url: fields.button2Url || "",
    introLogo: getContentfulImage(fields.introLogo),
    introHeading: fields.introHeading || "",
    introDescription: richTextToPlainText(fields.introDescription),
    numberBlock,
    introImage: getContentfulImage(fields.introImage),
    eventSectionHeading: fields.eventSectionHeading || "",
    eventSectionHighlight: fields.eventSectionHighlight || "",
    eventCards,
    eventButtonText: fields.eventButtonText || "",
    eventButtonUrl: fields.eventButtonUrl || "",
    amenitiesEyebrow: fields.amenitiesEyebrow || "",
    amenitiesHeading: fields.amenitiesHeading || "",
    amenitiesItems,
    caribbeanLivingImage: getContentfulImage(fields.caribbeanLivingImage),
    caribbeanLivingTitle: fields.caribbeanLivingTitle || "",
    caribbeanLivingContent: richTextToPlainText(fields.caribbeanLivingContent),
    caribbeanLivingButtonText: fields.caribbeanLivingButtonText || "",
    caribbeanLivingButtonUrl: fields.caribbeanLivingButtonUrl || "",
    caribbeanLivingButton2Text: fields.caribbeanLivingButton2Text || "",
    caribbeanLivingButton2Url: fields.caribbeanLivingButton2Url || "",
    exploreExperiences,
    featuredQuote,
    galleryImages,
    galleryTitle: fields.galleryTitle || "",
    galleryButtonText: fields.galleryButtonText || "",
    galleryButtonUrl: fields.galleryButtonUrl || "",
    reserveYourStayImage: getContentfulImage(fields.reserveYourStayImage),
    reserveYourStayVideo: getContentfulAssetSrc(fields.reserveYourStayVideo),
    reserveYourStayDate,
  };
}

export function getAssetSrc(asset) {
  return typeof asset === "string" ? asset : asset.src;
}

export function getContentfulAssetSrc(asset) {
  const url = asset?.fields?.file?.url;

  if (!url) {
    return "";
  }

  return url.startsWith("//") ? `https:${url}` : url;
}

function formatAssetName(value) {
  if (!value) {
    return "";
  }

  return value
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getContentfulAssetAlt(asset) {
  return (
    asset?.fields?.title ||
    asset?.fields?.description ||
    formatAssetName(asset?.fields?.file?.fileName)
  );
}

export function getContentfulImage(asset) {
  const src = getContentfulAssetSrc(asset);

  if (!src) {
    return null;
  }

  return {
    src,
    alt: getContentfulAssetAlt(asset),
  };
}

export function getFirstContentfulImage(assets) {
  if (Array.isArray(assets)) {
    return getContentfulImage(assets[0]);
  }

  return getContentfulImage(assets);
}

export function getFooterContent(entry) {
  const fields = entry?.fields || {};
  const socialLinks = [
    fields.facebookLink
      ? {
          icon: {
            src: "/footer-facebook.svg",
            alt: "Facebook",
          },
          label: "Pattoo Castle Facebook",
          url: fields.facebookLink,
        }
      : null,
    fields.instagramLink
      ? {
          icon: {
            src: "/footer-instagram.svg",
            alt: "Instagram",
          },
          label: "Pattoo Castle Instagram",
          url: fields.instagramLink,
        }
      : null,
    fields.linkdinLink
      ? {
          icon: {
            src: "/footer-linkedin.svg",
            alt: "LinkedIn",
          },
          label: "Pattoo Castle LinkedIn",
          url: fields.linkdinLink,
        }
      : null,
    fields.twitterLink
      ? {
          icon: {
            src: "/footer-twitter.svg",
            alt: "X",
          },
          label: "Pattoo Castle X",
          url: fields.twitterLink,
        }
      : null,
  ].filter(Boolean);
  const menuItems = Array.isArray(fields.footerMenu)
    ? fields.footerMenu
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            name: itemFields.menuName || "",
            url: itemFields.menuUrl || "",
          };
        })
        .filter((item) => item.name || item.url)
    : [];

  return {
    logo: getContentfulImage(fields.footerLogo),
    location: fields.location || "",
    phone: fields.phone || "",
    email: fields.email || "",
    socialLinks,
    menuItems,
    copyright: fields.footerCopyright || "",
    designBy: richTextToPlainText(fields.designBy),
    designByRichText: fields.designBy || null,
    footerBarMenu: fields.footerBarMenu || "",
    footerBarUrl: fields.footerBarUrl || "",
  };
}

export function getHeaderContent(entry) {
  const fields = entry?.fields || {};
  const menuItems = Array.isArray(fields.menu)
    ? fields.menu
        .map((item) => {
          const itemFields = item?.fields || {};
          const subMenuItems = Array.isArray(itemFields.subMenu)
            ? itemFields.subMenu
                .map((subItem) => {
                  const subItemFields = subItem?.fields || {};

                  return {
                    name: subItemFields.menuName || "",
                    url: subItemFields.menuUrl || "",
                  };
                })
                .filter((subItem) => subItem.name || subItem.url)
            : [];

          return {
            name: itemFields.menuName || "",
            url: itemFields.menuUrl || "",
            subMenuItems,
          };
        })
        .filter((item) => item.name || item.url || item.subMenuItems.length)
    : [];
  const socialLinks = [
    fields.facebookLink
      ? {
          icon: {
            src: "/facebook.svg",
            alt: "Facebook",
          },
          label: "Pattoo Castle Facebook",
          url: fields.facebookLink,
        }
      : null,
    fields.instagramLink
      ? {
          icon: {
            src: "/instagram.svg",
            alt: "Instagram",
          },
          label: "Pattoo Castle Instagram",
          url: fields.instagramLink,
        }
      : null,
  ].filter(Boolean);

  return {
    logo: getContentfulImage(fields.logo),
    menuItems,
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    socialLinks,
  };
}

function App({ footerEntry = null, headerEntry = null, homePageEntry = null }) {
  const homePage = getHomePageContent(homePageEntry);
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const hasPrimaryButton = Boolean(homePage.buttonText && homePage.buttonUrl);
  const hasSecondaryButton = Boolean(
    homePage.button2Text && homePage.button2Url,
  );
  const hasIntroSection = Boolean(
    homePage.introLogo ||
    homePage.introHeading ||
    homePage.introDescription ||
    homePage.numberBlock.length ||
    homePage.introImage?.src,
  );
  const hasEventButton = Boolean(
    homePage.eventButtonText && homePage.eventButtonUrl,
  );
  const hasEventSection = Boolean(
    homePage.eventSectionHeading ||
    homePage.eventSectionHighlight ||
    homePage.eventCards.length ||
    hasEventButton,
  );
  const hasAmenitiesSection = Boolean(
    homePage.amenitiesEyebrow ||
    homePage.amenitiesHeading ||
    homePage.amenitiesItems.length,
  );
  const hasCaribbeanLivingButton = Boolean(
    homePage.caribbeanLivingButtonText && homePage.caribbeanLivingButtonUrl,
  );
  const hasCaribbeanLivingButton2 = Boolean(
    homePage.caribbeanLivingButton2Text && homePage.caribbeanLivingButton2Url,
  );
  const hasCaribbeanLivingSection = Boolean(
    homePage.caribbeanLivingImage?.src ||
    homePage.caribbeanLivingTitle ||
    homePage.caribbeanLivingContent ||
    hasCaribbeanLivingButton ||
    hasCaribbeanLivingButton2,
  );
  const hasExploreExperiencesSection = homePage.exploreExperiences.length > 0;
  const hasFeaturedQuoteSection = Boolean(
    homePage.featuredQuote.quote || homePage.featuredQuote.credit,
  );
  const hasGalleryButton = Boolean(
    homePage.galleryButtonText && homePage.galleryButtonUrl,
  );
  const hasGallerySection = Boolean(
    homePage.galleryImages.length || homePage.galleryTitle || hasGalleryButton,
  );
  const hasReserveButton = Boolean(
    homePage.reserveYourStayDate.buttonText &&
    homePage.reserveYourStayDate.buttonUrl,
  );
  const hasReserveSection = Boolean(
    homePage.reserveYourStayImage?.src ||
    homePage.reserveYourStayVideo ||
    homePage.reserveYourStayDate.title ||
    homePage.reserveYourStayDate.content ||
    hasReserveButton,
  );

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="hero"
          style={{ "--hero-image": `url(${getAssetSrc(heroImage)})` }}
          aria-label="Pattoo Castle in Negril, Jamaica"
        >
          <div className="hero-content container" data-aos="fade-in">
            {homePage.heroLeftText && (
              <div className="hero-kicker hero-kicker-left">
                {homePage.heroLeftText}
              </div>
            )}
            <div className="hero-heading-wrap">
              {homePage.heroHeading && <h1>{homePage.heroHeading}</h1>}
              {(hasPrimaryButton || hasSecondaryButton) && (
                <div className="hero-actions">
                  {hasPrimaryButton && (
                    <a
                      className="button button--light hero-button"
                      href={homePage.buttonUrl}
                    >
                      {homePage.buttonText}
                    </a>
                  )}
                  {hasSecondaryButton && (
                    <a
                      className="button button--light hero-button"
                      href={homePage.button2Url}
                      target="_blank"
                    >
                      {homePage.button2Text}
                    </a>
                  )}
                </div>
              )}
            </div>
            {homePage.heroRightText && (
              <div className="hero-kicker hero-kicker-right">
                {homePage.heroRightText}
              </div>
            )}
          </div>

          <a
            className="scroll-cue"
            href="#overview"
            aria-label="Scroll to overview"
          >
            <span />
            Scroll more
          </a>
        </section>

        <span className="section-anchor" id="overview" aria-hidden="true" />

        {hasIntroSection && (
          <section
            className="intro-section"
            aria-labelledby={homePage.introHeading ? "intro-title" : undefined}
          >
            <div className="container">
              <div className="intro-panel" data-aos="fade-up">
                {homePage.introLogo && (
                  <img
                    className="intro-logo"
                    src={homePage.introLogo.src}
                    alt={homePage.introLogo.alt || "Pattoo Castle crest"}
                  />
                )}

                {homePage.introHeading && (
                  <h2 id="intro-title">{homePage.introHeading}</h2>
                )}

                {homePage.introDescription && (
                  <p className="intro-description">
                    {homePage.introDescription}
                  </p>
                )}

                {homePage.numberBlock.length > 0 && (
                  <div className="number-block" aria-label="Villa highlights">
                    {homePage.numberBlock.map((item, index) => (
                      <div
                        className="number-item"
                        key={`${item.value}-${index}`}
                      >
                        {item.image?.src && (
                          <img
                            className="number-item-image"
                            src={item.image.src}
                            alt={item.image.alt || (item.label ? `${item.label} icon` : "")}
                          />
                        )}
                        {item.value && <strong>{item.value}</strong>}
                        {item.label && <span>{item.label}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {homePage.introImage?.src && (
              <div className="intro-image-wrap" data-aos="fade-up">
                <div className="container">
                  <img
                    src={homePage.introImage.src}
                    alt={homePage.introImage.alt || "Pattoo Castle villa and oceanfront setting"}
                  />
                </div>
              </div>
            )}
          </section>
        )}

        {hasEventSection && (
          <section
            className="section event-section"
            id="events"
            aria-labelledby={
              homePage.eventSectionHeading ? "event-title" : undefined
            }
          >
            <div className="wrap text-center">
              {(homePage.eventSectionHeading ||
                homePage.eventSectionHighlight) && (
                <h2 id="event-title" data-aos="fade-up">
                  {homePage.eventSectionHeading && (
                    <span>{homePage.eventSectionHeading}</span>
                  )}
                  {homePage.eventSectionHighlight && (
                    <strong> {homePage.eventSectionHighlight}</strong>
                  )}
                </h2>
              )}

              {homePage.eventCards.length > 0 && (
                <div className="event-card-grid">
                  {homePage.eventCards.map((image, index) => (
                    <article
                      className="event-card"
                      key={`${image.src}-${index}`}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 100)}
                    >
                      <img
                        src={image.src}
                        alt={image.alt || `Pattoo Castle event setting ${index + 1}`}
                      />
                    </article>
                  ))}
                </div>
              )}

              {hasEventButton && (
                <a
                  className="button button--brown event-button"
                  href={homePage.eventButtonUrl}
                  data-aos="fade-up"
                >
                  {homePage.eventButtonText}
                </a>
              )}
            </div>
          </section>
        )}

        {hasAmenitiesSection && (
          <span
            className="section-anchor"
            id="accommodation"
            aria-hidden="true"
          />
        )}

        {hasAmenitiesSection && (
          <AmenitiesSlider
            eyebrow={homePage.amenitiesEyebrow}
            heading={homePage.amenitiesHeading}
            items={homePage.amenitiesItems}
          />
        )}

        {hasCaribbeanLivingSection && (
          <section
            className="section caribbean-living-section"
            id="explore-negril"
            aria-labelledby={
              homePage.caribbeanLivingTitle
                ? "caribbean-living-title"
                : undefined
            }
          >
            {homePage.caribbeanLivingImage?.src && (
              <img
                className="caribbean-living-map"
                src={homePage.caribbeanLivingImage.src}
                alt={
                  homePage.caribbeanLivingImage.alt ||
                  "Map of Negril and Caribbean experiences near Pattoo Castle"
                }
              />
            )}

            <div className="caribbean-living-content" data-aos="fade-up">
              {homePage.caribbeanLivingTitle && (
                <h2 id="caribbean-living-title">
                  {homePage.caribbeanLivingTitle}
                </h2>
              )}

              {homePage.caribbeanLivingContent && (
                <p>{homePage.caribbeanLivingContent}</p>
              )}

              {(hasCaribbeanLivingButton || hasCaribbeanLivingButton2) && (
                <div className="caribbean-living-actions">
                  {hasCaribbeanLivingButton && (
                    <a
                      className="button button--brown caribbean-living-button"
                      href={homePage.caribbeanLivingButtonUrl}
                    >
                      {homePage.caribbeanLivingButtonText}
                    </a>
                  )}
                  {hasCaribbeanLivingButton2 && (
                    <a
                      className="button button--brown caribbean-living-button"
                      href={homePage.caribbeanLivingButton2Url}
                    >
                      {homePage.caribbeanLivingButton2Text}
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {hasExploreExperiencesSection && (
          <section
            className="section explore-experiences-section"
            aria-label="Explore experiences"
          >
            {homePage.exploreExperiences.map((item, index) => {
              const hasButton = Boolean(item.buttonText && item.buttonUrl);

              return (
                <article
                  className="explore-experience-card"
                  data-aos="fade-up"
                  data-aos-delay={String(index * 100)}
                  key={`${item.title}-${index}`}
                >
                  {item.image?.src && (
                    <img
                      src={item.image.src}
                      alt={item.image.alt || `Pattoo Castle experience ${index + 1}`}
                    />
                  )}
                  <div className="explore-experience-overlay" />
                  <div className="explore-experience-content">
                    {item.title && <h2>{item.title}</h2>}
                    {item.content && <p>{item.content}</p>}
                    {hasButton && (
                      <a
                        className="button button--light explore-experience-button"
                        href={item.buttonUrl}
                      >
                        {item.buttonText}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {hasFeaturedQuoteSection && (
          <section
            className="section featured-quote-section"
            data-aos="fade-up"
            aria-label="Featured quote"
          >
            <div className="featured-quote-mark" aria-hidden="true">
              &ldquo;
            </div>
            {homePage.featuredQuote.quote && (
              <blockquote>{homePage.featuredQuote.quote}</blockquote>
            )}
            {homePage.featuredQuote.credit && (
              <p>{homePage.featuredQuote.credit}</p>
            )}
          </section>
        )}

        {hasGallerySection && (
          <section
            className="gallery-preview-section container"
            id="gallery"
            aria-labelledby={
              homePage.galleryTitle ? "gallery-title" : undefined
            }
          >
            {homePage.galleryImages.length > 0 && (
              <GalleryPreviewSlider images={homePage.galleryImages} />
            )}

            <div className="gallery-preview-content" data-aos="fade-up">
              {homePage.galleryTitle && (
                <h2 id="gallery-title">{homePage.galleryTitle}</h2>
              )}
              {hasGalleryButton && (
                <a
                  className="button button--brown gallery-preview-button"
                  href={homePage.galleryButtonUrl}
                >
                  {homePage.galleryButtonText}
                </a>
              )}
            </div>
          </section>
        )}

        {hasReserveSection && (
          <span className="section-anchor" id="stay" aria-hidden="true" />
        )}

        {hasReserveSection && (
          <ReserveStaySection
            backgroundImage={homePage.reserveYourStayImage?.src}
            buttonText={homePage.reserveYourStayDate.buttonText}
            buttonUrl={homePage.reserveYourStayDate.buttonUrl}
            content={homePage.reserveYourStayDate.content}
            logoAlt={homePage.reserveYourStayDate.logo?.alt}
            logoSrc={homePage.reserveYourStayDate.logo?.src || getAssetSrc(logo)}
            title={homePage.reserveYourStayDate.title}
            videoSrc={homePage.reserveYourStayVideo}
          />
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}

export default App;
