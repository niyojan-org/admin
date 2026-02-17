import { useOrgStore } from '@/store/orgStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconBuilding, IconCheck, IconArrowLeft, IconSettings, IconUsers } from "@tabler/icons-react";
import { useRouter } from 'next/navigation';

function ExistingOrg() {
  const { organization } = useOrgStore();
  const router = useRouter();
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <IconBuilding className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Organization Already Exists</h1>
          <p className="text-muted-foreground">
            You already have an active organization. Only one organization per user is allowed.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <IconCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{organization.name}</CardTitle>
                <CardDescription className="text-sm">
                  Your current organization
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Organization ID</p>
                <p className="font-medium text-foreground">{organization._id || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium text-foreground">{organization.type || 'Standard'}</p>
              </div>
            </div>

            <Alert>
              <IconUsers className="h-4 w-4" />
              <AlertDescription>
                Each user can only create and manage one organization at a time.
                This ensures focused management and prevents resource conflicts.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => router.push('/organization')}
                className="w-full"
              >
                <IconSettings className="w-4 h-4 mr-2" />
                Manage Organization
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need to switch organizations? Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExistingOrg