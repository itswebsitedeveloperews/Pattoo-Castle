import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToReact,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import OutdoorsCarousel from "./OutdoorsCarousel";
import styles from "./OutdoorsPage.module.css";

function getOutdoorsContent(entry) {
  const fields = entry?.fields || {};

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || fields.title || "",
    outdoorHeading: fields.outdoorHeading || "",
    outdoorContent: fields.outdoorContent || null,
    patiosAndBalconiesHeading: fields.patiosAndBalconiesHeading || "",
    patiosAndBalconiesImages: Array.isArray(fields.patiosAndBalconiesImages)
      ? fields.patiosAndBalconiesImages
          .map((asset) => getContentfulImage(asset))
          .filter((image) => image?.src)
      : [],
  };
}

export default function OutdoorsPage({
  footerEntry = null,
  headerEntry = null,
  outdoorsEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const outdoors = getOutdoorsContent(outdoorsEntry);

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="section page-hero accommodation-hero outdoors-hero"
          style={
            outdoors.bannerImage
              ? {
                  "--accommodation-banner-image": `url(${outdoors.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={
            outdoors.bannerHeading ? "outdoors-title" : undefined
          }
        >
          <div className="page-hero-content accommodation-hero-content">
            {outdoors.bannerHeading && (
              <h1 id="outdoors-title" data-aos="fade-up" data-aos-delay="60">
                {outdoors.bannerHeading}
              </h1>
            )}
          </div>
        </section>
        {(outdoors.outdoorHeading ||
          outdoors.outdoorContent ||
          outdoors.patiosAndBalconiesHeading ||
          outdoors.patiosAndBalconiesImages.length > 0) && (
          <section className={`section ${styles.outdoorSection}`}>
            <div className="wrap">
              {(outdoors.outdoorHeading || outdoors.outdoorContent) && (
                <div className={styles.poolContent}>
                  {outdoors.outdoorHeading && (
                    <h2>{outdoors.outdoorHeading}</h2>
                  )}
                  {outdoors.outdoorContent && (
                    <div className={styles.poolBody}>
                      {richTextToReact(
                        outdoors.outdoorContent,
                        "outdoor-content",
                        true,
                      )}
                    </div>
                  )}
                </div>
              )}
              {(outdoors.patiosAndBalconiesHeading ||
                outdoors.patiosAndBalconiesImages.length > 0) && (
                <div className={styles.patiosContent}>
                  {outdoors.patiosAndBalconiesHeading && (
                    <h2>{outdoors.patiosAndBalconiesHeading}</h2>
                  )}
                  <OutdoorsCarousel
                    images={outdoors.patiosAndBalconiesImages}
                  />
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
