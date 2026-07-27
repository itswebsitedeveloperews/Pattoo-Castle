import AosInitializer from "./AosInitializer";
import { getFooterContent, getHeaderContent } from "./App";
import heroImage from "./assets/hero.png";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function NotFoundPage({
  footerEntry = null,
  headerEntry = null,
}) {
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="section page-hero not-found-hero"
          style={{ "--hero-image": `url(${heroImage.src})` }}
          aria-labelledby="not-found-title"
        >
          <div
            className="page-hero-content not-found-content"
            data-aos="fade-up"
          >
            <span className="not-found-code" aria-hidden="true">
              404
            </span>
            <h1 id="not-found-title">Page not found</h1>
            <p>
              The page you are looking for may have moved, or the address may be
              incorrect.
            </p>
            <div className="not-found-actions">
              <a className="button button--light page-hero-button" href="/">
                Return Home
              </a>
              <a
                className="button button--light page-hero-button"
                href="/contact/"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
