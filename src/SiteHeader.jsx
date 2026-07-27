"use client";

import { useState } from "react";
import HeaderMenuLink from "./HeaderMenuLink";

function getSocialLinkLabel(index) {
  return `Pattoo Castle social link ${index + 1}`;
}

export default function SiteHeader({ header }) {
  const [openMobileSubmenuIndex, setOpenMobileSubmenuIndex] = useState(null);
  const hasHeaderButton = Boolean(header.buttonText && header.buttonUrl);
  const hasMobileMenu = Boolean(
    header.menuItems.length || hasHeaderButton || header.socialLinks.length,
  );
  const toggleMobileSubmenu = (index) => {
    setOpenMobileSubmenuIndex((currentIndex) =>
      currentIndex === index ? null : index,
    );
  };

  return (
    <header className="site-header">
      {header.logo?.src && (
        <div className="navbar-logo">
          <a className="brand" href="/" aria-label="Pattoo Castle home">
            <img
              src={header.logo.src}
              alt={header.logo.alt || "Pattoo Castle"}
            />
          </a>
        </div>
      )}

      <div className="right-header">
        {header.menuItems.length > 0 && (
          <nav className="primary-nav" aria-label="Primary navigation">
            {header.menuItems.map((item, index) => (
              <HeaderMenuLink
                item={item}
                key={`${item.name}-${index}`}
                variant="desktop"
              />
            ))}
            {hasHeaderButton && (
              <a
                className="button button--light enquire-link"
                href={header.buttonUrl}
              >
                {header.buttonText}
              </a>
            )}
          </nav>
        )}

        <div className="header-actions">
          {header.socialLinks.map((item, index) => (
            <a
              className="social-link"
              href={item.url || "#"}
              key={`${item.url}-${index}`}
              aria-label={getSocialLinkLabel(index)}
            >
              {item.icon?.src && (
                <img
                  src={item.icon.src}
                  alt={item.icon.alt || getSocialLinkLabel(index)}
                />
              )}
            </a>
          ))}
        </div>

        {hasMobileMenu && (
          <details className="mobile-menu">
            <summary aria-label="Open menu">
              <span />
              <span />
              <span />
            </summary>

            <div className="mobile-menu-panel">
              {header.menuItems.length > 0 && (
                <nav className="mobile-nav" aria-label="Mobile navigation">
                  {header.menuItems.map((item, index) => (
                    <HeaderMenuLink
                      isOpen={openMobileSubmenuIndex === index}
                      item={item}
                      key={`${item.name}-${index}`}
                      onToggle={() => toggleMobileSubmenu(index)}
                      variant="mobile"
                    />
                  ))}
                  {hasHeaderButton && (
                    <a
                      className="button button--light enquire-link"
                      href={header.buttonUrl}
                    >
                      {header.buttonText}
                    </a>
                  )}
                </nav>
              )}

              {(hasHeaderButton || header.socialLinks.length > 0) && (
                <div className="mobile-header-actions">
                  <div className="mobile-header-social">
                    {header.socialLinks.map((item, index) => (
                      <a
                        className="social-link"
                        href={item.url || "#"}
                        key={`${item.url}-${index}`}
                        aria-label={getSocialLinkLabel(index)}
                      >
                        {item.icon?.src && (
                          <img
                            src={item.icon.src}
                            alt={item.icon.alt || getSocialLinkLabel(index)}
                          />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </header>
  );
}
