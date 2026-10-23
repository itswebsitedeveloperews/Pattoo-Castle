export function getBookingDates(items) {
  if (!Array.isArray(items)) return [];
  return [...new Set(items.map((item) => {
    const value = item?.fields?.bookingDate;
    if (typeof value !== "string") return "";
    const day = value.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return "";
    const date = new Date(`${day}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === day ? day : "";
  }).filter(Boolean))].sort();
}

export function isBookingRangeAvailable(start, end, availableDates, today) {
  if (!today || !start || !end || start < today || end < start) return false;
  const first = Date.parse(`${start}T00:00:00Z`);
  const last = Date.parse(`${end}T00:00:00Z`);
  const days = (last - first) / 86400000;
  if (!Number.isInteger(days) || days < 0 || days >= availableDates.size) return false;
  for (let offset = 0; offset <= days; offset += 1) {
    const date = new Date(first + offset * 86400000).toISOString().slice(0, 10);
    if (!availableDates.has(date)) return false;
  }
  return true;
}
