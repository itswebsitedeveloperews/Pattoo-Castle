"use client";

import { usePathname } from "next/navigation";

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

export default function HeaderMenuLink({ item }) {
  const pathname = usePathname();
  const href = item.url || "#";
  const isActive =
    !isExternalUrl(href) && normalizePath(pathname) === normalizePath(href);
  const className = isActive ? "is-active" : undefined;

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={className}
      href={href}
    >
      {item.name}
    </a>
  );
}
