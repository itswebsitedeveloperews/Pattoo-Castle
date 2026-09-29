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
  const hasHeaderButton1 = Boolean(header.buttonText1 && header.buttonUrl1);
  const hasHeaderActions = Boolean(
    header.socialLinks.length || hasHeaderButton1 || hasHeaderButton,
  );
  const hasMobileMenu = Boolean(
    header.menuItems.length || hasHeaderActions,
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
          </nav>
        )}

        {hasHeaderActions && (
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
                    alt={
                      item.icon.alt || item.label || getSocialLinkLabel(index)
                    }
                  />
                )}
              </a>
            ))}

            {hasHeaderButton1 && (
              <HeaderLink
                className="button button--light header-call-link"
                href={header.buttonUrl1}
              >
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.69 6.45 9.06 7.57C9.17 7.92 9.09 8.31 8.81 8.59L6.62 10.79Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {header.buttonText1}
              </HeaderLink>
            )}

            {hasHeaderButton && (
              <HeaderLink
                className="button button--light enquire-link"
                href={header.buttonUrl}
              >
                {header.buttonText}
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M18 6H9M18 6V15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </HeaderLink>
            )}
          </div>
        )}

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
                  {hasHeaderButton1 && (
                    <HeaderLink
                      className="button button--light header-call-link"
                      href={header.buttonUrl1}
                    >
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.69 6.45 9.06 7.57C9.17 7.92 9.09 8.31 8.81 8.59L6.62 10.79Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {header.buttonText1}
                    </HeaderLink>
                  )}
                  {hasHeaderButton && (
                    <HeaderLink
                      className="button button--light enquire-link"
                      href={header.buttonUrl}
                    >
                      {header.buttonText}
                      <svg
                        aria-hidden="true"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 18L18 6M18 6H9M18 6V15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
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
