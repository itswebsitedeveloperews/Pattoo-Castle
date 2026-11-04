// Keep Contentful's existing format and quality; only vary the delivered width.
export function imageAtWidth(src, width) {
  try {
    const url = new URL(src);
    if (!["images.ctfassets.net", "images.contentful.com"].includes(url.hostname) || !url.searchParams.has("fm")) return src;
    url.searchParams.set("w", String(width));
    return url.toString();
  } catch {
    return src;
  }
}

export function imageSrcSet(src, widths = [320, 480, 640, 800, 1080, 1440, 1920]) {
  if (imageAtWidth(src, 320) === src) return undefined;
  return widths.map((width) => `${imageAtWidth(src, width)} ${width}w`).join(", ");
}
