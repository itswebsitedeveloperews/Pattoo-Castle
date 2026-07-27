import { readFileSync } from "node:fs";

const files = {
  app: readFileSync("src/App.jsx", "utf8"),
  headerLink: readFileSync("src/HeaderMenuLink.jsx", "utf8"),
  siteHeader: readFileSync("src/SiteHeader.jsx", "utf8"),
  css: readFileSync("src/App.css", "utf8"),
};

const checks = [
  [
    files.app.includes("subMenuItems"),
    "Header content must normalize subMenuItems.",
  ],
  [
    files.app.includes("itemFields.subMenu"),
    "Header content must read the Contentful subMenu field.",
  ],
  [
    files.headerLink.includes("header-menu-item--has-submenu"),
    "HeaderMenuLink must render a submenu wrapper class.",
  ],
  [
    files.headerLink.includes("header-submenu"),
    "HeaderMenuLink must render submenu markup.",
  ],
  [
    files.siteHeader.includes("openMobileSubmenuIndex"),
    "SiteHeader must track open mobile submenu state.",
  ],
  [
    files.siteHeader.includes("setOpenMobileSubmenuIndex"),
    "SiteHeader must update mobile submenu state.",
  ],
  [
    files.siteHeader.includes("mobile-menu-is-open"),
    "SiteHeader must toggle a body class while the mobile menu is open.",
  ],
  [
    files.siteHeader.includes("onToggle={handleMobileMenuToggle}"),
    "Mobile details element must handle toggle events.",
  ],
  [
    files.siteHeader.includes("closeMobileMenu"),
    "SiteHeader must provide a close handler for outside mobile menu clicks.",
  ],
  [
    files.siteHeader.includes("mobile-menu-backdrop") &&
      files.siteHeader.includes("onClick={closeMobileMenu}"),
    "Mobile menu must render a clickable backdrop that closes the menu.",
  ],
  [
    files.css.includes(
      ".primary-nav .header-menu-item--has-submenu:hover .header-submenu",
    ),
    "CSS must open desktop submenu on hover.",
  ],
  [
    files.css.includes(
      ".primary-nav .header-menu-item--has-submenu:focus-within .header-submenu",
    ),
    "CSS must open desktop submenu on keyboard focus.",
  ],
  [
    files.css.includes(
      ".header-menu-item--mobile.header-menu-item--open .header-submenu",
    ),
    "CSS must open mobile submenu when the item is active.",
  ],
  [
    files.css.includes("transform: none;"),
    "Mobile submenu must reset desktop dropdown transforms.",
  ],
  [
    files.css.includes("body.mobile-menu-is-open") &&
      files.css.includes("overflow: hidden;"),
    "Body must disable page scroll while the mobile menu is open.",
  ],
  [
    files.css.includes(".mobile-menu-backdrop"),
    "CSS must style the clickable mobile menu backdrop.",
  ],
];

const failures = checks
  .filter(([passes]) => !passes)
  .map(([, message]) => message);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
