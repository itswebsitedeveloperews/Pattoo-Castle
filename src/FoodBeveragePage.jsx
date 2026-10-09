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
import styles from "./FoodBeveragePage.module.css";

function getFoodBeverageContent(entry) {
  const fields = entry?.fields || {};

  return {
    bannerImage: getContentfulAssetSrc(fields.bannerImage),
    bannerHeading: fields.bannerHeading || fields.title || "",
    image: getContentfulImage(fields.foodBeverageImage),
    content: fields.foodBeverageContent || null,
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

  return (
    <>
      <AosInitializer />
      <SiteHeader header={header} />
      <main className="site-main">
        <section
          className="pt-0 pb-0 section page-hero accommodation-hero food-beverage-hero"
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
            {foodBeverage.bannerHeading && (
              <h1
                id="food-beverage-title"
                data-aos="fade-up"
                data-aos-delay="60"
              >
                {foodBeverage.bannerHeading}
              </h1>
            )}
          </div>
        </section>
        {(foodBeverage.image?.src || foodBeverage.content) && (
          <section
            className={`section ${styles.foodBeverageSection}`}
            aria-label="Food and beverage at Pattoo Castle"
          >
            <div
              className={`wrap ${styles.inner}${
                !foodBeverage.image?.src || !foodBeverage.content
                  ? ` ${styles.singleColumn}`
                  : ""
              }`}
            >
              {foodBeverage.image?.src && (
                <img
                  className={styles.image}
                  src={foodBeverage.image.src}
                  alt={foodBeverage.image.alt || "Food and beverage at Pattoo Castle"}
                  loading="lazy"
                />
              )}
              {foodBeverage.content && (
                <div className={styles.content}>
                  {richTextToReact(
                    foodBeverage.content,
                    "food-beverage-content",
                    true,
                  )}
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
