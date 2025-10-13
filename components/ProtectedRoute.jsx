"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { IconDashboard, IconHome, IconLoader, IconShieldLock, IconLogin } from "@tabler/icons-react";
import { Button } from "./ui/button";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user } = useUserStore();
  const router = useRouter();

  useEffect(() => {

    if (loading === false && isAuthenticated === false) {
      router.replace("/auth");
      console.warn("User is not authenticated, redirecting to auth page.");
    }
  }, [loading, isAuthenticated, router]);

  // If not authenticated, show login prompt
  if (loading === false && isAuthenticated === false) {
    return (
      <div className="flex flex-col items-center justify-center h-[90vh] px-4 py-8 bg-background animate-in fade-in">
        <div className="flex flex-col items-center gap-4 max-w-md w-full">
          <div className="rounded-full bg-primary/10 p-4">
            {/* Tabler Login Icon */}
            <IconLogin className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Authentication Required</h2>
          <p className="text-muted-foreground text-center text-base">
            Please log in to access this page.<br />
            You need to be authenticated to continue.
          </p>
          <Button
            className="mt-6 px-5 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-colors duration-200"
            onClick={() => window.location.href = '/'}
          >
            <span className="inline-flex items-center gap-2">
              {/* Tabler Home Icon */}
              <IconHome className="h-4 w-4" />
              Go to Home
            </span>
          </Button>
        </div>
      </div>
    );
  }

  // Optionally show nothing or a loader while checking
  if (loading || isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-8 bg-background">
        <div className="flex flex-col items-center gap-4 max-w-md w-full">
          <div className="rounded-full bg-primary/10 p-4">
            {/* Tabler Loader Icon */}
            <IconLoader className="w-12 h-12 text-primary animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Loading...</h2>
          <p className="text-muted-foreground text-center text-sm">
            Please wait while we verify your access permissions.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  // Role-based access check
  if (roles && roles.length > 0) {
    const userRole = user?.organization.role;
    if (!roles.includes(userRole)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-8 bg-background animate-in fade-in">
          <div className="flex flex-col items-center gap-4 max-w-md w-full">
            <div className="rounded-full bg-destructive/10 p-4">
              {/* Tabler Shield X Icon */}
              <IconShieldLock className="h-20 w-20 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
            <p className="text-muted-foreground text-center text-base">
              You do not have permission to access this page.<br />
              Please contact your organization admin if you believe this is a mistake.
            </p>
            <Button
              className="mt-6 px-5 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-colors duration-200"
              onClick={() => window.location.href = '/dashboard'}
            >
              {/* Tabler Dashboard Icon */}
              <IconDashboard className="h-4 w-4" />
              Go to Dashboard

            </Button>
          </div>
        </div>
      );
    }
  }

  return children;
}
