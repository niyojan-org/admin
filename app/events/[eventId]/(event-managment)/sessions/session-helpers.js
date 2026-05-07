const toDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateTime = (value) => {
  const date = toDate(value);
  if (!date) return "Not scheduled";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const getDurationLabel = (start, end) => {
  const startDate = toDate(start);
  const endDate = toDate(end);
  if (!startDate || !endDate) return "Duration not set";

  const minutes = Math.max(Math.round((endDate - startDate) / 60000), 0);
  if (minutes < 60) return `${minutes} mins`;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
};

const normalizeTitle = (value) => (value || "").trim().toLowerCase();

export { formatDateTime, getDurationLabel, normalizeTitle, toDate };
