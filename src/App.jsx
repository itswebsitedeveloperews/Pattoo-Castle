import AmenitiesSlider from "./AmenitiesSlider";
import GalleryPreviewSlider from "./GalleryPreviewSlider";
import HeaderMenuLink from "./HeaderMenuLink";
import ReserveStaySection from "./ReserveStaySection";
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
    return value.map((item, index) => (
      <span key={`${keyPrefix}-${index}`}>
        {richTextToReact(item, `${keyPrefix}-${index}`)}
      </span>
    ));
  }

  if (typeof value !== "object") {
    return null;
  }

  if (typeof value.value === "string") {
    return value.value;
  }

  const children = richTextToReact(value.content, `${keyPrefix}-content`);

  if (value.nodeType === "hyperlink") {
    return (
      <a href={value.data?.uri || "#"} key={keyPrefix}>
        {children}
      </a>
    );
  }

  return children;
}

function getHomePageContent(entry) {
  const fields = entry?.fields || {};
  const amenitiesItems = Array.isArray(fields.amenitiesItems)
    ? fields.amenitiesItems
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            title: itemFields.amenitiesItemsTitle || "",
            content: richTextToPlainText(itemFields.amenitiesItemsContent),
            imageSrc: getContentfulAssetSrc(itemFields.amenitiesItemsImage),
          };
        })
        .filter((item) => item.title || item.content || item.imageSrc)
    : [];
  const exploreExperiences = Array.isArray(fields.exploreExperiences)
    ? fields.exploreExperiences
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
  const featuredQuoteFields = fields.featuredQuote?.fields || {};
  const featuredQuote = {
    quote: featuredQuoteFields.title || "",
    credit: richTextToPlainText(featuredQuoteFields.content),
  };
  const galleryImages = Array.isArray(fields.galleryImages)
    ? fields.galleryImages
        .map((asset) => getContentfulAssetSrc(asset))
        .filter(Boolean)
    : [];
  const reserveYourStayDateFields = fields.reserveYourStayDate?.fields || {};
  const reserveYourStayDate = {
    title: reserveYourStayDateFields.title || "",
    content: richTextToPlainText(reserveYourStayDateFields.content),
    buttonText: reserveYourStayDateFields.buttonText || "",
    buttonUrl: reserveYourStayDateFields.buttonUrl || "",
  };
  const eventCards = Array.isArray(fields.eventCards)
    ? fields.eventCards
        .map((asset) => getContentfulAssetSrc(asset))
        .filter(Boolean)
    : [];
  const numberBlock = Array.isArray(fields.numberBlock)
    ? fields.numberBlock
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            imageSrc: getFirstContentfulAssetSrc(itemFields.images),
            value: itemFields.title || "",
            label: richTextToPlainText(itemFields.content),
          };
        })
        .filter((item) => item.imageSrc || item.value || item.label)
    : [];

  return {
    heroHeading: fields.heroHeading || "",
    heroLeftText: fields.heroLeftText || "",
    heroRightText: fields.heroRightText || "",
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    button2Text: richTextToPlainText(fields.button2Text),
    button2Url: fields.button2Url || "",
    introLogo: getContentfulAssetSrc(fields.introLogo),
    introHeading: fields.introHeading || "",
    introDescription: richTextToPlainText(fields.introDescription),
    numberBlock,
    introImage: getContentfulAssetSrc(fields.introImage),
    eventSectionHeading: fields.eventSectionHeading || "",
    eventSectionHighlight: fields.eventSectionHighlight || "",
    eventCards,
    eventButtonText: fields.eventButtonText || "",
    eventButtonUrl: fields.eventButtonUrl || "",
    amenitiesEyebrow: fields.amenitiesEyebrow || "",
    amenitiesHeading: fields.amenitiesHeading || "",
    amenitiesItems,
    caribbeanLivingImage: getContentfulAssetSrc(fields.caribbeanLivingImage),
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
    reserveYourStayImage: getContentfulAssetSrc(fields.reserveYourStayImage),
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

function getFirstContentfulAssetSrc(assets) {
  if (Array.isArray(assets)) {
    return getContentfulAssetSrc(assets[0]);
  }

  return getContentfulAssetSrc(assets);
}

export function getFooterContent(entry) {
  const fields = entry?.fields || {};
  const socialLinks = Array.isArray(fields.followUsOn)
    ? fields.followUsOn
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            iconSrc: getContentfulAssetSrc(itemFields.socialIcon),
            url: itemFields.socialUrl || "",
          };
        })
        .filter((item) => item.iconSrc || item.url)
    : [];
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
    logoSrc: getContentfulAssetSrc(fields.footerLogo),
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

          return {
            name: itemFields.menuName || "",
            url: itemFields.menuUrl || "",
          };
        })
        .filter((item) => item.name || item.url)
    : [];
  const socialLinks = Array.isArray(fields.socialIcons)
    ? fields.socialIcons
        .map((item) => {
          const itemFields = item?.fields || {};

          return {
            iconSrc: getContentfulAssetSrc(itemFields.socialIcon),
            url: itemFields.socialUrl || "",
          };
        })
        .filter((item) => item.iconSrc || item.url)
    : [];

  return {
    logoSrc: getContentfulAssetSrc(fields.logo),
    menuItems,
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    socialLinks,
  };
}

