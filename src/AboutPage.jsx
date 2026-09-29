import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
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
    villaContent: richTextToPlainText(fields.villaContent),
    villaImage2: getContentfulImage(fields.villaImage2),
    villaContent2: richTextToPlainText(fields.villaContent2),
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
    about.villaContent ||
    about.villaImage2?.src ||
    about.villaContent2,
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

              {about.villaContent && (
                <div
                  className="about-villa-content"
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  <p>{about.villaContent}</p>
                </div>
              )}

              {about.villaContent2 && (
                <div
                  className="about-villa-content about-villa-content--secondary"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <p>{about.villaContent2}</p>
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
