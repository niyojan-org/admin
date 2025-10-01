"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle,
  Edit,
  MoreHorizontal,
  User
} from 'lucide-react';

import { formatDate, getInitials, getRoleBadgeVariant, getStatusBadgeVariant } from '../utils/memberUtils';

const MemberDetailCard = ({ 
  member, 
  onEdit, 
  onRemove, 
  canEdit = false 
}) => {
  if (!member) return null;

  const {
    name,
    email,
    phone_number,
    avatar,
    gender,
    isVerified,
    createdAt,
    organization
  } = member;

  const { role, status, joinedAt } = organization || {};

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-lg">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getRoleBadgeVariant(role)}>
                  {role}
                </Badge>
                <Badge variant={getStatusBadgeVariant(status)}>
                  {status}
                </Badge>
                {isVerified ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="w-3 h-3 mr-1" />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {canEdit && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-medium">{email}</p>
            </div>
            {phone_number && (
              <div>
                <span className="text-gray-500">Phone:</span>
                <p className="font-medium">{phone_number}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Personal Information */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {gender && (
              <div>
                <span className="text-gray-500">Gender:</span>
                <p className="font-medium capitalize">
                  {gender === 'prefer_not_to_say' ? 'Prefer not to say' : gender}
                </p>
              </div>
            )}
            <div>
              <span className="text-gray-500">Email Verified:</span>
              <p className="font-medium">
                {isVerified ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Organization Information */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Organization Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Role:</span>
              <p className="font-medium capitalize">{role}</p>
            </div>
            <div>
              <span className="text-gray-500">Membership Status:</span>
              <p className="font-medium capitalize">{status}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Timeline Information */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Timeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Account Created:</span>
              <p className="font-medium">{formatDate(createdAt)}</p>
            </div>
            {joinedAt && (
              <div>
                <span className="text-gray-500">Joined Organization:</span>
                <p className="font-medium">{formatDate(joinedAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {canEdit && (
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button onClick={() => onEdit(member)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Member
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onRemove(member)}
              disabled={role === 'owner'}
            >
              Remove Member
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberDetailCard;
