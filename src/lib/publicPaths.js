// Shared by redirects, navigation, metadata and sitemap generation.
export const PAGE_REDIRECTS = {
  "/overview/getting-here": "/getting-here",
  "/overview/about-pattoo-castle": "/about-pattoo-castle",
  "/overview/pattoo-castle-location": "/pattoo-castle-location",
  "/accommodation/villa-inclusion": "/villa-inclusion",
  "/accommodation/villa-details": "/villa-details",
  "/accommodation/outdoors": "/outdoors",
  "/accommodation/food-and-beverage": "/food-and-beverage",
  "/accommodation/staff": "/staff",
  "/events/groups-events": "/groups-events",
  "/events/weddings": "/weddings",
  "/explore-negril/about-negril": "/about-negril",
  "/explore-negril/optional-tours-activities": "/optional-tours-activities",
};

export function publicPath(value) {
  const match = value.match(/^([^?#]*)(.*)$/);
  const path = match[1].replace(/\/+$/, "") || "/";
  return `${PAGE_REDIRECTS[path] || path}${match[2]}`;
}
