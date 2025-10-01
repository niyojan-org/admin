// Utility functions for event data formatting and validation

// Utility function to format date for API
export const formatDateForAPI = (date) => {
  if (!date) return null;

  // If it's already a Date object, convert to ISO string
  if (date instanceof Date) {
    return date.toISOString();
  }

  // If it's a string, try to parse it
  if (typeof date === 'string') {
    // Check if it's already in ISO format
    if (date.includes('T') && date.includes('Z')) {
      return date;
    }

    // Parse date string and convert to end of day for registration end dates
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      // For registration end dates, set to end of day (23:59:59.999Z)
      parsedDate.setHours(23, 59, 59, 999);
      return parsedDate.toISOString();
    }
  }

  return null;
};

// Utility function to format event data before sending to API
export const formatEventDataForAPI = (eventData) => {
  const formattedData = { ...eventData };

  // Format date fields
  if (formattedData.registrationStart) {
    const startDate = new Date(formattedData.registrationStart);
    startDate.setHours(0, 0, 0, 0); // Start of day
    formattedData.registrationStart = startDate.toISOString();
  }

  if (formattedData.registrationEnd) {
    const endDate = new Date(formattedData.registrationEnd);
    endDate.setHours(23, 59, 59, 999); // End of day
    formattedData.registrationEnd = endDate.toISOString();
  }

  if (formattedData.eventDate) {
    formattedData.eventDate = formatDateForAPI(formattedData.eventDate);
  }

  // Format session dates - handle ISO datetime format
  if (formattedData.sessions && Array.isArray(formattedData.sessions)) {
    formattedData.sessions = formattedData.sessions.map(session => {
      const formattedSession = { ...session };
      
      // If session has separate date, startTime, endTime fields (legacy format), combine them
      if (session.date && session.startTime && session.endTime && 
          typeof session.startTime === 'string' && !session.startTime.includes('T')) {
        const sessionDate = new Date(session.date);
        
        // Parse start time (format: "09:00")
        const [startHour, startMinute] = session.startTime.split(':');
        const startDateTime = new Date(sessionDate);
        startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
        
        // Parse end time (format: "10:30")
        const [endHour, endMinute] = session.endTime.split(':');
        const endDateTime = new Date(sessionDate);
        endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
        
        formattedSession.startTime = startDateTime.toISOString();
        formattedSession.endTime = endDateTime.toISOString();
        
        // Remove the separate date field if it exists
        delete formattedSession.date;
      }
      // If already in ISO datetime format (new format), ensure they are valid ISO strings
      else if (session.startTime && session.endTime) {
        try {
          // Validate and format as ISO strings
          formattedSession.startTime = new Date(session.startTime).toISOString();
          formattedSession.endTime = new Date(session.endTime).toISOString();
        } catch (error) {
          console.warn('Invalid datetime format in session:', session);
          // Keep original values if parsing fails
          formattedSession.startTime = session.startTime;
          formattedSession.endTime = session.endTime;
        }
      }
      
      return formattedSession;
    });
  }

  // Ensure tickets have proper numeric values and handle empty/string values
  if (formattedData.tickets && Array.isArray(formattedData.tickets)) {
    formattedData.tickets = formattedData.tickets.map(ticket => ({
      ...ticket,
      price: ticket.price === '' ? 0 : (parseInt(ticket.price) || 0),
      capacity: ticket.capacity === '' ? 0 : (parseInt(ticket.capacity) || 0)
    }));
  }

  // Handle tags - ensure it's an array and convert string to array if needed
  if (typeof formattedData.tags === 'string') {
    formattedData.tags = formattedData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  } else if (!formattedData.tags || !Array.isArray(formattedData.tags)) {
    formattedData.tags = [];
  }

  // Ensure inputFields is an array (this is what your form uses)
  if (!formattedData.inputFields || !Array.isArray(formattedData.inputFields)) {
    formattedData.inputFields = [];
  }

  // Map inputFields to customFields if your API expects that instead
  // Uncomment the next 3 lines if your API expects 'customFields' instead of 'inputFields'
  // if (formattedData.inputFields) {
  //   formattedData.customFields = formattedData.inputFields;
  //   delete formattedData.inputFields;
  // }

  // Set default boolean values if not provided
  if (typeof formattedData.isPrivate !== 'boolean') {
    formattedData.isPrivate = false;
  }
  if (typeof formattedData.allowMultipleSessions !== 'boolean') {
    formattedData.allowMultipleSessions = true;
  }
  if (typeof formattedData.allowCoupons !== 'boolean') {
    formattedData.allowCoupons = true;
  }
  if (typeof formattedData.autoApproveParticipants !== 'boolean') {
    formattedData.autoApproveParticipants = true;
  }
  if (typeof formattedData.enableEmailNotifications !== 'boolean') {
    formattedData.enableEmailNotifications = true;
  }
  if (typeof formattedData.enableSmsNotifications !== 'boolean') {
    formattedData.enableSmsNotifications = false;
  }
  if (typeof formattedData.feedbackEnabled !== 'boolean') {
    formattedData.feedbackEnabled = true;
  }

  // Remove any undefined or null fields to clean up the payload
  Object.keys(formattedData).forEach(key => {
    if (formattedData[key] === undefined || formattedData[key] === null) {
      delete formattedData[key];
    }
  });

  return formattedData;
};

// Validation function for sessions
export const validateSessions = (sessions, registrationEndDate) => {
  if (!sessions || !Array.isArray(sessions) || !registrationEndDate) {
    return { isValid: true, errors: [] };
  }

  const regEndDate = new Date(registrationEndDate);
  regEndDate.setHours(23, 59, 59, 999); // End of day
  const errors = [];

  sessions.forEach((session, index) => {
    // Check if session has startTime
    if (session.startTime) {
      try {
        const sessionStartTime = new Date(session.startTime);
        
        // Validate session starts after registration ends
        if (sessionStartTime <= regEndDate) {
          errors.push(`Session ${index + 1}: Session must start after registration end date (${regEndDate.toLocaleDateString()})`);
        }
        
        // Validate that end time is after start time
        if (session.endTime) {
          const sessionEndTime = new Date(session.endTime);
          if (sessionEndTime <= sessionStartTime) {
            errors.push(`Session ${index + 1}: End time must be after start time`);
          }
        }
      } catch (error) {
        errors.push(`Session ${index + 1}: Invalid datetime format`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility function to calculate session duration in minutes
export const calculateSessionDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end - start) / (1000 * 60));
  } catch (error) {
    return 0;
  }
};

// Utility function to check if a session conflicts with registration period
export const isSessionAfterRegistration = (sessionStartTime, registrationEndDate) => {
  if (!sessionStartTime || !registrationEndDate) return true;
  
  try {
    const sessionStart = new Date(sessionStartTime);
    const regEnd = new Date(registrationEndDate);
    regEnd.setHours(23, 59, 59, 999);
    return sessionStart > regEnd;
  } catch (error) {
    return false;
  }
};

// Utility function to format datetime for display
export const formatDateTimeForDisplay = (dateTime, options = {}) => {
  if (!dateTime) return '';
  
  try {
    const date = new Date(dateTime);
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  } catch (error) {
    return '';
  }
};
