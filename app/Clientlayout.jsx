"use client";
import { useUserStore } from "@/store/userStore";
import { usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import { useOrgStore } from "@/store/orgStore";
import { IconLoader } from "@tabler/icons-react";
import { BannerProvider, useBanner } from "@/components/banner/banner";

export default function ClientLayout({ children }) {
  return (
    <Suspense>
      <BannerProvider>
        <ClientLayoutInner>{children}</ClientLayoutInner>
      </BannerProvider>
    </Suspense>
  );
}

function ClientLayoutInner({ children }) {
  const pathname = usePathname();

  const { isAuthenticated, fetchUser, loading: userLoading } = useUserStore();
  const { loading: orgLoading, fetchOrganization } = useOrgStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const success = await fetchUser();
      if (success) {
        await fetchOrganization();
      }
    };
    initializeAuth();
  }, [fetchUser, fetchOrganization, isAuthenticated]);

  const protectedRoutes = [
    "/dashboard",
    "/events",
    "/messages",
    "/notifications",
    "/organization",
    "/organization/edit",
    "/contact",
    "/editor",
    "/profile",
  ];
  const showSidebar =
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    isAuthenticated;

  if ((!isAuthenticated && userLoading) || orgLoading) {
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

  if (showSidebar) {
    return (
      <div className="flex w-full h-dvh font-source-sans-3 mt-16 mb-4 sm:mt-0 sm:mb-0">
        <AppSidebar />
        <div className="flex-1 px-2 sm:px-6 h-full items-center justify-center w-full">
          {children}
        </div>
      </div>
    );
  }

  return <div className="px-3 h-dvh">{children}</div>;
}
