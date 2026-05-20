const sourceMeta = {
  event: { label: "Event", tone: "secondary" },
  organization: { label: "Organization", tone: "outline" },
  session: { label: "Session", tone: "warning" },
  ticket: { label: "Ticket", tone: "success" },
};

export const getSourceMeta = (sourceType) =>
  sourceMeta[sourceType] || { label: "General", tone: "outline" };

export const formatFieldLabel = (field) => {
  if (!field) return null;

  return String(field)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const getPublishErrorTarget = (eventPath, error) => {
  if (!eventPath) return null;

  if (error?.sourceType === "session") {
    if (error?.sourceId) {
      return {
        href: `/events/${eventPath}/sessions/edit?id=${error.sourceId}`,
        label: "Open session",
      };
    }

    return {
      href: `/events/${eventPath}/sessions`,
      label: "Open sessions",
    };
  }

  if (error?.sourceType === "ticket") {
    if (error?.sourceId) {
      return {
        href: `/events/${eventPath}/tickets/edit?id=${error.sourceId}`,
        label: "Open ticket",
      };
    }

    return {
      href: `/events/${eventPath}/tickets`,
      label: "Open tickets",
    };
  }

  return {
    href: `/events/${eventPath}`,
    label: "Review event",
  };
};

export const getPublishSummary = (errors) => {
  const safeErrors = Array.isArray(errors) ? errors : [];
  const sourceCounts = safeErrors.reduce((acc, error) => {
    const key = error?.sourceType || "general";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const uniqueTargets = new Set(
    safeErrors.map(
      (error) => `${error?.sourceType || "general"}:${error?.sourceId || error?.field || error?.code}`,
    ),
  );

  return {
    blockerCount: safeErrors.length,
    targetCount: uniqueTargets.size,
    sourceCounts,
  };
};
