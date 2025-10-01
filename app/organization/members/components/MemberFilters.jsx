"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw } from 'lucide-react';

const MemberFilters = ({ 
  filters, 
  onFilterChange, 
  onReset 
}) => {
  const roles = [
    { value: 'all_roles', label: 'All Roles' },
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'member', label: 'Member' },
    { value: 'volunteer', label: 'Volunteer' }
  ];

  const membershipStatuses = [
    { value: 'all_statuses', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const genders = [
    { value: 'all_genders', label: 'All Genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer Not to Say' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'organization.role', label: 'Role' },
    { value: 'createdAt', label: 'Join Date' },
    { value: 'isVerified', label: 'Verification Status' },
    { value: 'organization.status', label: 'Membership Status' }
  ];

  const handleVerifiedChange = (checked) => {
    onFilterChange('isVerified', checked ? true : null);
  };

  // Helper functions to convert between display values and API values
  const getDisplayValue = (filterValue, type) => {
    if (!filterValue || filterValue === '') {
      switch (type) {
        case 'role': return 'all_roles';
        case 'status': return 'all_statuses';
        case 'gender': return 'all_genders';
        default: return '';
      }
    }
    return filterValue;
  };

  const getApiValue = (displayValue, type) => {
    const allValues = {
      'all_roles': '',
      'all_statuses': '',
      'all_genders': ''
    };
    return allValues[displayValue] !== undefined ? allValues[displayValue] : displayValue;
  };

  const handleRoleChange = (value) => {
    onFilterChange('role', getApiValue(value, 'role'));
  };

  const handleStatusChange = (value) => {
    onFilterChange('orgMembership', getApiValue(value, 'status'));
  };

  const handleGenderChange = (value) => {
    onFilterChange('gender', getApiValue(value, 'gender'));
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key];
      return value !== null && 
             value !== undefined && 
             value !== '' && 
             key !== 'page' && 
             key !== 'limit' && 
             key !== 'sortBy' && 
             key !== 'order' && 
             key !== 'format' &&
             key !== 'search';
    }).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} active</Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={activeFiltersCount === 0}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Role Filter */}
        <div className="space-y-2">
          <Label>Role</Label>
          <Select
            value={getDisplayValue(filters.role, 'role')}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Membership Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={getDisplayValue(filters.orgMembership, 'status')}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {membershipStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gender Filter */}
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select
            value={getDisplayValue(filters.gender, 'gender')}
            onValueChange={handleGenderChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {genders.map((gender) => (
                <SelectItem key={gender.value} value={gender.value}>
                  {gender.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Verification Filter */}
        <div className="space-y-2">
          <Label>Email Verified</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="verified-filter"
              checked={filters.isVerified === true}
              onCheckedChange={handleVerifiedChange}
            />
            <Label htmlFor="verified-filter">
              {filters.isVerified === true ? 'Verified Only' : 'All Members'}
            </Label>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={filters.sortBy || 'createdAt'}
            onValueChange={(value) => onFilterChange('sortBy', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Select
            value={filters.order || 'desc'}
            onValueChange={(value) => onFilterChange('order', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.role && (
              <Badge variant="outline" className="flex items-center gap-1">
                Role: {filters.role}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onFilterChange('role', '')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            {filters.orgMembership && (
              <Badge variant="outline" className="flex items-center gap-1">
                Status: {filters.orgMembership}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onFilterChange('orgMembership', '')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            {filters.gender && (
              <Badge variant="outline" className="flex items-center gap-1">
                Gender: {filters.gender}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onFilterChange('gender', '')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            {filters.isVerified === true && (
              <Badge variant="outline" className="flex items-center gap-1">
                Verified Only
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onFilterChange('isVerified', null)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberFilters;
