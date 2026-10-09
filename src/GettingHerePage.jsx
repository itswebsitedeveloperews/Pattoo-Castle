import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  richTextToReact,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function getGettingHereContent(entry) {
  const fields = entry?.fields || {};
  return {
    title: fields.bannerHeading || fields.title || "",
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    content: fields.gettingHereContent || null,
  };
}

export default function GettingHerePage({
  footerEntry = null,
  gettingHereEntry = null,
  headerEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const page = getGettingHereContent(gettingHereEntry);

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main>
        <section
          className="pt-0 pb-0 section page-hero getting-here-hero"
          style={
            page.bannerImage
              ? { "--getting-here-banner-image": `url(${page.bannerImage})` }
              : undefined
          }
          aria-labelledby={page.title ? "getting-here-title" : undefined}
        >
          <div className="page-hero-content getting-here-hero-content">
            {page.title && (
              <h1 id="getting-here-title" data-aos="fade-up" data-aos-delay="50">
                {page.title}
              </h1>
            )}
          </div>
        </section>
        {richTextToPlainText(page.content).trim() && (
          <section
            className="section getting-here-content-section"
            aria-label="Travel to Pattoo Castle"
          >
            <div className="getting-here-content-text">
              {richTextToReact(page.content, "getting-here-content", true)}
            </div>
          </section>
        )}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
