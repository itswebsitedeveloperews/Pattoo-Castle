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
        <button
          aria-expanded={isOpen}
          className="header-menu-toggle"
          onClick={onToggle}
          type="button"
        >
          <span>{item.name}</span>
          <span aria-hidden="true" className="header-menu-toggle-icon" />
        </button>

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
        isActive || hasActiveSubmenuItem ? " is-active" : ""
      }`}
    >
      <NavigationLink
        aria-current={isActive ? "page" : undefined}
        className={className}
        href={href}
      >
        {item.name}
      </NavigationLink>

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
