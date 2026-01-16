"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalInformation } from "@/components/profile/PersonalInformation";
import { TicketHistory } from "@/components/profile/TicketHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconShield, IconArrowRight } from "@tabler/icons-react";

export default function Profile() {
  const { user, logout, updateUser } = useUserStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const handleUpdateUser = async (updatedData) => {
    await updateUser(updatedData);
  };

  if (!user) {
    return <div className="h-dvh flex items-center justify-center">
      <p>Hey there! Please log in to access your profile.</p>
    </div>;
  }

  return (
    <div className="flex flex-col overflow-hidden space-y-4 pb-4 h-full w-full">
      {/* Profile Header */}
      <ProfileHeader user={user} onLogout={handleLogout} className="pb-4" />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4 flex-1 overflow-hidden">
        {/* Left Column - Personal Info & Security */}
        <div className="lg:col-span-2 flex flex-col gap-2 md:gap-4 overflow-y-auto h-full">
          <PersonalInformation user={user} onUpdate={handleUpdateUser} className="flex-1" />

          {/* Security Settings Card */}
          <Card className="shrink-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconShield className="w-5 h-5" />
                  <CardTitle>Account Security</CardTitle>
                </div>
              </div>
              <CardDescription>
                Manage your password, two-factor authentication, passkeys, and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile/security">
                <Button className="gap-2">
                  Manage Security
                  <IconArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Ticket History & Settings */}
        <div className="lg:col-span-1 flex flex-col overflow-hidden min-h-0">
          <TicketHistory className="flex-1 min-h-0" />
        </div>

      </div>
    </div>
  );
}


