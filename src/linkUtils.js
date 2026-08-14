const INTERNAL_HOST_PATTERNS = [
  "localhost",
  "127.0.0.1",
  "pattoocastle.com",
  "www.pattoocastle.com",
];

export function getInternalHref(value) {
  if (!value || value === "#" || value.startsWith("#")) {
    return value || "#";
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  if (!/^https?:\/\//i.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);
    const currentHost =
      typeof window !== "undefined" ? window.location.hostname : "";
    const isCurrentHost = currentHost && url.hostname === currentHost;
    const isKnownInternalHost = INTERNAL_HOST_PATTERNS.includes(url.hostname);

    if (isCurrentHost || isKnownInternalHost) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return value;
  }

  return value;
}

export function isInternalHref(value) {
  const href = getInternalHref(value);

  return Boolean(
    href &&
      href !== "#" &&
      !href.startsWith("#") &&
      !/^https?:\/\//i.test(href) &&
      !/^(mailto|tel):/i.test(href),
  );
}
