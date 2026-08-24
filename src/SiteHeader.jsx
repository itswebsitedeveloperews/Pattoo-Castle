"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import HeaderMenuLink from "./HeaderMenuLink";
import { getInternalHref, isInternalHref } from "./linkUtils";

function getSocialLinkLabel(index) {
  return `Pattoo Castle social link ${index + 1}`;
}

function HeaderLink({ children, className, href, ...props }) {
  const internalHref = getInternalHref(href);

  if (isInternalHref(internalHref)) {
    return (
      <Link className={className} href={internalHref} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href} {...props}>
      {children}
    </a>
  );
}

export default function SiteHeader({ header }) {
  const mobileMenuRef = useRef(null);
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
  const handleMobileMenuToggle = (event) => {
    const isOpen = event.currentTarget.open;

    document.body.classList.toggle("mobile-menu-is-open", isOpen);

    if (!isOpen) {
      setOpenMobileSubmenuIndex(null);
    }
  };
  const closeMobileMenu = () => {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }

    document.body.classList.remove("mobile-menu-is-open");
    setOpenMobileSubmenuIndex(null);
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove("mobile-menu-is-open");
    };
  }, []);

  return (
    <header className="site-header">
      {header.logo?.src && (
        <div className="navbar-logo">
          <HeaderLink className="brand" href="/" aria-label="Pattoo Castle home">
            <img
              src={header.logo.src}
              alt={header.logo.alt || "Pattoo Castle"}
            />
          </HeaderLink>
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
              <HeaderLink
                className="button button--light enquire-link"
                href={header.buttonUrl}
              >
                {header.buttonText}
              </HeaderLink>
            )}
          </nav>
        )}

        <div className="header-actions">
          {header.socialLinks.map((item, index) => (
            <a
              className="social-link"
              href={item.url || "#"}
              key={`${item.url}-${index}`}
              aria-label={item.label || getSocialLinkLabel(index)}
            >
              {item.icon?.src && (
                <img
                  src={item.icon.src}
                  alt={item.icon.alt || item.label || getSocialLinkLabel(index)}
                />
              )}
            </a>
          ))}
        </div>

        {hasMobileMenu && (
          <details
            className="mobile-menu"
            onToggle={handleMobileMenuToggle}
            ref={mobileMenuRef}
          >
            <summary aria-label="Open menu">
              <span />
              <span />
              <span />
            </summary>

            <button
              aria-label="Close menu"
              className="mobile-menu-backdrop"
              onClick={closeMobileMenu}
              type="button"
            />

            <div className="mobile-menu-panel">
              {header.menuItems.length > 0 && (
                <nav
                  className="mobile-nav"
                  aria-label="Mobile navigation"
                  onClick={(event) => {
                    if (event.target.closest("a")) {
                      closeMobileMenu();
                    }
                  }}
                >
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
                    <HeaderLink
                      className="button button--light enquire-link"
                      href={header.buttonUrl}
                    >
                      {header.buttonText}
                    </HeaderLink>
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
                        aria-label={item.label || getSocialLinkLabel(index)}
                      >
                        {item.icon?.src && (
                          <img
                            src={item.icon.src}
                            alt={
                              item.icon.alt ||
                              item.label ||
                              getSocialLinkLabel(index)
                            }
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
