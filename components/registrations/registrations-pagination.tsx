'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RegistrationsPaginationProps {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function RegistrationsPagination({
  page,
  limit,
  totalDocs,
  totalPages,
  onPageChange,
  onLimitChange,
}: RegistrationsPaginationProps) {
  const safeTotalPages = totalPages || 1;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <Select value={String(limit)} onValueChange={(v) => onLimitChange(parseInt(v))}>
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{totalDocs} total</span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm text-muted-foreground min-w-20 text-center">
          Page {page} of {safeTotalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          className=""
          onClick={() => onPageChange(page + 1)}
          disabled={page >= safeTotalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
