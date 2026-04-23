// Session validation utilities
export const validateSession = (session, eventMode) => {
    const errors = [];

    if (!session.title?.trim()) {
        errors.push('Session title is required');
    }

    if (!session.startTime) {
        errors.push('Start time is required');
    }

    if (!session.endTime) {
        errors.push('End time is required');
    }

    if (session.startTime && session.endTime) {
        const startDate = new Date(session.startTime);
        const endDate = new Date(session.endTime);
        const now = new Date();

        if (startDate >= endDate) {
            errors.push('End time must be after start time');
        }

        if (startDate < now) {
            errors.push('Session cannot be scheduled in the past');
        }
    }

    // Venue validation for offline/hybrid events
    if ((eventMode === 'offline' || eventMode === 'hybrid') && session.venue) {
        const requiredVenueFields = ['name', 'address', 'city', 'state', 'country', 'zipCode'];
        for (const field of requiredVenueFields) {
            if (!session.venue[field]?.trim()) {
                errors.push(`Venue ${field} is required for ${eventMode} events`);
            }
        }
    }

    return errors;
};

// Format datetime for input fields
export const formatDateTimeLocal = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 16);
};

// Check if sessions overlap
export const checkSessionOverlap = (newSession, existingSessions, excludeId = null) => {
    const newStart = new Date(newSession.startTime);
    const newEnd = new Date(newSession.endTime);

    return existingSessions.some(session => {
        if (excludeId && session._id === excludeId) return false;
        
        const existingStart = new Date(session.startTime);
        const existingEnd = new Date(session.endTime);

        return (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
        );
    });
};

// Sort sessions chronologically
export const sortSessionsByTime = (sessions) => {
    return [...sessions].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
};
