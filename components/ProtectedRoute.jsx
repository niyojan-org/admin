"use client";
import { useEffect, useState, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconDashboard, IconHome, IconLoader, IconShieldLock, IconLogin, IconLogin2 } from "@tabler/icons-react";
import { Button } from "./ui/button";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user, organization } = useUserStore();
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(5)
  const secondsRef = useRef(null)

  useEffect(() => {
    let timeoutId
    let intervalId

    if (loading === false && isAuthenticated === false) {
      // Start a countdown and redirect after 5 seconds. Show a Sonner toast.
      console.warn("User is not authenticated, redirecting to auth page in 5s.");
      // initialize countdown only if not already started
      if (secondsRef.current === null) {
        secondsRef.current = 5
        setSecondsLeft(5)
      }

      // toast.info('You will be redirected to login shortly', { duration: 4000 })

      intervalId = setInterval(() => {
        // decrement ref and state
        secondsRef.current = Math.max(0, (secondsRef.current || 0) - 1)
        setSecondsLeft(secondsRef.current)
        if (secondsRef.current === 0) {
          clearInterval(intervalId)
          router.replace('/auth')
        }
      }, 1000)

      // safety timeout in case interval misses
      timeoutId = setTimeout(() => {
        clearInterval(intervalId)
        router.replace('/auth')
      }, 5000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (timeoutId) clearTimeout(timeoutId)
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
          <p className="text-sm text-muted-foreground text-center mt-2">
            Redirecting to the login page in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}...
          </p>
          <Button
            className="mt-6 px-5 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-colors duration-200"
            onClick={() => {
              // immediate redirect via router.replace and show toast
              // toast.info('Redirecting to login...')
              router.replace('/auth')
            }}
          >
            <span className="inline-flex items-center gap-2">
              {/* Tabler Home Icon */}
              <IconHome className="h-4 w-4" />
              Go to Login
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

  if (!organization && isAuthenticated) {
    // Authenticated but no organization: ask user to create org and redirect
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-8 bg-background">
        <div className="flex flex-col items-center gap-4 max-w-md w-full">
          <div className="rounded-full bg-primary/10 p-4">
            <IconLogin2 className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary">No organization found</h2>
          <p className="text-muted-foreground text-center text-base">
            You don't have an organization yet. You need to create one.
          </p>
          {/* <p className="text-sm text-muted-foreground text-center mt-2">
            Redirecting to organization registration in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}...
          </p> */}
          <Button
            className="mt-6 px-5 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-colors duration-200"
            onClick={() => {
              // toast('Redirecting to organization registration...')
              router.replace('/organization/create')
            }}
          >
            <span className="inline-flex items-center gap-2">
              <IconHome className="h-4 w-4" />
              Create Organization
            </span>
          </Button>
        </div>
      </div>
    )
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
