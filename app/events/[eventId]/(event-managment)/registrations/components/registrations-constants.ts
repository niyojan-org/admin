export const REGISTRATION_STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'APPROVAL_PENDING', label: 'Approval Pending' },
  { value: 'PENDING_PAYMENT', label: 'Pending Payment' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;

export const REGISTRATION_STATUS_VALUES = REGISTRATION_STATUS_OPTIONS.map((status) => status.value);

export const REGISTRATIONS_DEFAULTS = {
  status: 'CONFIRMED',
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  search: '',
} as const;

export const REGISTRATIONS_SORT_FIELDS = ['createdAt', 'status'] as const;

export const REGISTRATIONS_LIMITS = [10, 20, 50, 100] as const;
