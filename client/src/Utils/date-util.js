export const relativeDate = (timestamp) => {
  const NB_DAYS_YEAR = 365; // nb days on a year
  const NB_HOURS_DAY = 24; // nb hours on a day
  const NB_MINUTES_HOUR = 60; // nb minutes on a hour
  const now    = new Date();
  const utcNow = new Date(now.toUTCString());
  const utcDate = new Date(new Date(timestamp).toUTCString())
  const diffMs = utcNow.getTime() - utcDate.getTime()

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / NB_MINUTES_HOUR);
  const diffDays = Math.floor(diffHours / NB_HOURS_DAY);
  const diffYears = Math.floor(diffDays / NB_DAYS_YEAR);

  if (diffMinutes < 2) return "Posted a few minutes ago";

  if (diffMinutes < NB_MINUTES_HOUR) return `Posted ${diffMinutes} minutes ago`;

  if (diffHours < NB_HOURS_DAY) {
    const hourLabel = diffHours === 1 ? "hour" : "hours";
    return `Posted ${diffHours} ${hourLabel} ago`;
  }

  if (diffDays < NB_DAYS_YEAR) {
    const dayLabel = diffDays === 1 ? "day" : "days";
    return `Posted ${diffDays} ${dayLabel} ago`;
  }

  const yearLabel = diffYears === 1 ? "year" : "years";
  return `Posted ${diffYears} ${yearLabel} ago`;
};
