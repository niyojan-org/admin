"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  IconDashboard,
  IconCalendarEvent,
  IconUsers,
  IconChartBar,
  IconCreditCard,
  IconBell,
  IconMenu2,
  IconX,
  IconPlus,
  IconMail,
  IconUserCheck,
  IconTicket,
  IconBuilding,
  IconHeadset,
  IconHomeCog,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useUserStore } from "@/store/userStore";
import { useOrgStore } from "@/store/orgStore";
import Image from "next/image";

// Import the smaller components
import SidebarHeader from "./sidebar/SidebarHeader";
import NavigationItem from "./sidebar/NavigationItem";
import ThemeToggle from "./sidebar/ThemeToggle";
import UserProfile from "./sidebar/UserProfile";

const AppSidebar = ({ className }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const { user, logout } = useUserStore();
  const { organization } = useOrgStore();

  // Navigation configuration
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: IconDashboard,
      href: "/dashboard",
      badge: null,
    },
    {
      id: "events",
      label: "Events",
      icon: IconCalendarEvent,
      href: "/events",
      badge: { text: "3", variant: "secondary" },
      children: [
        {
          id: "all-events",
          label: "All Events",
          href: "/events",
          icon: IconCalendarEvent,
        },
        {
          id: "create-event",
          label: "Create Event",
          href: "/events/create",
          icon: IconPlus,
        }
        // {
        //   id: "event-templates",
        //   label: "Templates",
        //   href: "/events/templates",
        //   icon: IconTicket,
        // },
      ],
    },
    // {
    //   id: "analytics",
    //   label: "Analytics",
    //   icon: IconChartBar,
    //   href: "/dashboard/analytics",
    // },
    // {
    //   id: "payments",
    //   label: "Payments",
    //   icon: IconCreditCard,
    //   href: "/dashboard/payments",
    //   badge: { text: "New", variant: "destructive" },
    // },
    // {
    //   id: "messages",
    //   label: "Messages",
    //   icon: IconMail,
    //   href: "/messages",
    //   badge: { text: "5", variant: "secondary" },
    // },
    // {
    //   id: "notifications",
    //   label: "Notifications",
    //   icon: IconBell,
    //   href: "/notifications",
    // },
  ];

  const settingsItems = [
    {
      id: "settings",
      label: "Organization",
      icon: IconBuilding,
      href: "/organization",
    },
    {
      id: "member-management",
      label: "Members",
      icon: IconHomeCog,
      href: "/organization/members",
    },
    {
      id: "contact-support",
      label: "Support",
      icon: IconHeadset,
      href: "/contact",
    }
  ];

  // Check if a navigation item is active
  const isActive = (item) => {
    if (item.href === "/dashboard" && pathname === "/dashboard") return true;
    if (item.href !== "/dashboard") {
      // For items with children, check if any child is active
      if (item.children) {
        return item.children.some(child => {
          if (child.href === "/events" && pathname === "/events") return true;
          if (child.href !== "/events" && pathname.startsWith(child.href)) return true;
          return false;
        });
      }
      // For '/organization/members', require exact match
      if (item.href === "/organization/members" && pathname === "/organization/members") return true;
      if (item.href === "/organization" && pathname === "/organization") return true;
      // For items without children, exact match or starts with (but not for /events base)
      if (item.href === "/events" && pathname === "/events") return true;
      // if (item.href !== "/events" && item.href !== "/organization/members" && pathname.startsWith(item.href)) return true;
    }
    return false;
  };

  // Auto-expand active menu items with children
  useEffect(() => {
    const activeExpandedItems = {};
    navigationItems.forEach(item => {
      if (item.children && isActive(item)) {
        activeExpandedItems[item.id] = true;
      }
    });
    setExpandedItems(prev => ({ ...prev, ...activeExpandedItems }));
  }, [pathname]);

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Toggle expanded state for navigation items with children
  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Sidebar content component
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        organization={organization}
        isMobile={isMobile}
      />

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {/* Main navigation items */}
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={isActive(item)}
            isCollapsed={isCollapsed && !isMobile}
            isExpanded={expandedItems[item.id]}
            onToggleExpanded={() => toggleExpanded(item.id)}
            onItemClick={() => setIsCollapsed(true)}
          />
        ))}

        <div className="py-2">
          <Separator className="my-2" />
        </div>

        {/* Settings items */}
        {settingsItems.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={isActive(item)}
            isCollapsed={isCollapsed && !isMobile}
            onItemClick={() => setIsCollapsed(true)}
          />
        ))}

        {/* Theme Toggle */}
        <ThemeToggle isCollapsed={isCollapsed && !isMobile} />
      </nav>

      {/* User profile section */}
      <div className="p-4 border-t border-border">
        <UserProfile
          user={user}
          organization={organization}
          isCollapsed={isCollapsed && !isMobile}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className={cn(
          "hidden lg:flex flex-col bg-card border-r border-border h-dvh sticky top-0 z-40",
          className
        )}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <TooltipProvider>
          <SidebarContent />
        </TooltipProvider>
      </motion.div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 z-40 bg-card overflow-hidden w-full">
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center p-1">
              <Image
                src="https://res.cloudinary.com/ddk9qhmit/image/upload/v1755007468/icon_cusbi5.png"
                width={24}
                height={24}
                alt="Orgatick"
                className="h-5 w-5 object-contain"
              />
            </div>
            <h2 className="text-base font-semibold text-foreground truncate">
              Orgatick X {organization?.name || "Organization"}
            </h2>
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            {isMobileMenuOpen ? (
              <IconX className="h-4 w-4 text-foreground" />
            ) : (
              <IconMenu2 className="h-4 w-4 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 h-full w-72 bg-card border-r border-border shadow-lg z-50 lg:hidden"
              >
                <SidebarContent isMobile />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AppSidebar;
