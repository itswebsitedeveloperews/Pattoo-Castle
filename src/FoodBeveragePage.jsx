import {
  getContentfulAssetSrc,
  getContentfulImage,
  getFirstContentfulImage,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
} from "./App";
import AosInitializer from "./AosInitializer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import styles from "./FoodBeveragePage.module.css";

function getImageBoxItem(item) {
  const fields = item?.fields || {};

  return {
    icon: getFirstContentfulImage(fields.images),
    title: fields.title || "",
    content: richTextToPlainText(fields.content),
  };
}

function getFoodBeverageContent(entry) {
  const fields = entry?.fields || {};
  const villaGlanceItems = Array.isArray(fields.villaGlanceIconBox)
    ? fields.villaGlanceIconBox
        .map(getImageBoxItem)
        .filter((item) => item.icon?.src || item.title || item.content)
    : [];
  const experienceCards = Array.isArray(fields.experienceCards)
    ? fields.experienceCards
        .map(getImageBoxItem)
        .filter((item) => item.icon?.src || item.title || item.content)
    : [];

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerSubHeading: fields.bannerSubHeading || "",
    bannerHeading: fields.bannerHeading || fields.title || "",
    bannerContent: richTextToPlainText(fields.bannerContent),
    buttonText: fields.buttonText || "",
    buttonUrl: fields.buttonUrl || "",
    diningSubHeading: fields.diningSubHeading || "",
    diningHeading: fields.diningHeading || "",
    diningContent: richTextToPlainText(fields.diningContent),
    diningImage: getContentfulImage(fields.diningImage),
    villaGlanceHeading: fields.villaGlanceHeading || "",
    villaGlanceItems,
    experienceSubHeading: fields.experienceSubHeading || "",
    experienceHeading: fields.experienceHeading || "",
    experienceCards,
  };
}

export default function FoodBeveragePage({
  foodBeverageEntry = null,
  footerEntry = null,
  headerEntry = null,
}) {
  const foodBeverage = getFoodBeverageContent(foodBeverageEntry);
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const hasButton = Boolean(
    foodBeverage.buttonText && foodBeverage.buttonUrl,
  );
  const hasDiningSection = Boolean(
    foodBeverage.diningSubHeading ||
      foodBeverage.diningHeading ||
      foodBeverage.diningContent ||
      foodBeverage.diningImage?.src,
  );
  const hasVillaGlanceSection = Boolean(
    foodBeverage.villaGlanceHeading || foodBeverage.villaGlanceItems.length,
  );
  const hasExperienceSection = Boolean(
    foodBeverage.experienceSubHeading ||
      foodBeverage.experienceHeading ||
      foodBeverage.experienceCards.length,
  );

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="section page-hero accommodation-hero food-beverage-hero"
          style={
            foodBeverage.bannerImage
              ? {
                  "--accommodation-banner-image": `url(${foodBeverage.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={
            foodBeverage.bannerHeading ? "food-beverage-title" : undefined
          }
        >
          <div className="page-hero-content accommodation-hero-content">
            {foodBeverage.bannerSubHeading && (
              <p
                className="eyebrow page-hero-eyebrow accommodation-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                {foodBeverage.bannerSubHeading}
              </p>
            )}
            {foodBeverage.bannerHeading && (
              <h1
                id="food-beverage-title"
                data-aos="fade-up"
                data-aos-delay="60"
              >
                {foodBeverage.bannerHeading}
              </h1>
            )}
            {foodBeverage.bannerContent && (
              <p data-aos="fade-up" data-aos-delay="100">
                {foodBeverage.bannerContent}
              </p>
            )}
            {hasButton && (
              <a
                className="button button--light page-hero-button accommodation-hero-button"
                href={foodBeverage.buttonUrl}
                data-aos="fade-up"
                data-aos-delay="150"
              >
                {foodBeverage.buttonText}
              </a>
            )}
          </div>
        </section>

        {hasDiningSection && (
          <section
            className={styles.diningSection}
            aria-labelledby={
              foodBeverage.diningHeading ? "food-beverage-dining-title" : undefined
            }
          >
            <div className={styles.diningInner}>
              <div className={styles.diningContent}>
                {foodBeverage.diningSubHeading && (
                  <p className={styles.diningEyebrow}>
                    {foodBeverage.diningSubHeading}
                  </p>
                )}
                {foodBeverage.diningHeading && (
                  <h2 id="food-beverage-dining-title">
                    {foodBeverage.diningHeading}
                  </h2>
                )}
                {foodBeverage.diningContent && (
                  <p>{foodBeverage.diningContent}</p>
                )}
              </div>

              {foodBeverage.diningImage?.src && (
                <img
                  className={styles.diningImage}
                  src={foodBeverage.diningImage.src}
                  alt={
                    foodBeverage.diningImage.alt ||
                    "Food and beverage experience at Pattoo Castle"
                  }
                />
              )}
            </div>
          </section>
        )}

        {hasVillaGlanceSection && (
          <section
            className={styles.glanceSection}
            aria-labelledby={
              foodBeverage.villaGlanceHeading
                ? "food-beverage-glance-title"
                : undefined
            }
          >
            <div className={styles.glanceInner}>
              {foodBeverage.villaGlanceHeading && (
                <h2 id="food-beverage-glance-title">
                  {foodBeverage.villaGlanceHeading}
                </h2>
              )}

              {foodBeverage.villaGlanceItems.length > 0 && (
                <div className={styles.glanceGrid}>
                  {foodBeverage.villaGlanceItems.map((item, index) => (
                    <article
                      className={styles.glanceItem}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 70)}
                      key={`${item.title}-${index}`}
                    >
                      {item.icon?.src && (
                        <img
                          src={item.icon.src}
                          alt={
                            item.icon.alt ||
                            (item.title ? `${item.title} icon` : "")
                          }
                        />
                      )}
                      {item.title && <h3>{item.title}</h3>}
                      {item.content && <p>{item.content}</p>}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {hasExperienceSection && (
          <section
            className={styles.experienceSection}
            aria-labelledby={
              foodBeverage.experienceHeading
                ? "food-beverage-experience-title"
                : undefined
            }
          >
            <div className={styles.experienceInner}>
              <div className={styles.experienceHeader}>
                {foodBeverage.experienceSubHeading && (
                  <p className={styles.experienceEyebrow}>
                    {foodBeverage.experienceSubHeading}
                  </p>
                )}
                {foodBeverage.experienceHeading && (
                  <h2 id="food-beverage-experience-title">
                    {foodBeverage.experienceHeading}
                  </h2>
                )}
              </div>

              {foodBeverage.experienceCards.length > 0 && (
                <div className={styles.experienceGrid}>
                  {foodBeverage.experienceCards.map((item, index) => (
                    <article
                      className={styles.experienceCard}
                      data-aos="fade-up"
                      data-aos-delay={String(index * 80)}
                      key={`${item.title}-${index}`}
                    >
                      {item.icon?.src && (
                        <img
                          src={item.icon.src}
                          alt={
                            item.icon.alt ||
                            (item.title
                              ? `${item.title} dining experience`
                              : "")
                          }
                        />
                      )}
                      {item.title && <h3>{item.title}</h3>}
                      {item.content && <p>{item.content}</p>}
                    </article>
                  ))}
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
