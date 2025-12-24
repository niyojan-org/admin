"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { IconChevronDown } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NavigationItem = ({
  item,
  isActive,
  isCollapsed,
  isExpanded,
  onToggleExpanded,
  onItemClick
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const pathname = usePathname();

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  if (hasChildren) {
    return (
      <div className="space-y-1">
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={item.href} onClick={handleItemClick}>
                <div
                  className={cn(
                    "w-full flex justify-center h-10 px-3 items-center cursor-pointer transition-all duration-200",
                    isActive
                      ? "text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            className={cn(
              "w-full flex justify-start h-10 px-3 items-center cursor-pointer transition-all duration-200 relative group",
              isActive
                ? "text-foreground font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={onToggleExpanded}
          >
            <div className="flex items-center flex-1 min-w-0">
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={cn(
                "ml-3 text-sm truncate overflow-hidden",
                isActive ? "font-bold" : "font-medium"
              )}>
                {item.label}
              </span>
            </div>

            {item.badge && (
              <Badge variant={item.badge.variant} className="ml-auto text-xs mr-2">
                {item.badge.text}
              </Badge>
            )}

            <IconChevronDown className={cn(
              "h-4 w-4 transition-transform ml-auto",
              isExpanded ? "rotate-180" : "rotate-0"
            )} />

            {/* Underline effect for hover */}
            {!isActive && (
              <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            )}
          </button>
        )}

        <AnimatePresence>
          {isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pl-6 space-y-1"
            >
              {item.children.map((child) => (
                <Link key={child.id} href={child.href} onClick={handleItemClick}>
                  <div
                    className={cn(
                      "w-full flex justify-start h-9 text-sm items-center px-3 relative group transition-all duration-200 rounded-md",
                      (child.href === "/events" && pathname === "/events") ||
                        (child.href !== "/events" && pathname.startsWith(child.href))
                        ? "text-foreground font-bold bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <child.icon className="h-4 w-4 mr-3" />
                    {child.label}
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link href={item.href} onClick={handleItemClick}>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "w-full flex justify-center h-10 px-3 items-center transition-all duration-200",
                isActive
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div
          className={cn(
            "w-full flex justify-start h-10 px-3 items-center relative group transition-all duration-200",
            isActive
              ? "text-foreground font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex items-center flex-1 min-w-0">
            <item.icon className="h-5 w-5 shrink-0" />
            <span className={cn(
              "ml-3 text-sm truncate overflow-hidden",
              isActive ? "font-bold" : "font-medium"
            )}>
              {item.label}
            </span>
          </div>

          {item.badge && (
            <Badge variant={item.badge.variant} className="ml-auto text-xs">
              {item.badge.text}
            </Badge>
          )}

          {/* Underline effect for hover */}
          {!isActive && (
            <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
          )}
        </div>
      )}
    </Link>
  );
};

export default NavigationItem;
