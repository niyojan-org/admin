// app/(auth)/layout.js
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export default function AuthLayout({ children }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToken = useUserStore((state) => state.setToken);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      // Call setToken with the token from URL
      setToken({ token }).then((success) => {
        if (success) {
          // Redirect to dashboard after successful token validation
          router.push("/dashboard");
        } else {
          // Remove token from URL if validation failed
          router.replace("/auth");
        }
      });
    }
  }, [searchParams, setToken, router]);

  return <div>{children}</div>;
}