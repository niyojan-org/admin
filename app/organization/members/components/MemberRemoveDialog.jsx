"use client";

import React, { useState } from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';

const MemberRemoveDialog = ({ 
  open, 
  onClose, 
  member, 
  onConfirm 
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState('');

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

  const handleConfirm = async () => {
    if (!member) return;

    setIsRemoving(true);
    setError('');

    try {
      await onConfirm(member._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to remove member');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleClose = () => {
    if (!isRemoving) {
      setError('');
      onClose();
    }
  };

  if (!member) return null;

  const memberRole = member.organization?.role;
  const memberStatus = member.organization?.status;

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Remove Member
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Are you sure you want to remove this member from your organization? 
                This action cannot be undone.
              </p>

              {/* Member Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getRoleBadgeVariant(memberRole)}>
                      {memberRole}
                    </Badge>
                    <Badge variant={memberStatus === 'active' ? 'default' : 'secondary'}>
                      {memberStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Consequences */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-900">What happens when you remove this member:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• They will lose access to all organization resources</li>
                  <li>• They will be removed from all organization events</li>
                  <li>• Their organization-related data will be archived</li>
                  <li>• They will receive a notification email about the removal</li>
                  {memberStatus === 'pending' && (
                    <li>• Their pending invitation will be cancelled</li>
                  )}
                </ul>
              </div>

              {/* Warning for important roles */}
              {(memberRole === 'admin' || memberRole === 'manager') && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> You are removing a {memberRole} member. 
                    Make sure to transfer any important responsibilities before proceeding.
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isRemoving}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            {isRemoving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Member
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MemberRemoveDialog;
