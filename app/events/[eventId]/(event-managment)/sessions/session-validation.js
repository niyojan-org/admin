import { normalizeTitle, toDate } from "./session-helpers";

const CHECKIN_CODE_PATTERN = /^[A-Z0-9]{6}$/;
const MAX_SESSIONS = 30;

const isVenueRequired = (mode) => ["offline", "hybrid"].includes(mode);

const validateSessionForm = (form, context = {}) => {
  const errors = [];
  const title = form.title?.trim();
  const existingTitles = context.existingTitles || [];
  const allowMultipleSessions = context.allowMultipleSessions ?? true;
  const sessionCount = context.sessionCount ?? 0;

  if (!title) {
    errors.push("Session title is required.");
  }

  const start = toDate(form.startTime);
  const end = toDate(form.endTime);

  if (!start) {
    errors.push("Start time is required.");
  }

  if (!end) {
    errors.push("End time is required.");
  }

  if (start && end && end <= start) {
    errors.push("End time must be after start time.");
  }

  if (isVenueRequired(context.mode) && !form.venue?.name?.trim()) {
    errors.push(`Venue name is required for ${context.mode} events.`);
  }

  if (!context.isEditMode && sessionCount >= MAX_SESSIONS) {
    errors.push("You can only add up to 30 sessions per event.");
  }

  if (!context.isEditMode && !allowMultipleSessions) {
    errors.push("Only one session is allowed for this event.");
  }

  if (title) {
    const normalized = normalizeTitle(title);
    const normalizedOriginal = normalizeTitle(context.originalTitle);
    const isDuplicate = existingTitles.some(
      (existing) => normalizeTitle(existing) === normalized,
    );

    if (isDuplicate && normalized !== normalizedOriginal) {
      errors.push("Session titles must be unique for this event.");
    }
  }

  if (form.allowCheckIn && !context.isEditMode) {
    const checkInStart = toDate(form.checkInStartTime);
    const checkInEnd = toDate(form.checkInEndTime);
    const checkInCode = (form.checkInCode || "").trim();

    if (!checkInStart || !checkInEnd) {
      errors.push("Check-in start and end times are required.");
    }

    if (!checkInCode) {
      errors.push("Check-in code is required.");
    } else if (!CHECKIN_CODE_PATTERN.test(checkInCode)) {
      errors.push("Check-in code must be 6 uppercase alphanumeric characters.");
    }

    if (start && end && checkInStart && checkInEnd) {
      const earliestStart = new Date(start.getTime() - 24 * 60 * 60 * 1000);

      if (checkInStart < earliestStart) {
        errors.push("Check-in can start at most 24 hours before the session.");
      }

      if (checkInStart > end) {
        errors.push("Check-in start must be before the session ends.");
      }

      if (checkInEnd > end) {
        errors.push("Check-in must end before the session ends.");
      }

      if (checkInEnd < checkInStart) {
        errors.push("Check-in end must be after the check-in start.");
      }
    }
  }

  return errors;
};

export { validateSessionForm };
