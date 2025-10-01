"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { toast } from 'sonner';

import MemberTable from './components/MemberTable';
import MemberFilters from './components/MemberFilters';
import AddMemberModal from './components/AddMemberModal';
import MemberStatsCards from './components/MemberStatsCards';
import BulkActions from './components/BulkActions';
import ExportMembers from './components/ExportMembers';

import { useMembers } from './hooks/useMembers';
import { useMemberFilters } from './hooks/useMemberFilters';
import { useBulkSelection } from './hooks/useBulkSelection';

const MembersPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    filters,
    updateFilter,
    resetFilters,
    applyFilters
  } = useMemberFilters();

  const {
    members,
    summary,
    pagination,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMemberRole,
    removeMember,
    resendInvitation,
    cancelInvitation
  } = useMembers();

  const {
    selectedMembers,
    selectMember,
    selectAllMembers,
    clearSelection,
    isSelected,
    isAllSelected
  } = useBulkSelection(members);

  // Fetch members on component mount and filter changes
  useEffect(() => {
    const searchFilters = {
      ...filters,
      search: searchQuery
    };
    fetchMembers(searchFilters);
  }, [filters, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddMember = async (memberData) => {
    try {
      await addMember(memberData);
      setShowAddModal(false);
      toast.success('Member added successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add member');
    }
  };

  const handleRoleUpdate = async (memberId, newRole) => {
    try {
      await updateMemberRole(memberId, newRole);
      toast.success('Member role updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(memberId);
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const handleResendInvitation = async (memberId) => {
    try {
      await resendInvitation(memberId);
      toast.success('Invitation resent successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to resend invitation');
    }
  };

  const handleCancelInvitation = async (memberId) => {
    try {
      await cancelInvitation(memberId);
      toast.success('Invitation cancelled successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel invitation');
    }
  };

  const handlePageChange = (page) => {
    updateFilter('page', page);
  };

  const handleLimitChange = (limit) => {
    updateFilter('limit', limit);
    updateFilter('page', 1); // Reset to first page
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Error Loading Members</h3>
          <p className="text-gray-500 mt-2">{error}</p>
          <Button onClick={() => fetchMembers(filters)} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-muted-foreground">Manage your organization members and invitations</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportMembers 
            members={members} 
            filters={filters}
            summary={summary}
          />
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <MemberStatsCards summary={summary} loading={loading} />

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search members by name, email, or phone..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-primary/10' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {Object.keys(filters).some(key => filters[key] && key !== 'page' && key !== 'limit') && (
                <Badge variant="secondary" className="ml-2">
                  {Object.keys(filters).filter(key => filters[key] && key !== 'page' && key !== 'limit').length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <MemberFilters
                filters={filters}
                onFilterChange={updateFilter}
                onReset={resetFilters}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <BulkActions
          selectedMembers={selectedMembers}
          onClearSelection={clearSelection}
          onBulkAction={(action, data) => {
            // Handle bulk actions here
            console.log('Bulk action:', action, data);
          }}
        />
      )}

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <MemberTable
            members={members}
            pagination={pagination}
            loading={loading}
            selectedMembers={selectedMembers}
            onSelectMember={selectMember}
            onSelectAll={selectAllMembers}
            isSelected={isSelected}
            isAllSelected={isAllSelected}
            onRoleUpdate={handleRoleUpdate}
            onRemoveMember={handleRemoveMember}
            onResendInvitation={handleResendInvitation}
            onCancelInvitation={handleCancelInvitation}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            filters={filters}
          />
        </CardContent>
      </Card>

      {/* Add Member Modal */}
      <AddMemberModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMember}
        loading={loading}
      />
    </div>
  );
};

export default MembersPage;
