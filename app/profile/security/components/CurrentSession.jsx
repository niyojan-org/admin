"use client";

import { Badge } from "@/components/ui/badge";
import { IconWorld, IconClock } from "@tabler/icons-react";

export function CurrentSession({ session }) {
  const Icon = session.icon;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <IconWorld className="w-5 h-5" stroke={1.5} />
          Active Session
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Your current active session</p>
      </div>
      <div className="flex items-center justify-between p-3 border border-foreground/20 bg-accent/50 rounded-md">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" stroke={1.5} />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{session.device}</p>
              <Badge variant="default" className="text-xs h-5 px-2">
                Current
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>{session.location}</span>
              <span>•</span>
              <span>{session.ip}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <IconClock className="w-3 h-3" stroke={1.5} />
                {session.lastActive}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
