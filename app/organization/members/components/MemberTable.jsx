"use client";

import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail, 
  MailX, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

import MemberRoleUpdateModal from './MemberRoleUpdateModal';
import MemberRemoveDialog from './MemberRemoveDialog';
import TablePagination from './TablePagination';

const MemberTable = ({
  members = [],
  pagination,
  loading,
  selectedMembers,
  onSelectMember,
  onSelectAll,
  isSelected,
  isAllSelected,
  onRoleUpdate,
  onRemoveMember,
  onResendInvitation,
  onCancelInvitation,
  onPageChange,
  onLimitChange,
  filters
}) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    field: filters?.sortBy || 'createdAt',
    direction: filters?.order || 'desc'
  });

  const getRoleBadgeVariant = (role) => {
    const variants = {
      owner: 'destructive',
      admin: 'default',
      manager: 'secondary',
      member: 'outline',
      volunteer: 'outline'
    };
    return variants[role] || 'outline';
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      inactive: 'outline'
    };
    return variants[status] || 'outline';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSort = (field) => {
    const direction = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, direction });
    // You can trigger a re-fetch with new sorting here
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  const handleEditRole = (member) => {
    setSelectedMember(member);
    setShowRoleModal(true);
  };

  const handleRemoveMember = (member) => {
    setSelectedMember(member);
    setShowRemoveDialog(true);
  };

  const canManageMember = (member) => {
    // Add your permission logic here
    // For now, assume user can manage if member is not an owner
    return member.organization.role !== 'owner';
  };

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading members...</p>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">No members found</h3>
          <p className="text-gray-500 mt-2">
            {filters?.search ? 'Try adjusting your search or filters' : 'Start by adding some members to your organization'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected()}
                onCheckedChange={onSelectAll}
                aria-label="Select all members"
              />
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('name')}
                className="h-auto p-0 font-medium"
              >
                Member
                {getSortIcon('name')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('organization.role')}
                className="h-auto p-0 font-medium"
              >
                Role
                {getSortIcon('organization.role')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('organization.status')}
                className="h-auto p-0 font-medium"
              >
                Status
                {getSortIcon('organization.status')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('isVerified')}
                className="h-auto p-0 font-medium"
              >
                Verified
                {getSortIcon('isVerified')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('createdAt')}
                className="h-auto p-0 font-medium"
              >
                Joined
                {getSortIcon('createdAt')}
              </Button>
            </TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member._id}>
              <TableCell>
                <Checkbox
                  checked={isSelected(member._id)}
                  onCheckedChange={() => onSelectMember(member._id)}
                  aria-label={`Select ${member.name}`}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                    {member.phone_number && (
                      <div className="text-xs text-gray-400">{member.phone_number}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(member.organization.role)}>
                  {member.organization.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(member.organization.status)}>
                  {member.organization.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={member.isVerified ? 'default' : 'secondary'}>
                  {member.isVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </TableCell>
              <TableCell>
                {member.organization.joinedAt ? 
                  formatDate(member.organization.joinedAt) : 
                  formatDate(member.createdAt)
                }
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canManageMember(member) && (
                      <>
                        <DropdownMenuItem onClick={() => handleEditRole(member)}>
                          <Shield className="w-4 h-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    {member.organization.status === 'pending' && (
                      <>
                        <DropdownMenuItem onClick={() => onResendInvitation(member._id)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Resend Invitation
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onCancelInvitation(member._id)}
                          className="text-destructive"
                        >
                          <MailX className="w-4 h-4 mr-2" />
                          Cancel Invitation
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {canManageMember(member) && member.organization.status !== 'pending' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleRemoveMember(member)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          pagination={pagination}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          loading={loading}
        />
      )}

      {/* Modals */}
      <MemberRoleUpdateModal
        open={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSubmit={onRoleUpdate}
      />

      <MemberRemoveDialog
        open={showRemoveDialog}
        onClose={() => {
          setShowRemoveDialog(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onConfirm={onRemoveMember}
      />
    </div>
  );
};

export default MemberTable;
