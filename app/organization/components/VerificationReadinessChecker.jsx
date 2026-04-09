"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function VerificationReadinessChecker({ organization }) {
  const [checking, setChecking] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [readiness, setReadiness] = useState(null);

  const handleCheckReadiness = async () => {
    try {
      setChecking(true);
      const response = await api.get("/organizations/admin/verification/check");
      if (response.data.success) {
        setReadiness(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to check verification readiness");
    } finally {
      setChecking(false);
    }
  };

  const handleRaiseVerification = async () => {
    try {
      setRequesting(true);
      const response = await api.post("/organizations/admin/verification/raise");
      if (response.data.success) {
        toast.success("Verification request submitted successfully!");
        // Refresh readiness check
        handleCheckReadiness();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit verification request",
        {
          description: error.response?.data?.error?.details,
        }
      );
    } finally {
      setRequesting(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === "complete") return <CheckCircle2 className="size-5 text-green-600" />;
    if (status === "incomplete") return <XCircle className="size-5 text-red-600" />;
    return <AlertCircle className="size-5 text-yellow-600" />;
  };

  const getStatusBadge = (status) => {
    if (status === "complete") return <Badge variant="success">Complete</Badge>;
    if (status === "incomplete") return <Badge variant="destructive">Incomplete</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5" />
              Verification Readiness
            </CardTitle>
            <CardDescription>
              Check if your organization is ready for verification
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCheckReadiness}
            disabled={checking}
          >
            {checking ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="size-4 mr-2" />
                Check Readiness
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readiness ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Click "Check Readiness" to verify your organization details are complete.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Overall Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold">Overall Readiness</h3>
                <p className="text-sm text-muted-foreground">
                  {readiness.isReady 
                    ? "Your organization is ready for verification"
                    : "Please complete the missing requirements"}
                </p>
              </div>
              <div className="text-right">
                {readiness.isReady ? (
                  <CheckCircle2 className="size-8 text-green-600" />
                ) : (
                  <XCircle className="size-8 text-red-600" />
                )}
              </div>
            </div>

            <Separator />

            {/* Checklist */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Requirements Checklist</h4>
              
              {readiness.checks?.map((check, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(check.status)}
                    <div>
                      <p className="font-medium text-sm">{check.name}</p>
                      {check.message && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {check.message}
                        </p>
                      )}
                      {check.missingFields && check.missingFields.length > 0 && (
                        <p className="text-xs text-destructive mt-1">
                          Missing: {check.missingFields.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(check.status)}
                </div>
              ))}
            </div>

            {/* Action Button */}
            {readiness.isReady && !organization.verified && !organization.reqForVerification && (
              <>
                <Separator />
                <Alert>
                  <ShieldCheck className="h-4 w-4" />
                  <AlertDescription>
                    All requirements are met! You can now submit your organization for verification.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={handleRaiseVerification}
                  disabled={requesting}
                  className="w-full sm:w-auto"
                >
                  {requesting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4 mr-2" />
                      Submit for Verification
                    </>
                  )}
                </Button>
              </>
            )}

            {organization.reqForVerification && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your verification request is pending. You will be notified once it's reviewed.
                </AlertDescription>
              </Alert>
            )}

            {organization.verified && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Your organization is verified!
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
