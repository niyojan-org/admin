"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { IconBuilding, IconAlertCircle, IconPlus } from "@tabler/icons-react";

const NoOrganizationFound = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <IconBuilding className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle>No Organization Found</CardTitle>
              <CardDescription>
                You need to create an organization to access this dashboard
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>
              To start managing events and participants, you first need to set up your organization profile.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/organization/create")} className="w-full" size="lg">
            <IconPlus className="mr-2 h-4 w-4" />
            Create Organization
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoOrganizationFound;
