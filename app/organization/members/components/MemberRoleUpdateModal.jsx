"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Shield, AlertTriangle, CheckCircle2, User, Mail, Crown } from 'lucide-react';
import { IconHomeEdit } from '@tabler/icons-react';

const MemberRoleUpdateModal = ({
  open,
  onClose,
  member,
  onSubmit
}) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      value: 'admin',
      label: 'Admin',
      description: 'Can manage members and organization settings',
      permissions: ['Manage Members', 'Organization Settings', 'Event Management', 'View Reports'],
      icon: Crown,
      color: 'text-purple-600'
    },
    {
      value: 'manager',
      label: 'Manager',
      description: 'Can manage events and view reports',
      permissions: ['Event Management', 'View Reports', 'Member Directory'],
      icon: Shield,
      color: 'text-blue-600'
    },
    {
      value: 'member',
      label: 'Member',
      description: 'Can participate in events',
      permissions: ['Event Participation', 'Profile Management'],
      icon: User,
      color: 'text-green-600'
    },
    {
      value: 'volunteer',
      label: 'Volunteer',
      description: 'Can help with events',
      permissions: ['Event Assistance', 'Profile Management'],
      icon: User,
      color: 'text-orange-600'
    }
  ];

  React.useEffect(() => {
    if (member) {
      setSelectedRole(member.organization?.role || '');
    }
  }, [member]);

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

  const handleSubmit = async () => {
    if (!selectedRole || selectedRole === member?.organization?.role) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(member._id, selectedRole);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update member role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError('');
      setSelectedRole(member?.organization?.role || '');
      onClose();
    }
  };

  if (!member) return null;

  const currentRole = member.organization?.role;
  const selectedRoleData = roles.find(role => role.value === selectedRole);
  const hasChanges = selectedRole !== currentRole;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] w-full max-h-[90vh] overflow-y-auto p-3">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-start gap-3">
            <div className="flex items-center justify-center p-2 rounded-full bg-primary/10">
              <IconHomeEdit className="w-7 h-7 text-primary" />
            </div>
            <div className='text-start'>
              <h2 className="text-xl font-semibold">Update Member Role</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Modify permissions and access level for this member
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Member Info Card */}
          <Card className={'py-1 px-2'}>
            <CardContent className="p-0">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-border">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-secondary text-white">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Current Role:</span>
                    <Badge variant={getRoleBadgeVariant(currentRole)} className="font-medium">
                      {currentRole?.charAt(0).toUpperCase() + currentRole?.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Role Selection */}
          <Card className={'p-2 py-3 gap-2'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Select New Role
              </CardTitle>
              <CardDescription>
                Choose the appropriate role based on the member's responsibilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-16 w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <SelectItem
                        key={role.value}
                        value={role.value}
                        disabled={role.value === currentRole}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3 py-2">
                          <IconComponent className={`w-4 h-4 ${role.color}`} />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{role.label}</span>
                              {role.value === currentRole && (
                                <Badge variant="outline" className="text-xs">Current</Badge>
                              )}
                            </div>
                            <span className="text-xs">{role.description}</span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Role Permissions Preview */}
          {selectedRoleData && (
            <Card className={'p-4 gap-2'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Permissions for {selectedRoleData.label}
                </CardTitle>
                <CardDescription>
                  This role will have access to the following features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedRoleData.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20">
                        <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        {permission}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warning for role changes */}
          {hasChanges && (
            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>Important:</strong> Changing the member's role will immediately update their permissions.
                The member will be notified via email about this change.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator className="my-6" />

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !hasChanges}
            className="min-w-[130px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Update Role
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberRoleUpdateModal;
