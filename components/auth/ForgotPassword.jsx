"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IconLoader2, IconMail, IconArrowLeft, IconCheck } from "@tabler/icons-react";
import api from "@/lib/api";

export default function ForgotPassword({ userEmail, setUserEmail, onViewChange }) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!userEmail) {
      setError("Email is required");
      return toast.error("Email is required");
    }

    if (!/\S+@\S+\.\S+/.test(userEmail)) {
      setError("Please enter a valid email address");
      return toast.error("Please enter a valid email address");
    }

    try {
      setLoading(true);

      // Replace with your actual API endpoint
      await api.post("/api/auth/forgot-password", {
        email: userEmail,
        admin: true,
      });

      setEmailSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to send reset link. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setEmailSent(false);
    setError("");
  };

  // Success state
  if (emailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center">
          <IconCheck className="w-8 h-8 text-secondary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-muted-foreground">Check your email</h3>
          <p className="text-muted-foreground text-sm">We've sent a password reset link to</p>
          <p className="text-navy font-medium break-all">{userEmail}</p>
        </div>

        <div className="space-y-3">
          <Button onClick={handleRetry} className="w-full">
            <IconMail className="mr-2 h-4 w-4" />
            Send another email
          </Button>

          <Button variant="outline" onClick={() => onViewChange("login")} className="w-full ">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Didn't receive the email? Check your spam folder.</p>
          <p>The link will expire in 15 minutes.</p>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center">
            <IconMail className="w-8 h-8" />
          </div>
          <p className="text-muted-foreground text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
              setError(""); // Clear error when user types
            }}
            autoComplete="email"
            placeholder="Enter your email address"
            className="h-10"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/50 p-3 border border-destructive">
          <p className="text-sm font-medium text-destructive text-center">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          type="submit"
          disabled={loading || !userEmail}
          className="w-full h-10"
        >
          {loading ? (
            <>
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            <>
              <IconMail className="mr-2 h-4 w-4" />
              Send reset link
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => onViewChange("login")}
          className="w-full"
          disabled={loading}
        >
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => onViewChange("login")}
            className="text-navy hover:text-navy/80 underline"
            disabled={loading}
          >
            Sign in instead
          </button>
        </p>
      </div>
    </form>
  );
}
