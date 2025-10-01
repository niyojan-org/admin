'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { IconFileText, IconEdit, IconCircleCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { calculateProfileCompletion } from '../utils/organizationUtils';

export default function ProfileCompletion({ orgData }) {
  const router = useRouter();

  if (!orgData) return null;

  const completion = calculateProfileCompletion(orgData);
  const isComplete = completion === 100;

  if (isComplete) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <IconCircleCheck className="h-5 w-5" />
            Profile Complete
          </CardTitle>
          <CardDescription className="text-green-600">
            Your organization profile is fully set up and ready for events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <IconCircleCheck className="h-4 w-4" />
              <span>All sections completed successfully</span>
            </div>
            <Button onClick={() => router.push("/organization/edit")} variant="outline" size="sm">
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconFileText className="h-5 w-5" />
          Profile Completion
        </CardTitle>
        <CardDescription>
          Complete your profile to unlock all features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-gray-600">{Math.round(completion)}%</span>
          </div>
          <Progress value={completion} className="h-2" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
            {orgData?.stepsCompleted && Object.entries(orgData.stepsCompleted).map(([step, completed]) => (
              <Badge
                key={step}
                variant={completed ? "default" : "outline"}
                className="justify-center capitalize text-xs"
              >
                {step.replace(/([A-Z])/g, ' $1').trim()}
              </Badge>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => router.push("/organization/edit")} variant="outline" size="sm">
              <IconEdit className="h-4 w-4 mr-2" />
              Complete Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
