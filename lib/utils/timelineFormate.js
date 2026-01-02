import { parseISO, format, compareAsc } from "date-fns";

export function formatFullTimeline(sessions) {
  if (!sessions.length) return "";

  // Sort sessions by start time
  const sorted = [...sessions].sort((a, b) =>
    compareAsc(parseISO(a.startTime), parseISO(b.startTime))
  );

  const start = parseISO(sorted[0].startTime);
  const end = parseISO(sorted[sorted.length - 1].endTime);

  let dateRange;

  // If year changes
  if (format(start, "yyyy") !== format(end, "yyyy")) {
    dateRange = `${format(start, "MMM d yyyy")} - ${format(end, "MMM d yyyy")}`;
  }
  // If month changes (but same year)
  else if (format(start, "MMM") !== format(end, "MMM")) {
    dateRange = `${format(start, "MMM d")} - ${format(end, "MMM d yyyy")}`;
  }
  // If only day changes
  else if (format(start, "d") !== format(end, "d")) {
    dateRange = `${format(start, "MMM d")}-${format(end, "d yyyy")}`;
  }
  // Same day
  else {
    dateRange = `${format(start, "MMM d yyyy")}`;
  }

  // Time range
  let timeRange;
  if (format(start, "hh:mmaaa") === format(end, "hh:mmaaa")) {
    timeRange = `${format(start, "hh:mmaaa")}`;
  } else {
    timeRange = `${format(start, "hh:mmaaa")} - ${format(end, "hh:mmaaa")}`;
  }

  // Day range
  const dayRange =
    format(start, "EEE") === format(end, "EEE")
      ? format(start, "EEE")
      : `${format(start, "EEE")} - ${format(end, "EEE")}`;

  return `${dateRange} ${timeRange} ${dayRange}`;
}

export function formatDateRange([startISO, endISO]) {
  if (!startISO || !endISO) return "";

  const start = parseISO(startISO);
  const end = parseISO(endISO);

  // Ensure start <= end
  if (compareAsc(start, end) > 0) {
    return formatDateRange([endISO, startISO]); // swap if reversed
  }

  let dateRange;

  // If year changes
  if (format(start, "yyyy") !== format(end, "yyyy")) {
    dateRange = `${format(start, "MMM d yyyy")} - ${format(end, "MMM d yyyy")}`;
  }
  // If month changes (but same year)
  else if (format(start, "MMM") !== format(end, "MMM")) {
    dateRange = `${format(start, "MMM d")} - ${format(end, "MMM d yyyy")}`;
  }
  // If only day changes
  else if (format(start, "d") !== format(end, "d")) {
    dateRange = `${format(start, "MMM d")}-${format(end, "d yyyy")}`;
  }
  // Same day
  else {
    dateRange = `${format(start, "MMM d yyyy")}`;
  }

  // Time range
  let timeRange;
  if (format(start, "hh:mmaaa") === format(end, "hh:mmaaa")) {
    timeRange = `${format(start, "hh:mmaaa")}`;
  } else {
    timeRange = `${format(start, "hh:mmaaa")} - ${format(end, "hh:mmaaa")}`;
  }

  // Day range
  const dayRange =
    format(start, "EEE") === format(end, "EEE")
      ? format(start, "EEE")
      : `${format(start, "EEE")} - ${format(end, "EEE")}`;

  return `${dateRange} ${timeRange} ${dayRange}`;
}
