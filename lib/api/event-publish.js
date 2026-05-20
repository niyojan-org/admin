import api from "@/lib/api";

const getPayload = (response) => response?.data?.data || response?.data || {};

const toDetailsText = (details) => {
  if (typeof details === "string") return details;
  if (Array.isArray(details)) return details.join(", ");
  return "";
};

const extractErrorList = (payload) => {
  if (Array.isArray(payload?.errors)) return payload.errors;
  if (Array.isArray(payload?.details)) return payload.details;
  if (Array.isArray(payload?.error?.details)) return payload.error.details;
  return [];
};

export const normalizePublishErrors = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => {
    if (typeof item === "string") {
      return {
        message: item,
        code: `UNKNOWN_PUBLISH_RULE_${index + 1}`,
        details: "",
        sourceType: null,
        sourceId: null,
        sourceLabel: null,
        field: null,
      };
    }

    return {
      message: item?.message || "Publish requirement not met",
      code: item?.code || `UNKNOWN_PUBLISH_RULE_${index + 1}`,
      details: toDetailsText(item?.details),
      sourceType: item?.sourceType || null,
      sourceId: item?.sourceId || null,
      sourceLabel: item?.sourceLabel || null,
      field: item?.field || null,
    };
  });
};

export const getPublishTest = async (eventId) => {
  const response = await api.get(`/events/admin/${eventId}/publish-test`);
  const payload = getPayload(response);

  return {
    canPublish: payload?.canPublish === true,
    errors: normalizePublishErrors(extractErrorList(payload)),
    event: payload?.event || null,
    message: response?.data?.message || payload?.message,
  };
};

export const publishEvent = async (eventId) => {
  const response = await api.post(`/events/admin/${eventId}/publish`);
  const payload = getPayload(response);

  return {
    event: payload?.event || null,
    message: response?.data?.message || payload?.message,
  };
};

export const getPublishFailure = (error) => {
  const payload = error?.response?.data || {};

  return {
    code: payload?.code || payload?.error?.code || null,
    message: payload?.message || "Failed to publish event",
    errors: normalizePublishErrors(extractErrorList(payload)),
  };
};
