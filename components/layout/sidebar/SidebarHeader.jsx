"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

const SidebarHeader = ({ isCollapsed, onToggleCollapse, organization, isMobile }) => {
  return (
    <div className="relative">
      <div className={cn(
        "flex items-center px-4 py-6",
        isCollapsed && !isMobile ? "justify-center px-2" : "justify-start"
      )}>
        {isCollapsed && !isMobile ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/dashboard" className="flex items-center">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center p-1">
                  <Image
                    src="https://res.cloudinary.com/ddk9qhmit/image/upload/v1755007468/icon_cusbi5.png"
                    alt="Orgatick"
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Orgatick X {organization?.name || "Organization"}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center p-1">
              <Image
                src="https://res.cloudinary.com/ddk9qhmit/image/upload/v1755007468/icon_cusbi5.png"
                alt="Orgatick"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
            </div>
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <h2 className="text-xl font-bold text-foreground">
                    Orgatick X {organization?.name || "Organization"}
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        )}
      </div>
      
      {/* Absolute positioned expand arrow at the right edge */}
      {!isMobile && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleCollapse}
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-card border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground shadow-sm z-10"
            >
              {isCollapsed ? (
                <IconChevronRight className="h-3 w-3" />
              ) : (
                <IconChevronLeft className="h-3 w-3" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default SidebarHeader;
