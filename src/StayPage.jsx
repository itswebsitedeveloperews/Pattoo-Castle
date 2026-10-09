import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
} from "./App";
import AosInitializer from "./AosInitializer";
import StayInquiryForm from "./StayInquiryForm";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function getStayContent(entry) {
  const fields = entry?.fields || {};

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || "",
  };
}

export default function StayPage({
  footerEntry = null,
  headerEntry = null,
  stayEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const stay = getStayContent(stayEntry);

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main>
        <section
          className="section page-hero stay-hero"
          style={
            stay.bannerImage
              ? {
                  "--stay-banner-image": `url(${stay.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={stay.bannerHeading ? "stay-title" : undefined}
        >
          <div className="wrap">
            <div className="page-hero-content stay-hero-content">
              {stay.bannerHeading && (
                <h1 id="stay-title" data-aos="fade-up" data-aos-delay="50">
                  {stay.bannerHeading}
                </h1>
              )}
            </div>
          </div>
        </section>

        <StayInquiryForm />
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
