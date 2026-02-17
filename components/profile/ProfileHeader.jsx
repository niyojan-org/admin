"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconCircleCheck,
  IconCircleX,
  IconMail,
  IconCamera,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AccountSettings } from "./AccountSettings";
import { AvatarEditor } from "./AvatarEditor";

export function ProfileHeader({ user, className, onLogout }) {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={cn("w-full overflow-hidden p-0 py-2", className)}>
      <CardContent className="">
        <div className="flex flex-row gap-6 items-center sm:items-start">
          {/* Avatar Section with Enhanced Design */}
          <div className="relative group">
            <AvatarEditor
              user={user}
              triggerButton={
                <div className="relative cursor-pointer">
                  {/* Decorative ring */}
                  <div className="absolute -inset-1 bg-linear-to-r from-primary/50 to-primary/20 rounded-[28px] blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>

                  {/* Avatar Container */}
                  <div className="relative">
                    <Avatar className="h-24 w-24 rounded-3xl border-4 border-background shadow-xl">
                      <AvatarImage
                        src={user?.avatar}
                        alt={user?.name}
                        className="rounded-3xl object-cover"
                      />
                      <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground text-2xl font-bold rounded-3xl">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Enhanced Camera Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 backdrop-blur-sm rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <IconCamera className="h-6 w-6 text-white" stroke={2} />
                      <span className="text-[10px] text-white font-medium">Change</span>
                    </div>

                    {/* Enhanced Verification Badge */}
                    <div className="absolute -bottom-1 -right-1 z-10 pointer-events-none">
                      {user?.isVerified ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success shadow-lg ring-4 ring-background">
                          <IconCircleCheck className="h-4 w-4 text-background " stroke={2.5} />
                        </div>
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive shadow-lg ring-4 ring-background">
                          <IconCircleX className="h-4 w-4 text-white" stroke={2.5} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              }
            />
          </div>

          {/* Enhanced User Info Section */}
          <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
            {/* Name and Email */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {user?.name || "User Name"}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                <IconMail className="h-4 w-4 flex-shrink-0" stroke={1.5} />
                <span className="text-sm truncate">{user?.email || "email@example.com"}</span>
              </div>
            </div>

            {/* Enhanced Verification Badge */}
            <div className="flex items-center justify-center sm:justify-start gap-3 h-full">
              <Badge
                variant={user?.isVerified ? "default" : "destructive"}
                className={cn(
                  "gap-1.5 text-xs font-medium px-3 py-1 shadow-sm h-full",
                  user?.isVerified && "bg-success hover:bg-success"
                )}
              >
                {user?.isVerified ? (
                  <>
                    <IconCircleCheck className="h-3.5 w-3.5" stroke={2.5} />
                    Verified Account
                  </>
                ) : (
                  <>
                    <IconCircleX className="h-3.5 w-3.5" stroke={2.5} />
                    Unverified
                  </>
                )}
              </Badge>
              <div className="flex items-start">
                <AccountSettings user={user} onLogout={onLogout} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}