function getPhoneHref(phone) {
  const value = phone.replace(/[^\d+]/g, "");

  return value ? `tel:${value}` : "";
}

export function SiteHeader({ header }) {
  const hasHeaderButton = Boolean(header.buttonText && header.buttonUrl);
  const hasMobileMenu = Boolean(
    header.menuItems.length || hasHeaderButton || header.socialLinks.length,
  );

  return (
    <header className="site-header">
      {header.logoSrc && (
        <div className="navbar-logo">
          <a className="brand" href="/" aria-label="Pattoo Castle home">
            <img src={header.logoSrc} alt="Pattoo Castle" />
          </a>
        </div>
      )}

      <div className="right-header">
        {header.menuItems.length > 0 && (
          <nav className="primary-nav" aria-label="Primary navigation">
            {header.menuItems.map((item, index) => (
              <HeaderMenuLink item={item} key={`${item.name}-${index}`} />
            ))}
            {hasHeaderButton && (
              <a
                className="button button--light enquire-link"
                href={header.buttonUrl}
              >
                {header.buttonText}
              </a>
            )}
          </nav>
        )}

        <div className="header-actions">
          {header.socialLinks.map((item, index) => (
            <a
              className="social-link"
              href={item.url || "#"}
              key={`${item.url}-${index}`}
              aria-label={`Social link ${index + 1}`}
            >
              {item.iconSrc && <img src={item.iconSrc} alt="" />}
            </a>
          ))}
        </div>

        {hasMobileMenu && (
          <details className="mobile-menu">
            <summary aria-label="Open menu">
              <span />
              <span />
              <span />
            </summary>

            <div className="mobile-menu-panel">
              {header.menuItems.length > 0 && (
                <nav className="mobile-nav" aria-label="Mobile navigation">
                  {header.menuItems.map((item, index) => (
                    <HeaderMenuLink item={item} key={`${item.name}-${index}`} />
                  ))}
                </nav>
              )}

              {(hasHeaderButton || header.socialLinks.length > 0) && (
                <div className="mobile-header-actions">
                  {hasHeaderButton && (
                    <a
                      className="button button--light enquire-link"
                      href={header.buttonUrl}
                    >
                      {header.buttonText}
                    </a>
                  )}
                  {header.socialLinks.map((item, index) => (
                    <a
                      className="social-link"
                      href={item.url || "#"}
                      key={`${item.url}-${index}`}
                      aria-label={`Social link ${index + 1}`}
                    >
                      {item.iconSrc && <img src={item.iconSrc} alt="" />}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </header>
  );
}

export function SiteFooter({ footer }) {
  const hasContact = Boolean(
    footer.location ||
    footer.phone ||
    footer.email ||
    footer.socialLinks.length,
  );
  const hasFooter = Boolean(
    footer.logoSrc ||
    hasContact ||
    footer.menuItems.length ||
    footer.copyright ||
    footer.designBy ||
    footer.footerBarMenu,
  );

  if (!hasFooter) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        {footer.logoSrc && (
          <a className="footer-brand" href="/" aria-label="Pattoo Castle home">
            <img src={footer.logoSrc} alt="Pattoo Castle" />
          </a>
        )}

        {hasContact && (
          <div className="footer-contact-grid">
            {footer.location && (
              <div className="footer-contact-item">
                <strong>Location</strong>
                <p>{footer.location}</p>
              </div>
            )}
            {footer.phone && (
              <div className="footer-contact-item">
                <strong>Tel</strong>
                <a href={getPhoneHref(footer.phone)}>{footer.phone}</a>
              </div>
            )}
            {footer.email && (
              <div className="footer-contact-item">
                <strong>Email</strong>
                <a href={`mailto:${footer.email}`}>{footer.email}</a>
              </div>
            )}
            {footer.socialLinks.length > 0 && (
              <div className="footer-contact-item footer-socials">
                <strong>Follow us on</strong>
                <div>
                  {footer.socialLinks.map((item, index) => (
                    <a
                      href={item.url || "#"}
                      key={`${item.url}-${index}`}
                      aria-label={`Social link ${index + 1}`}
                    >
                      {item.iconSrc && <img src={item.iconSrc} alt="" />}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {footer.menuItems.length > 0 && (
          <nav className="footer-nav" aria-label="Footer navigation">
            {footer.menuItems.map((item, index) => (
              <a href={item.url || "#"} key={`${item.name}-${index}`}>
                {item.name}
              </a>
            ))}
          </nav>
        )}

        {(footer.copyright || footer.designBy || footer.footerBarMenu) && (
          <div className="footer-bottom">
            {footer.copyright && <p>{footer.copyright}</p>}
            {(footer.designBy || footer.footerBarMenu) && (
              <div>
                {footer.designBy && (
                  <span>{richTextToReact(footer.designByRichText)}</span>
                )}
                {footer.footerBarMenu && (
                  <a href={footer.footerBarUrl || "#"}>
                    {footer.footerBarMenu}
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
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
    homePage.introImage,
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
    homePage.caribbeanLivingImage ||
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
    homePage.reserveYourStayImage ||
    homePage.reserveYourStayVideo ||
    homePage.reserveYourStayDate.title ||
    homePage.reserveYourStayDate.content ||
    hasReserveButton,
  );

  return (
    <>
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="hero"
          style={{ "--hero-image": `url(${getAssetSrc(heroImage)})` }}
          aria-label="Pattoo Castle in Negril, Jamaica"
        >
          <div className="hero-content">
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
            <div className="intro-panel">
              {homePage.introLogo && (
                <img
                  className="intro-logo"
                  src={homePage.introLogo}
                  alt=""
                  aria-hidden="true"
                />
              )}

              {homePage.introHeading && (
                <h2 id="intro-title">{homePage.introHeading}</h2>
              )}

              {homePage.introDescription && (
                <p className="intro-description">{homePage.introDescription}</p>
              )}

              {homePage.numberBlock.length > 0 && (
                <div className="number-block" aria-label="Villa highlights">
                  {homePage.numberBlock.map((item, index) => (
                    <div className="number-item" key={`${item.value}-${index}`}>
                      {item.imageSrc && (
                        <img
                          className="number-item-image"
                          src={item.imageSrc}
                          alt=""
                        />
                      )}
                      {item.value && <strong>{item.value}</strong>}
                      {item.label && <span>{item.label}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {homePage.introImage && (
              <div className="intro-image-wrap">
                <img src={homePage.introImage} alt="" />
              </div>
            )}
          </section>
        )}

        {hasEventSection && (
          <section
            className="event-section"
            id="events"
            aria-labelledby={
              homePage.eventSectionHeading ? "event-title" : undefined
            }
          >
            {(homePage.eventSectionHeading ||
              homePage.eventSectionHighlight) && (
              <h2 id="event-title">
                {homePage.eventSectionHeading && (
                  <span>{homePage.eventSectionHeading}</span>
                )}
                {homePage.eventSectionHighlight && (
                  <strong>{homePage.eventSectionHighlight}</strong>
                )}
              </h2>
            )}

            {homePage.eventCards.length > 0 && (
              <div className="event-card-grid">
                {homePage.eventCards.map((imageSrc, index) => (
                  <article className="event-card" key={`${imageSrc}-${index}`}>
                    <img src={imageSrc} alt="" />
                  </article>
                ))}
              </div>
            )}

            {hasEventButton && (
              <a
                className="button button--brown event-button"
                href={homePage.eventButtonUrl}
              >
                {homePage.eventButtonText}
              </a>
            )}
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
            className="caribbean-living-section"
            id="explore-negril"
            aria-labelledby={
              homePage.caribbeanLivingTitle
                ? "caribbean-living-title"
                : undefined
            }
          >
            {homePage.caribbeanLivingImage && (
              <img
                className="caribbean-living-map"
                src={homePage.caribbeanLivingImage}
                alt=""
                aria-hidden="true"
              />
            )}

            <div className="caribbean-living-content">
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
            className="explore-experiences-section"
            aria-label="Explore experiences"
          >
            {homePage.exploreExperiences.map((item, index) => {
              const hasButton = Boolean(item.buttonText && item.buttonUrl);

              return (
                <article
                  className="explore-experience-card"
                  key={`${item.title}-${index}`}
                >
                  {item.imageSrc && <img src={item.imageSrc} alt="" />}
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
            className="featured-quote-section"
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
            className="gallery-preview-section"
            id="gallery"
            aria-labelledby={
              homePage.galleryTitle ? "gallery-title" : undefined
            }
          >
            {homePage.galleryImages.length > 0 && (
              <GalleryPreviewSlider images={homePage.galleryImages} />
            )}

            <div className="gallery-preview-content">
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
            backgroundImage={homePage.reserveYourStayImage}
            buttonText={homePage.reserveYourStayDate.buttonText}
            buttonUrl={homePage.reserveYourStayDate.buttonUrl}
            content={homePage.reserveYourStayDate.content}
            logoSrc={getAssetSrc(logo)}
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
