import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  richTextToReact,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function getAboutContent(entry) {
  const fields = entry?.fields || {};

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || "",
    villaImage: getContentfulImage(fields.villaImage),
    villaContent: fields.villaContent || null,
    villaContentText: richTextToPlainText(fields.villaContent),
    villaImage2: getContentfulImage(fields.villaImage2),
    villaContent2: fields.villaContent2 || null,
    villaContent2Text: richTextToPlainText(fields.villaContent2),
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
  const hasVillaSection = Boolean(
    about.villaImage?.src ||
    about.villaContentText ||
    about.villaImage2?.src ||
    about.villaContent2Text,
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
            {about.bannerHeading && (
              <h1 id="about-title" data-aos="fade-up" data-aos-delay="50">
                {about.bannerHeading}
              </h1>
            )}
          </div>
        </section>

        {hasVillaSection && (
          <section className="section about-villa-section">
            <div className="wrap about-villa-grid">
              {about.villaImage?.src && (
                <figure
                  className="about-villa-media"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <img
                    src={about.villaImage.src}
                    alt={about.villaImage.alt || "Pattoo Castle villa bedroom"}
                  />
                </figure>
              )}

              {about.villaContentText && (
                <div
                  className="about-villa-content"
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  {richTextToReact(about.villaContent, "about-villa-content")}
                </div>
              )}

              {about.villaContent2Text && (
                <div
                  className="about-villa-content about-villa-content--secondary"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  {richTextToReact(
                    about.villaContent2,
                    "about-villa-content-2",
                  )}
                </div>
              )}

              {about.villaImage2?.src && (
                <figure
                  className="about-villa-media"
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  <img
                    src={about.villaImage2.src}
                    alt={about.villaImage2.alt || "Pattoo Castle ocean view"}
                  />
                </figure>
              )}
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
