"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  X, 
  Shield, 
  Trash2, 
  Mail, 
  MoreHorizontal,
  Users
} from 'lucide-react';

const BulkActions = ({ 
  selectedMembers, 
  onClearSelection, 
  onBulkAction 
}) => {
  const selectedCount = selectedMembers.length;

  const handleBulkRoleUpdate = (newRole) => {
    onBulkAction('updateRole', { memberIds: selectedMembers, newRole });
  };

  const handleBulkRemove = () => {
    onBulkAction('remove', { memberIds: selectedMembers });
  };

  const handleBulkResendInvitations = () => {
    onBulkAction('resendInvitations', { memberIds: selectedMembers });
  };

  const handleBulkCancelInvitations = () => {
    onBulkAction('cancelInvitations', { memberIds: selectedMembers });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {selectedCount} selected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear selection
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Role Update Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Change Role
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkRoleUpdate('admin')}>
                  Set as Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkRoleUpdate('manager')}>
                  Set as Manager
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkRoleUpdate('member')}>
                  Set as Member
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkRoleUpdate('volunteer')}>
                  Set as Volunteer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4 mr-2" />
                  More Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleBulkResendInvitations}>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Invitations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBulkCancelInvitations}>
                  <Mail className="w-4 h-4 mr-2" />
                  Cancel Invitations
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleBulkRemove}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Members
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkActions;
