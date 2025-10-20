// app/(auth)/layout.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { IconArrowRight, IconCircleCheckFilled, IconLogout2 } from "@tabler/icons-react";

export default function AuthLayout({ children }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToken = useUserStore((state) => state.setToken);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const logOut = useUserStore((state) => state.logOut);
  const loading = useUserStore((state) => state.loading);

  useEffect(() => {
    const auth = searchParams.get("auth");

    if (auth) {
      // Call setToken with the token from URL
      setToken({ token: auth }).then((success) => {
        if (success) {
          // Redirect to dashboard after successful token validation
          router.replace("/dashboard");
        } else {
          // Remove token from URL if validation failed
          router.replace("/auth");
        }
      });
    }
  }, [searchParams, setToken, router]);

  if (isAuthenticated && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-background via-background to-muted/20">
        <div className="relative flex flex-col items-center gap-6 max-w-md w-full p-8">
          {/* Decorative background element */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl blur-3xl" />

          {/* Icon with subtle animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-primary/10 p-4 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <IconCircleCheckFilled className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight">You're all set</h2>
            <p className="text-muted-foreground">
              Already authenticated. Switch accounts by logging out first.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full mt-2">
            <Button
              size="lg"
              className="w-full group relative overflow-hidden"
              onClick={() => router.replace('/dashboard')}
            >
              <span className="relative z-10 flex items-center gap-2">
                Continue to Dashboard
                <IconArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full group"
              onClick={() => logOut()}
            >
              <IconLogout2 className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <div>{children}</div>;
}