"use client";

import {
  IconLock,
  IconDeviceMobile,
  IconKey,
  IconCircleCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function SecurityOverview({ securityData }) {
  const has2FA = securityData.twoFactorEnabled;
  const hasPasskeys = securityData.passkeysCount > 0;

  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Password Status */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconLock className="w-4 h-4" stroke={1.5} />
          <span className="text-xs font-medium uppercase tracking-wide">Password</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-foreground">
            Protected
          </p>
          <IconCircleCheck className="w-4 h-4 text-muted-foreground" stroke={1.5} />
        </div>
        <p className="text-xs text-muted-foreground">
          {securityData.lastPasswordChange || "No recent change"}
        </p>
      </div>

      {/* 2FA Status */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconDeviceMobile className="w-4 h-4" stroke={1.5} />
          <span className="text-xs font-medium uppercase tracking-wide">2FA</span>
        </div>
        <div className="flex items-center gap-2">
          <p className={cn(
            "text-lg font-semibold",
            has2FA ? "text-primary" : "text-destructive"
          )}>
            {has2FA ? "Enabled" : "Disabled"}
          </p>
          {has2FA ? (
            <IconCircleCheck className="w-4 h-4 text-primary" stroke={1.5} />
          ) : (
            <IconAlertCircle className="w-4 h-4 text-destructive" stroke={1.5} />
          )}
        </div>
        <p className={cn(
          "text-xs",
          has2FA ? "text-muted-foreground" : "text-destructive"
        )}>
          {has2FA ? "Active" : "Not protected"}
        </p>
      </div>

      {/* Passkeys Status */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconKey className="w-4 h-4" stroke={1.5} />
          <span className="text-xs font-medium uppercase tracking-wide">Passkeys</span>
        </div>
        <div className="flex items-center gap-2">
          <p className={cn(
            "text-lg font-semibold",
            hasPasskeys ? "text-primary" : "text-muted-foreground"
          )}>
            {securityData.passkeysCount}
          </p>
          {hasPasskeys && (
            <IconCircleCheck className="w-4 h-4 text-primary" stroke={1.5} />
          )}
        </div>
        <p className={cn(
          "text-xs",
          hasPasskeys ? "text-muted-foreground" : "text-muted-foreground"
        )}>
          {hasPasskeys ? "Registered" : "No passkeys"}
        </p>
      </div>
    </div>
  );
}
