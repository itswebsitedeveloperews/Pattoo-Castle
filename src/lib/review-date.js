export function formatReviewAge(value, now = new Date()) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const elapsed = Math.max(0, now.getTime() - date.getTime());
  let months = (now.getUTCFullYear() - date.getUTCFullYear()) * 12
    + now.getUTCMonth() - date.getUTCMonth();
  if (now.getUTCDate() < date.getUTCDate()) months -= 1;
  const years = Math.floor(months / 12);
  const days = Math.floor(elapsed / 86400000);
  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor(elapsed / 60000);
  const [count, unit] = years >= 1 ? [years, "year"]
    : months >= 1 ? [months, "month"]
    : days >= 1 ? [days, "day"]
    : hours >= 1 ? [hours, "hour"]
    : minutes >= 1 ? [minutes, "minute"]
    : [0, "minute"];

  return count === 0 ? "Just now" : `${count} ${unit}${count === 1 ? "" : "s"} ago`;
}
