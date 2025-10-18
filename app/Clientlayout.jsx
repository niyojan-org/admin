"use client";
import { useUserStore } from "@/store/userStore";
import { useSearchParams, usePathname, redirect } from "next/navigation";
import { useEffect, Suspense } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ClientLayout({ children }) {

  return (
    <Suspense>
      <ClientLayoutInner>{children}</ClientLayoutInner>
    </Suspense>
  );
}

function ClientLayoutInner({ children }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const token =
    searchParams.get("auth") ||
    (typeof window !== "undefined" ? sessionStorage.getItem("token") : null);

  const { isAuthenticated, setToken } = useUserStore();

  useEffect(() => {
    console.log(token)
    if (!token) {
      return;
    }
    setToken({ token });
  }, [token, setToken]);

  // Routes that should show the sidebar
  const protectedRoutes = ['/dashboard', '/event', '/messages', '/notifications', '/organization', '/organization/edit', '/contact'];
  const showSidebar = protectedRoutes.some(route => pathname.startsWith(route)) && isAuthenticated;

  if (showSidebar) {
    return (
      <div className="flex w-full">
        <AppSidebar />
        <ScrollArea className="h-dvh w-full">
          <div className="flex-1 min-h-dvh sm:pt-0 w-full font-source-sans-3 px-4">
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
