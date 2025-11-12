"use client";
import Hero from "@/components/cards/Hero";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const { isAuthenticated } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Hero />
    </div>
  );
}
