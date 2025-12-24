/**
 * Format time remaining for rate limit display
 * @param {number} minutes - Minutes remaining
 * @returns {string} Formatted time string
 */
export const formatWaitTime = (minutes) => {
  if (minutes <= 0) return 'Available now';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m remaining`;
  }
  return `${mins}m remaining`;
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get status badge color
 * @param {string} status - Announcement status
 * @returns {string} Badge variant
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: 'secondary',
    processing: 'default',
    sent: 'success',
    partial: 'warning',
    failed: 'destructive',
    cancelled: 'outline',
  };
  return colors[status] || 'default';
};

/**
 * Get status label
 * @param {string} status - Announcement status
 * @returns {string} Human-readable status
 */
export const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    processing: 'Processing',
    sent: 'Sent',
    partial: 'Partially Sent',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

/**
 * Get priority badge color
 * @param {string} priority - Announcement priority
 * @returns {string} Badge variant
 */
export const getPriorityColor = (priority) => {
  const colors = {
    low: 'outline',
    normal: 'secondary',
    high: 'destructive',
  };
  return colors[priority] || 'default';
};

/**
 * Get message type icon and label
 * @param {string} messageType - Message type
 * @returns {object} Icon component and label
 */
export const getMessageTypeInfo = (messageType) => {
  // Import icons dynamically in components that use this
  const types = {
    whatsapp: { iconName: 'IconBrandWhatsapp', label: 'WhatsApp', className: 'text-green-600' },
    email: { iconName: 'IconMail', label: 'Email', className: 'text-blue-600' },
    both: { iconName: 'IconDeviceMobile', label: 'WhatsApp & Email', className: 'text-purple-600' },
  };
  return types[messageType] || { iconName: 'IconSpeakerphone', label: messageType, className: 'text-gray-600' };
};

/**
 * Calculate success rate percentage
 * @param {number} sent - Successfully sent count
 * @param {number} total - Total count
 * @returns {string} Percentage string
 */
export const calculateSuccessRate = (sent, total) => {
  if (total === 0) return '0.0';
  return ((sent / total) * 100).toFixed(1);
};

/**
 * Replace placeholders in message with participant data
 * @param {string} message - Message template
 * @param {object} participant - Participant data
 * @returns {string} Message with replaced placeholders
 */
export const replacePlaceholders = (message, participant) => {
  return message
    .replace(/{name}/g, participant.name || '')
    .replace(/{email}/g, participant.email || '');
};

/**
 * Validate announcement form data
 * @param {object} data - Form data
 * @returns {object} Validation result with errors
 */
export const validateAnnouncementForm = (data) => {
  const errors = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Message is required';
  } else if (data.message.length > 1000) {
    errors.message = 'Message must be less than 1000 characters';
  }

  if (!data.messageType) {
    errors.messageType = 'Message type is required';
  }

  if (!data.participantIds || data.participantIds.length === 0) {
    errors.participantIds = 'At least one participant must be selected';
  } else if (data.participantIds.length > 1000) {
    errors.participantIds = 'Maximum 1000 participants allowed';
  }

  if (data.isScheduled) {
    if (!data.scheduleDateTime) {
      errors.scheduleDateTime = 'Schedule date/time is required';
    } else {
      const scheduleDate = new Date(data.scheduleDateTime);
      const now = new Date();
      if (scheduleDate <= now) {
        errors.scheduleDateTime = 'Schedule time must be in the future';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get insight icon and color based on type
 * @param {string} type - Insight type
 * @returns {object} Icon name and color classes
 */
export const getInsightStyle = (type) => {
  const styles = {
    success: { iconName: 'IconCircleCheck', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
    warning: { iconName: 'IconAlertTriangle', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
    alert: { iconName: 'IconAlertCircle', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
    info: { iconName: 'IconInfoCircle', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  };
  return styles[type] || styles.info;
};

/**
 * Format delivery stats for display
 * @param {object} stats - Delivery statistics
 * @returns {array} Formatted stats array
 */
export const formatDeliveryStats = (stats) => {
  if (!stats) return [];
  
  return [
    { label: 'Total', value: stats.total, color: 'text-foreground', iconName: 'IconSum' },
    { label: 'Sent', value: stats.sent, color: 'text-green-600', iconName: 'IconCircleCheck' },
    { label: 'Failed', value: stats.failed, color: 'text-red-600', iconName: 'IconAlertCircle' },
    { label: 'Pending', value: stats.pending, color: 'text-orange-600', iconName: 'IconClock' },
  ];
};
