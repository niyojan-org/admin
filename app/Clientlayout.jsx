"use client";
import { useUserStore } from "@/store/userStore";
import { useSearchParams, usePathname, redirect } from "next/navigation";
import { useEffect, Suspense } from "react";
import AppSidebar from "@/components/layout/AppSidebar";

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
    searchParams.get("token") ||
    (typeof window !== "undefined" ? sessionStorage.getItem("token") : null);

  const { isAuthenticated, setToken } = useUserStore();

  useEffect(() => {

    setToken({ token });

  }, [token, setToken]);

  // Routes that should show the sidebar
  const protectedRoutes = ['/dashboard', '/event', '/messages', '/notifications', '/organization', '/organization/edit', '/contact'];
  const showSidebar = protectedRoutes.some(route => pathname.startsWith(route)) && isAuthenticated;

  if (showSidebar) {
    return (
      <div className="font-source-sans-3 flex flex-col md:flex-row overflow-hidden">
        <AppSidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="font-source-sans-3">
      {children}
    </div>
  );
}
