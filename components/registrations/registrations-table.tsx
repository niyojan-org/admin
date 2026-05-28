'use client';

import { useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { REGISTRATION_STATUS_OPTIONS } from './registrations-constants';

export interface Registration {
  _id: string;
  eventId: string;
  ticketId: string;
  participantsCount: number;
  status: string;
  pricing: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    currency: string;
  };
  participantIds: Array<{
    _id: string;
    name: string;
    email: string;
    phone: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface RegistrationsTableProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  registrations: Registration[];
  onSort: (column: string, order: 'asc' | 'desc') => void;
  onRefresh: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  APPROVAL_PENDING: 'bg-yellow-100 text-yellow-800',
  PENDING_PAYMENT: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-200 text-gray-700',
};

const SortHeader = ({ column, label, onSort }: { column: string; label: string; onSort: (column: string) => void }) => (
  <div
    className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
    onClick={() => onSort(column)}
  >
    {label}
    <ArrowUpDown className="h-4 w-4 opacity-50" />
  </div>
);

export function RegistrationsTable({ sortBy, sortOrder, registrations, onSort, onRefresh }: RegistrationsTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusUpdate = useCallback(
    async (registrationId: string, newStatus: string) => {
      try {
        setUpdating(registrationId);
        const response = await api.patch(`/registrations/${registrationId}`, { status: newStatus });

        if (response.data.success) {
          toast.success(`Status updated to ${newStatus}`);
          onRefresh();
        }
      } catch (error) {
        console.error('Failed to update status:', error);
        toast.error('Failed to update registration status');
      } finally {
        setUpdating(null);
      }
    },
    [onRefresh],
  );

  const handleSort = (column: string) => {
    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(column, newOrder);
  };

  if (!registrations.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No registrations found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">
              <SortHeader column="createdAt" label="Date" onSort={handleSort} />
            </TableHead>
            <TableHead>Participant</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right w-24">Count</TableHead>
            <TableHead className="text-right w-28">Total</TableHead>
            <TableHead className="w-32">
              <SortHeader column="status" label="Status" onSort={handleSort} />
            </TableHead>
            <TableHead className="w-12 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((reg) => {
            const firstParticipant = reg.participantIds[0];
            return (
              <TableRow key={reg._id}>
                <TableCell className="font-medium text-sm">{formatDate(reg.createdAt)}</TableCell>
                <TableCell className="text-sm">{firstParticipant?.name || '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div>{firstParticipant?.email || '-'}</div>
                  <div>{firstParticipant?.phone || '-'}</div>
                </TableCell>
                <TableCell className="text-right text-sm font-medium">{reg.participantsCount}</TableCell>
                <TableCell className="text-right text-sm font-medium">
                  {reg.pricing.currency} {reg.pricing.total}
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_COLORS[reg.status]}>{reg.status.replace(/_/g, ' ')}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={updating === reg._id}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="px-2 py-1.5 text-sm font-semibold">Update Status</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={reg.status}
                        onValueChange={(newStatus) => handleStatusUpdate(reg._id, newStatus)}
                      >
                        {REGISTRATION_STATUS_OPTIONS.map((statusOption) => (
                          <DropdownMenuRadioItem key={statusOption.value} value={statusOption.value}>
                            {statusOption.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
