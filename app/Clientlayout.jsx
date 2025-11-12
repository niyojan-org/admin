"use client";
import { useUserStore } from "@/store/userStore";
import { usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOrgStore } from "@/store/orgStore";
import { IconLoader } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
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
  const banner = useBanner();

  const { isAuthenticated, setToken, organization, loading: userLoading } = useUserStore();
  const { isInfoComplete, isVerified, loading: orgLoading } = useOrgStore();


  if (!isInfoComplete) {
    // BannerProvider expects a link object with href and label
    banner.warning(
      "Please complete your organization profile to access all features.",
      { href: '/organization/create', label: 'Complete Profile' }
    );
  }

  if (organization && !isVerified && isInfoComplete) {
    banner.info("Your organization is not verified. Please complete the verification process to access all features.", {
      href: "/organization/verify",
      label: "Verify Now"
    });
  }

  // Countdown + redirect logic
  useEffect(() => { setToken() }, []);

  // Routes that should show the sidebar
  const protectedRoutes = ['/dashboard', '/event', '/messages', '/notifications', '/organization', '/organization/edit', '/contact'];
  const showSidebar = protectedRoutes.some(route => pathname.startsWith(route)) && isAuthenticated;

  // Routes that should NOT use ScrollArea (they handle their own scrolling)
  const noScrollAreaRoutes = ['/participants', '/organization/members'];
  const useScrollArea = !noScrollAreaRoutes.some(route => pathname.includes(route));

  if (!isAuthenticated && userLoading || orgLoading) {
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
    )
  }

  if (showSidebar) {
    return (
      <div className="flex w-full">
        <AppSidebar />
        {useScrollArea ? (
          <ScrollArea className="h-dvh w-full">
            <div className="flex-1 min-h-dvh sm:pt-0 w-full font-source-sans-3 px-2 md:px-4 lg:px-6">
              {children}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 h-dvh sm:pt-0 w-full font-source-sans-3 overflow-auto">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="">
      {useScrollArea ? (
        <ScrollArea className="h-dvh">
          <div className="h-dvh sm:pt-0 w-full font-source-sans-3">
            {children}
          </div>
        </ScrollArea>
      ) : (
        <div className="h-dvh sm:pt-0 w-full font-source-sans-3 overflow-auto">
          {children}
        </div>
      )}
    </div>
  );
}
