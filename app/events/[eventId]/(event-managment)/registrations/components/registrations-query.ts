import {
  REGISTRATION_STATUS_VALUES,
  REGISTRATIONS_DEFAULTS,
  REGISTRATIONS_LIMITS,
  REGISTRATIONS_SORT_FIELDS,
} from './registrations-constants';

export type RegistrationsQuery = {
  status: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search: string;
};

type SearchParamValue = string | string[] | undefined;

const getParam = (value: SearchParamValue) => (Array.isArray(value) ? value[0] : value);

export function parseRegistrationsSearchParams(searchParams: Record<string, SearchParamValue>): RegistrationsQuery {
  const rawStatus = getParam(searchParams.status);
  const status = REGISTRATION_STATUS_VALUES.includes(rawStatus as (typeof REGISTRATION_STATUS_VALUES)[number])
    ? (rawStatus as string)
    : REGISTRATIONS_DEFAULTS.status;

  const rawPage = Number(getParam(searchParams.page));
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : REGISTRATIONS_DEFAULTS.page;

  const rawLimit = Number(getParam(searchParams.limit));
  const limit = REGISTRATIONS_LIMITS.includes(rawLimit as (typeof REGISTRATIONS_LIMITS)[number])
    ? rawLimit
    : REGISTRATIONS_DEFAULTS.limit;

  const rawSortBy = getParam(searchParams.sortBy);
  const sortBy = REGISTRATIONS_SORT_FIELDS.includes(rawSortBy as (typeof REGISTRATIONS_SORT_FIELDS)[number])
    ? (rawSortBy as string)
    : REGISTRATIONS_DEFAULTS.sortBy;

  const rawSortOrder = getParam(searchParams.sortOrder);
  const sortOrder = rawSortOrder === 'asc' || rawSortOrder === 'desc' ? rawSortOrder : REGISTRATIONS_DEFAULTS.sortOrder;

  const rawSearch = getParam(searchParams.search);
  const search = rawSearch ? rawSearch.trim() : REGISTRATIONS_DEFAULTS.search;

  return {
    status,
    page,
    limit,
    sortBy,
    sortOrder,
    search,
  };
}

export function buildRegistrationsQuery(params: RegistrationsQuery) {
  const query = new URLSearchParams();
  const searchValue = params.search.trim();

  if (params.status !== REGISTRATIONS_DEFAULTS.status) {
    query.set('status', params.status);
  }
  if (params.page !== REGISTRATIONS_DEFAULTS.page) {
    query.set('page', String(params.page));
  }
  if (params.limit !== REGISTRATIONS_DEFAULTS.limit) {
    query.set('limit', String(params.limit));
  }
  if (params.sortBy !== REGISTRATIONS_DEFAULTS.sortBy) {
    query.set('sortBy', params.sortBy);
  }
  if (params.sortOrder !== REGISTRATIONS_DEFAULTS.sortOrder) {
    query.set('sortOrder', params.sortOrder);
  }
  if (searchValue !== REGISTRATIONS_DEFAULTS.search) {
    query.set('search', searchValue);
  }

  return query.toString();
}
