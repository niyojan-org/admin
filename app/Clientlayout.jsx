"use client";
import { useUserStore } from "@/store/userStore";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, Suspense, useState, useRef } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOrgStore } from "@/store/orgStore";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { IconHome, IconLoader2, IconLogin2 } from "@tabler/icons-react";
import { IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";
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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const banner = useBanner();
  const token =
    searchParams.get("auth") ||
    (typeof window !== "undefined" ? sessionStorage.getItem("token") : null);

  const { isAuthenticated, setToken, organization, loading: userLoading } = useUserStore();
  const { isInfoComplete, isVerified, loading: orgLoading } = useOrgStore();
  const router = useRouter();

  const [secondsLeft, setSecondsLeft] = useState(5)
  const secondsRef = useRef(null);

  // Show organization incomplete warning after render (avoid setState during render)
  useEffect(() => {
    if (!isInfoComplete) {
      // BannerProvider expects a link object with href and label
      banner.warning(
        "Please complete your organization profile to access all features.",
        { href: '/organization/create', label: 'Complete Profile' }
      );
    }
    // Intentionally only depend on isInfoComplete so this runs once when that value changes
  }, [isInfoComplete]);

  // Countdown + redirect logic
  useEffect(() => {
    let intervalId
    let timeoutId

    // Unauthenticated -> redirect to /auth
    // if (!organization && isAuthenticated === false) {
    //   if (secondsRef.current === null) { secondsRef.current = 5; setSecondsLeft(5) }
    //   // toast('You will be redirected to login shortly', { duration: 3000 })
    //   intervalId = setInterval(() => {
    //     secondsRef.current = Math.max(0, (secondsRef.current || 0) - 1)
    //     setSecondsLeft(secondsRef.current)
    //     if (secondsRef.current === 0) {
    //       clearInterval(intervalId)
    //       router.replace('/auth')
    //     }
    //   }, 1000)
    //   timeoutId = setTimeout(() => { clearInterval(intervalId); router.replace('/auth') }, 5000)
    // }

    // Authenticated but no organization -> redirect to organization registration
    // if (isAuthenticated && !organization) {
    //   if (secondsRef.current === null) { secondsRef.current = 5; setSecondsLeft(5) }
    //   intervalId = setInterval(() => {
    //     secondsRef.current = Math.max(0, (secondsRef.current || 0) - 1)
    //     setSecondsLeft(secondsRef.current)
    //     if (secondsRef.current === 0) {
    //       clearInterval(intervalId)
    //       router.replace('/org/register')
    //     }
    //   }, 1000)
    //   timeoutId = setTimeout(() => { clearInterval(intervalId); router.replace('/org/register') }, 5000)
    // }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (timeoutId) clearTimeout(timeoutId)
      // reset ref so future transitions restart countdown
      secondsRef.current = null
    }
  }, [isAuthenticated, organization, router])


  useEffect(() => {
    setToken({ token });
  }, [token, setToken]);

  // Routes that should show the sidebar
  const protectedRoutes = ['/dashboard', '/event', '/messages', '/notifications', '/organization', '/organization/edit', '/contact'];
  const showSidebar = protectedRoutes.some(route => pathname.startsWith(route)) && isAuthenticated;


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
        <ScrollArea className="h-dvh w-full">
          <div className="flex-1 min-h-dvh sm:pt-0 w-full font-source-sans-3 px-2 md:px-4 lg:px-6">
            {children}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="">
      <ScrollArea className="h-dvh">
        <div className="h-dvh sm:pt-0 w-full font-source-sans-3">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
