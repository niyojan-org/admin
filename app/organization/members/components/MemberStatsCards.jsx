"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Shield,
  UserCog,
  User,
  Heart
} from 'lucide-react';

const MemberStatsCards = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 rounded mb-2"></div>
                <div className="h-8 rounded mb-2"></div>
                <div className="h-3 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const {
    totalMembers,
    filteredCount,
    roleDistribution,
    membershipStats,
    genderDistribution
  } = summary;

  const stats = [
    {
      title: 'Total Members',
      value: totalMembers,
      icon: Users,
      color: 'blue',
      description: filteredCount !== totalMembers ? `${filteredCount} filtered` : 'All members',
      change: null
    },
    {
      title: 'Active Members',
      value: membershipStats?.active || 0,
      icon: UserCheck,
      color: 'green',
      description: `${Math.round(((membershipStats?.active || 0) / totalMembers) * 100)}% of total`,
      change: null
    },
    {
      title: 'Pending Invitations',
      value: membershipStats?.pending || 0,
      icon: Clock,
      color: 'yellow',
      description: 'Awaiting response',
      change: null
    },
    {
      title: 'Inactive Members',
      value: membershipStats?.inactive || 0,
      icon: UserX,
      color: 'red',
      description: 'Not currently active',
      change: null
    }
  ];

  const roleStats = [
    { role: 'admin', count: roleDistribution?.admin || 0, icon: UserCog, color: 'blue' },
    { role: 'manager', count: roleDistribution?.manager || 0, icon: User, color: 'green' },
    { role: 'member', count: roleDistribution?.member || 0, icon: User, color: 'gray' },
    { role: 'volunteer', count: roleDistribution?.volunteer || 0, icon: Heart, color: 'purple' }
  ];

  return (
    <div className="space-y-2 w-full">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={'p-2 px-3'}>
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                    <p className="text-xs mt-1">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-full`}>
                    <Icon className={`w-6 h-6 `} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Role Distribution */}
      <Card className={'hidden'}>
        <CardHeader>
          <CardTitle className="text-lg">Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {roleStats.map((role) => {
              const Icon = role.icon;
              const percentage = totalMembers > 0 ? (role.count / totalMembers) * 100 : 0;

              return (
                <Card key={role.role} className="flex py-2">
                  <CardContent className={'flex items-center justify-between'}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded`}>
                        <Icon className={`w-4 h-4`} />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{role.role}</p>
                        <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <Badge variant="outline">{role.count}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default MemberStatsCards;
