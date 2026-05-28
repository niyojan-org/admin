'use client';

import { useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { REGISTRATION_STATUS_OPTIONS } from './registrations-constants';

interface RegistrationsFiltersProps {
  status: string;
  search: string;
  onFilterChange: (filters: { status?: string; search?: string }) => void;
}

export function RegistrationsFilters({ status, search, onFilterChange }: RegistrationsFiltersProps) {
  const handleStatusChange = useCallback(
    (value: string) => {
      onFilterChange({ status: value });
    },
    [onFilterChange],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange({ search: e.target.value });
    },
    [onFilterChange],
  );

  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email..."
          value={search}
          onChange={handleSearchChange}
          className="pl-9 h-9"
        />
      </div>
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-40 h-9">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {REGISTRATION_STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
