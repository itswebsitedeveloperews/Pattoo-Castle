import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

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

  return {
    heroImage: getContentfulMedia(fields.heroImage),
    heroHeading: fields.heroHeading || "",
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

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="hero"
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
          <div className="hero-content container" data-aos="fade-in">
            <div className="hero-heading-wrap">
              {homePage.heroHeading && <h1>{homePage.heroHeading}</h1>}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}

export default App;
