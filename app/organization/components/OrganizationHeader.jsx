'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconUsers, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { getStatusColor, getStatusIcon } from '../utils/organizationUtils';

export default function OrganizationHeader({ orgData }) {
  const router = useRouter();

  if (!orgData) return null;

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={orgData.logo} alt={orgData.name} />
          <AvatarFallback className="text-lg font-semibold">
            {orgData.name?.substring(0, 2)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{orgData.name}</h1>
          <p className="text-foreground capitalize">
            {orgData.category} • {orgData.subCategory?.replace(/-/g, ' ')}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getStatusColor(orgData.verified)}>
              {getStatusIcon(orgData.verified)}
              {orgData.verified ? "Verified" : "Pending Verification"}
            </Badge>
            <Badge variant="outline">
              Trust Score: {orgData.trustScore}/100
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/organization/members")} className="gap-2">
          <IconUsers className="h-4 w-4" />
          Manage Members
        </Button>
        <Button onClick={() => router.push("/organization/edit")} className="gap-2">
          <IconPencil className="h-4 w-4" />
          Edit
        </Button>
      </div>
    </div>
  );
}
