'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RegistrationsTable, Registration } from './registrations-table';
import { RegistrationsFilters } from './registrations-filters';
import { RegistrationsPagination } from './registrations-pagination';
import ManagementBanner from '../../../components/management-banner';
import { buildRegistrationsQuery, RegistrationsQuery } from './registrations-query';
import { REGISTRATIONS_DEFAULTS } from './registrations-constants';

interface RegistrationsPageProps {
  registrations: Registration[];
  totalDocs: number;
  totalPages: number;
  query: RegistrationsQuery;
}

export function RegistrationsPage({ registrations, totalDocs, totalPages, query }: RegistrationsPageProps) {
  const router = useRouter();
  const pathname = usePathname();

  const replaceQuery = useCallback(
    (next: Partial<RegistrationsQuery>, resetPage = false) => {
      const nextQuery: RegistrationsQuery = {
        ...query,
        ...next,
        page: resetPage ? REGISTRATIONS_DEFAULTS.page : (next.page ?? query.page),
      };
      const queryString = buildRegistrationsQuery(nextQuery);
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, query, router],
  );

  const handleFilterChange = useCallback(
    (filters: { status?: string; search?: string }) => {
      replaceQuery(filters, true);
    },
    [replaceQuery],
  );

  const handleSort = useCallback(
    (column: string, order: 'asc' | 'desc') => {
      replaceQuery({ sortBy: column, sortOrder: order }, true);
    },
    [replaceQuery],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      replaceQuery({ page: newPage });
    },
    [replaceQuery],
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      replaceQuery({ limit: newLimit }, true);
    },
    [replaceQuery],
  );

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <ManagementBanner />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Event Registrations</h1>
        </div>
        <RegistrationsFilters status={query.status} search={query.search} onFilterChange={handleFilterChange} />
      </div>

      <div className="w-full">
        <div className="w-full max-w-full overflow-x-auto rounded-md border">
          <RegistrationsTable
            registrations={registrations}
            sortBy={query.sortBy}
            sortOrder={query.sortOrder}
            onSort={handleSort}
            onRefresh={() => router.refresh()}
          />
        </div>
      </div>

      <RegistrationsPagination
        page={query.page}
        limit={query.limit}
        totalDocs={totalDocs}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
