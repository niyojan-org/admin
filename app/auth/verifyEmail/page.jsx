"use client";

import { Suspense, useState, useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Mail, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { SpinnerCustom } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setLoading(false);
      return;
    }

    const verify = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post("/api/auth/verify-email", { token, email });
        setVerified(true);
        toast.success(res.data.message || "Email verified successfully!");
      } catch (err) {
        setError(
          err.response.data.error.details ||
            "Verification failed. The link may have expired or is invalid. Please log in and request a new verification email."
        );
        toast.error("Email verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Card className="w-full max-w-md mx-4 border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <SpinnerCustom className="w-12 h-12" />
            <CardDescription className="text-base">Verifying your email...</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-full max-w-2xl border-2 shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="flex justify-center mb-2">
            {verified ? (
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse" />
                <CheckCircle className="relative w-20 h-20 text-green-500" />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-50 animate-pulse" />
                <XCircle className="relative w-20 h-20 text-red-500" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl font-bold">
            {verified ? "Email Verified!" : "Verification Failed"}
          </CardTitle>
          {verified && (
            <Badge
              variant="success"
              className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-1"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Account Activated
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {verified ? (
            <Alert className="border-green-200 bg-green-50">
              <Mail className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800 font-semibold">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                🎉 Your email has been successfully verified. You can now access all features of
                your account.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Verification Failed</AlertTitle>
              <AlertDescription className="text-sm leading-relaxed">{error}</AlertDescription>
            </Alert>
          )}

          {verified && (
            <div className="bg-secondary/30 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                What's Next?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>Explore events and organizations</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>Complete your profile to get started</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>Start creating or joining amazing events</span>
                </li>
              </ul>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-6 border-t">
          {verified ? (
            <>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/">
                  Go to Homepage
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/profile">View Profile</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
                <Link href="/auth">
                  Go to Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/">Back to Home</Link>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
