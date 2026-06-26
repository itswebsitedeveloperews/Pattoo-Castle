import facebookIcon from "./assets/Facebook.svg";
import heroImage from "./assets/hero.png";
import instagramIcon from "./assets/insta.svg";
import logo from "./assets/patto-logo.svg";

const navItems = [
  "Accommodation",
  "Overview",
  "Gallery",
  "Stay",
  "Events",
  "Explore Negril",
];

function richTextToPlainText(value) {
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

function getHomePageContent(entry) {
  const fields = entry?.fields || {};
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
  };
}

function getAssetSrc(asset) {
  return typeof asset === "string" ? asset : asset.src;
}

function getContentfulAssetSrc(asset) {
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

function App({ homePageEntry = null }) {
  const homePage = getHomePageContent(homePageEntry);
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

  return (
    <main>
      <section
        className="hero"
        style={{ "--hero-image": `url(${getAssetSrc(heroImage)})` }}
        aria-label="Pattoo Castle in Negril, Jamaica"
      >
        <header className="site-header">
          <a className="brand" href="/" aria-label="Pattoo Castle home">
            <img
              src={getAssetSrc(logo)}
              alt="Pattoo Castle, a luxury Jamaican villa"
            />
          </a>

          <nav className="primary-nav" aria-label="Primary navigation">
            {navItems.map((item, index) => (
              <a
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                key={`${item}-${index}`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a className="button button--light enquire-link" href="#enquire">
              Enquire now
            </a>
            <a
              className="social-link"
              href="https://www.facebook.com/"
              aria-label="Facebook"
            >
              <img src={getAssetSrc(facebookIcon)} alt="" />
            </a>
            <a
              className="social-link"
              href="https://www.instagram.com/"
              aria-label="Instagram"
            >
              <img src={getAssetSrc(instagramIcon)} alt="" />
            </a>
          </div>
        </header>

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

      {hasIntroSection && (
        <section
          className="intro-section"
          id="overview"
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
    </main>
  );
}

export default App;
