import AosInitializer from "./AosInitializer";
import HomeGallerySection from "./HomeGallerySection";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function getMapEmbedSrc(value) {
  const scriptText = decodeHtmlEntities(richTextToPlainText(value));
  const iframeSrcMatch = scriptText.match(/\bsrc=(["'])(.*?)\1/i);
  const rawSrc = iframeSrcMatch?.[2] || scriptText;
  const urlMatch = rawSrc.match(
    /https:\/\/(?:www\.)?google\.com\/maps\/embed\?[^"'<\s)]+/i,
  );
  const src = urlMatch?.[0] || "";

  return src.replace(/\]$/, "");
}

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

export function richTextToReact(value, keyPrefix = "rich-text", preserveLineBreaks = false) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return preserveLineBreaks
      ? value.split(/\r\n|\r|\n/).map((line, index) => (
          <span key={`${keyPrefix}-line-${index}`}>
            {index > 0 && <br />}
            {line}
          </span>
        ))
      : value;
  }

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      richTextToReact(item, `${keyPrefix}-${index}`, preserveLineBreaks),
    );
  }

  if (typeof value !== "object") {
    return null;
  }

  if (typeof value.value === "string") {
    return richTextToReact(value.value, keyPrefix, preserveLineBreaks);
  }

  const children = richTextToReact(value.content, `${keyPrefix}-content`, preserveLineBreaks);

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
  const homeIntroImages = Array.isArray(fields.homeIntroImages)
    ? fields.homeIntroImages
        .map((asset) => getContentfulImage(asset))
        .filter((image) => image?.src)
    : [getContentfulImage(fields.homeIntroImages)].filter(
        (image) => image?.src,
      );
  const galleryImages = Array.isArray(fields.galleryImages)
    ? fields.galleryImages
        .map((asset) => getContentfulImage(asset))
        .filter((image) => image?.src)
    : [getContentfulImage(fields.galleryImages)].filter(
        (image) => image?.src,
      );

  return {
    heroImage: getContentfulMedia(fields.heroImage),
    heroHeading: fields.heroHeading || "",
    homeIntroImages,
    homeIntroHeading: fields.homeIntroHeading || "",
    homeIntroContent: fields.homeIntroContent || null,
    galleryHeading: fields.galleryHeading || "",
    galleryImages,
    galleryButtonText: fields.galleryButtonText || "",
    galleryButtonUrl: fields.galleryButtonUrl || "",
    mapEmbedSrc: getMapEmbedSrc(fields.mapScript),
    mapButtonText: fields.mapButtonText || "",
    mapButtonUrl: fields.mapButtonUrl || "",
  };
}

export function getAssetSrc(asset) {
  return typeof asset === "string" ? asset : asset.src;
}

function isTransformableContentfulImage(asset, url) {
  const contentType = asset?.fields?.file?.contentType || "";

  if (!contentType.startsWith("image/")) {
    return false;
  }

  if (contentType === "image/svg+xml" || contentType === "image/gif") {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.hostname === "images.ctfassets.net" ||
      parsedUrl.hostname === "images.contentful.com"
    );
  } catch {
    return false;
  }
}

function getOptimizedContentfulImageUrl(asset, url) {
  if (!isTransformableContentfulImage(asset, url)) {
    return url;
  }

  const optimizedUrl = new URL(url);
  optimizedUrl.searchParams.set("w", "1920");
  optimizedUrl.searchParams.set("q", "80");
  optimizedUrl.searchParams.set("fm", "webp");
  return optimizedUrl.toString();
}

export function getContentfulAssetSrc(asset) {
  const url = asset?.fields?.file?.url;

  if (!url) {
    return "";
  }

  const src = url.startsWith("//") ? `https:${url}` : url;
  return getOptimizedContentfulImageUrl(asset, src);
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

function getContentfulMedia(asset) {
  const src = getContentfulAssetSrc(asset);

  if (!src) {
    return null;
  }

  return {
    src,
    alt: getContentfulAssetAlt(asset),
    contentType: asset?.fields?.file?.contentType || "",
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
  const footerBarItems = Array.isArray(fields.footerBarMenu)
    ? fields.footerBarMenu
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
    location: fields.location || "",
    phone: fields.phone || "",
    email: fields.email || "",
    socialLinks,
    menuItems,
    copyright: fields.footerCopyright || "",
    footerBarItems,
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
                    subName: subItemFields.menuSubName || "",
                    url: subItemFields.menuUrl || "",
                  };
                })
                .filter((subItem) => subItem.name || subItem.url)
            : [];

          return {
            megaMenuImage: getContentfulImage(itemFields.megaMenuImage),
            megaMenuTitle: itemFields.megaMenuTitle || "",
            megaMenu: Boolean(
              itemFields.megaMenu ||
                itemFields.megaMenuImage ||
                itemFields.megaMenuTitle,
            ),
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
    buttonText1: fields.buttonText1 || fields.button1Text || "",
    buttonUrl1: fields.buttonUrl1 || fields.button1Url || "",
    socialLinks,
  };
}

