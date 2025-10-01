"use client";
import Hero from "@/components/cards/Hero";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { useOrgStore } from "@/store/orgStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";


export default function Home() {
  const { isInfoComplete, isVerified } = useOrgStore();
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

      {!isVerified && (
        <StickyBanner className="bg-red text-navy">
          <p className="mx-0 max-w-[90%] text-navy text-xl font-semibold drop-shadow-md ">
            <span className="font-bold">Important Announcement:</span> Your organization is not
            verified. Please contact support for verification or resubmit your application.
            <Link
              href={"/register/verify"}
              className="transition duration-200 hover:underline text-white"
            >
              {" "}
              Resubmit
            </Link>
          </p>
        </StickyBanner>
      )}
      {!isInfoComplete && (
        <StickyBanner className="bg-red text-navy">
          <p className="mx-0 max-w-[90%] text-navy text-xl font-semibold drop-shadow-md ">
            <span className="font-bold">Important Announcement:</span> Please complete your profile
            information to access all features.
            <Link href={"/register"} className="transition duration-200 hover:underline text-white">
              {" "}
              Complete Profile
            </Link>
          </p>
        </StickyBanner>
      )}
    </div>
  );
}
