"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getInternalHref, isInternalHref } from "./linkUtils";

function normalizePath(value) {
  if (!value || value === "#" || value.startsWith("#")) {
    return "";
  }

  try {
    const url = new URL(value, "https://pattoo-castle.local");
    return url.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return value.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/";
  }
}

function isExternalUrl(value) {
  if (!value || !/^https?:\/\//i.test(value)) {
    return false;
  }

  if (typeof window === "undefined") {
    return true;
  }

  try {
    return new URL(value).origin !== window.location.origin;
  } catch {
    return true;
  }
}

function getIsActive(pathname, href) {
  const internalHref = getInternalHref(href);

  return (
    !isExternalUrl(internalHref) &&
    normalizePath(pathname) === normalizePath(internalHref)
  );
}

function getMenuSlug(item) {
  const normalizedPath = normalizePath(getInternalHref(item.url || ""));
  const value =
    normalizedPath && normalizedPath !== "/"
      ? normalizedPath.split("/").filter(Boolean).pop()
      : item.name;

  return String(value || "menu")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function NavigationLink({ children, className, href, ...props }) {
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

export default function HeaderMenuLink({
  isOpen = false,
  item,
  onToggle,
  variant = "desktop",
}) {
  const pathname = usePathname();
  const href = item.url || "#";
  const subMenuItems = Array.isArray(item.subMenuItems)
    ? item.subMenuItems
    : [];
  const hasSubmenu = subMenuItems.length > 0;
  const isMegaMenu = Boolean(item.megaMenu);
  const menuSlug = getMenuSlug(item);
  const isActive = getIsActive(pathname, href);
  const hasActiveSubmenuItem = subMenuItems.some((subItem) =>
    getIsActive(pathname, subItem.url || "#"),
  );
  const className = isActive ? "is-active" : undefined;

  if (!hasSubmenu) {
    return (
      <NavigationLink
        aria-current={isActive ? "page" : undefined}
        className={className}
        href={href}
      >
        {item.name}
      </NavigationLink>
    );
  }

  if (variant === "mobile") {
    return (
      <div
        className={`header-menu-item header-menu-item--has-submenu header-menu-item--mobile${
          isOpen ? " header-menu-item--open" : ""
        }${isActive || hasActiveSubmenuItem ? " is-active" : ""}`}
      >
        <div className="header-menu-row">
          <NavigationLink
            aria-current={isActive ? "page" : undefined}
            className={className}
            href={href}
          >
            {item.name}
          </NavigationLink>

          <button
            aria-expanded={isOpen}
            aria-label={`${isOpen ? "Close" : "Open"} ${item.name} submenu`}
            className="header-menu-toggle"
            onClick={onToggle}
            type="button"
          >
            <span aria-hidden="true" className="header-menu-toggle-icon" />
          </button>
        </div>

        <div className="header-submenu">
          {subMenuItems.map((subItem, index) => {
            const subHref = subItem.url || "#";
            const isSubItemActive = getIsActive(pathname, subHref);

            return (
              <NavigationLink
                aria-current={isSubItemActive ? "page" : undefined}
                className={isSubItemActive ? "is-active" : undefined}
                href={subHref}
                key={`${subItem.name}-${index}`}
              >
                {subItem.name}
              </NavigationLink>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`header-menu-item header-menu-item--has-submenu${
        isMegaMenu ? " header-menu-item--mega" : ""
      }${
        isActive || hasActiveSubmenuItem ? " is-active" : ""
      }`}
    >
      <NavigationLink
        aria-current={isActive ? "page" : undefined}
        className={className}
        href={href}
      >
        {item.name}
        <span aria-hidden="true" className="header-menu-caret" />
      </NavigationLink>

      {isMegaMenu ? (
        <div
          className={`header-submenu header-submenu--mega header-megamenu-${menuSlug}${
            item.megaMenuImage?.src ? "" : " header-submenu--mega-no-media"
          }`}
        >
          {item.megaMenuImage?.src && (
            <div className="mega-menu-media">
              <img
                src={item.megaMenuImage.src}
                alt={item.megaMenuImage.alt || item.name}
              />
              <span>{item.megaMenuImage.alt || item.megaMenuTitle || item.name}</span>
            </div>
          )}

          <div className="mega-menu-content">
            <p>{item.name}</p>
            <h2>{item.megaMenuTitle || `Explore ${item.name}`}</h2>
            <div className="mega-menu-links">
              {subMenuItems.map((subItem, index) => {
                const subHref = subItem.url || "#";
                const isSubItemActive = getIsActive(pathname, subHref);

                return (
                  <NavigationLink
                    aria-current={isSubItemActive ? "page" : undefined}
                    className={isSubItemActive ? "is-active" : undefined}
                    href={subHref}
                    key={`${subItem.name}-${index}`}
                  >
                    <span className="mega-menu-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{subItem.name}</span>
                    <span aria-hidden="true" className="mega-menu-arrow">
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
                    </span>
                  </NavigationLink>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="header-submenu">
          {subMenuItems.map((subItem, index) => {
            const subHref = subItem.url || "#";
            const isSubItemActive = getIsActive(pathname, subHref);

            return (
              <NavigationLink
                aria-current={isSubItemActive ? "page" : undefined}
                className={isSubItemActive ? "is-active" : undefined}
                href={subHref}
                key={`${subItem.name}-${index}`}
              >
                {subItem.name}
              </NavigationLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