function App({ footerEntry = null, headerEntry = null, homePageEntry = null }) {
  const homePage = getHomePageContent(homePageEntry);
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const isHeroVideo = homePage.heroImage?.contentType.startsWith("video/");
  const heroImageStyle = homePage.heroImage?.src && !isHeroVideo
    ? { "--hero-image": `url(${homePage.heroImage.src})` }
    : undefined;
  const hasHomeIntroSection = Boolean(
    homePage.homeIntroImages.length ||
      homePage.homeIntroHeading ||
      homePage.homeIntroContent,
  );
  const hasGallerySection = Boolean(
    homePage.galleryImages.length ||
      homePage.galleryHeading ||
      (homePage.galleryButtonText && homePage.galleryButtonUrl),
  );
  const hasMapSection = Boolean(
    homePage.mapEmbedSrc ||
      (homePage.mapButtonText && homePage.mapButtonUrl),
  );

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="section pb-0 hero"
          style={heroImageStyle}
          aria-label="Pattoo Castle in Negril, Jamaica"
        >
          {isHeroVideo && (
            <video
              aria-hidden="true"
              autoPlay
              className="hero-media"
              loop
              muted
              playsInline
              src={homePage.heroImage.src}
            />
          )}
          <div className="hero-content container-wide" data-aos="fade-in">
            <div className="hero-heading-wrap">
              {homePage.heroHeading && <h1>{homePage.heroHeading}</h1>}
            </div>
          </div>
        </section>

        {hasHomeIntroSection && (
          <section
            className="section home-intro-section"
            aria-labelledby={
              homePage.homeIntroHeading ? "home-intro-title" : undefined
            }
          >
            <div className="home-intro-inner container">
              {homePage.homeIntroImages.length > 0 && (
                <div
                  className={`home-intro-media${
                    homePage.homeIntroImages.length === 1
                      ? " home-intro-media--single"
                      : ""
                  }`}
                  data-aos="fade-up"
                >
                  <img
                    className="home-intro-image home-intro-image--primary"
                    src={homePage.homeIntroImages[0].src}
                    alt={
                      homePage.homeIntroImages[0].alt ||
                      "Pattoo Castle stone villa exterior"
                    }
                  />
                  {homePage.homeIntroImages[1]?.src && (
                    <img
                      className="home-intro-image home-intro-image--secondary"
                      src={homePage.homeIntroImages[1].src}
                      alt={
                        homePage.homeIntroImages[1].alt ||
                        "Aerial view of Pattoo Castle by the sea"
                      }
                    />
                  )}
                </div>
              )}

              <div className="home-intro-content" data-aos="fade-up">
                {homePage.homeIntroHeading && (
                  <h2 id="home-intro-title">{homePage.homeIntroHeading}</h2>
                )}
                {homePage.homeIntroContent && (
                  <div className="home-intro-rich-text">
                    {richTextToReact(
                      homePage.homeIntroContent,
                      "home-intro-content",
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {hasGallerySection && (
          <HomeGallerySection
            buttonText={homePage.galleryButtonText}
            buttonUrl={homePage.galleryButtonUrl}
            heading={homePage.galleryHeading}
            images={homePage.galleryImages}
          />
        )}

        {hasMapSection && (
          <section className="section home-map-section" aria-label="Pattoo Castle map">
            <div className="home-map-inner container">
              {homePage.mapEmbedSrc && (
                <div className="home-map-frame" data-aos="fade-up">
                  <iframe
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={homePage.mapEmbedSrc}
                    title="Pattoo Castle location on Google Maps"
                  />
                </div>
              )}

              {homePage.mapButtonText && homePage.mapButtonUrl && (
                <a
                  className="btn btn--light home-map-button"
                  href={homePage.mapButtonUrl}
                >
                  {homePage.mapButtonText}
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

export default App;
