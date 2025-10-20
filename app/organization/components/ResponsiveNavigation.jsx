"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  IconBuilding,
  IconFileText,
  IconCreditCard,
  IconChartBar,
  IconSettings,
  IconMenu2,
  IconCheck,
  IconAlertCircle,
  IconShieldCheck,
  IconPencil,
  IconHomeCog,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useOrgStore } from "@/store/orgStore";
import { useBanner } from "@/components/banner/banner";

const ResponsiveNavigation = ({ activeSection, onSectionChange, organization }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { organization: org, isVerified, isInfoComplete } = useOrgStore();
  const banner = useBanner();

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: IconBuilding,
      description: "Quick stats and key metrics"
    },
    {
      id: "details",
      label: "Details",
      icon: IconFileText,
      description: "Basic information and address"
    },
    {
      id: "bank",
      label: "Bank Details",
      icon: IconCreditCard,
      description: "Payment and banking info"
    },
    {
      id: "stats",
      label: "Statistics",
      icon: IconChartBar,
      description: "Detailed analytics"
    },
    {
      id: "documents",
      label: "Documents",
      icon: IconFileText,
      description: "Verification documents"
    },
    {
      id: "settings",
      label: "Settings",
      icon: IconSettings,
      description: "Account preferences"
    },
  ];

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);
    setIsOpen(false);
  };

  const activeItem = navigationItems.find(item => item.id === activeSection);
  const ActiveIcon = activeItem?.icon || IconBuilding;

  // Calculate completion stats
  const stats = organization?.stats || {};
  const hasWarnings = stats.totalWarnings > 0;
  const hasBlockedEvents = stats.totalBlockedEvents > 0;

  if (org && !isVerified) {
    banner.info("Your organization is not verified. Please complete the verification process to access all features.", {
      href: "/organization/verify",
      label: "Verify Now"
    });
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
            <AvatarImage src={organization.logo} alt={organization.name} />
            <AvatarFallback className="text-lg sm:text-2xl">
              {organization.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
              {organization.name}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-1">
              <Badge
                variant={organization.verified ? "default" : "secondary"}
                className="text-xs"
              >
                {organization.verified ? (
                  <>
                    <IconShieldCheck className="mr-1 h-3 w-3" />
                    Verified
                  </>
                ) : (
                  "Not Verified"
                )}
              </Badge>
              <Badge
                variant={organization.active ? "default" : "destructive"}
                className="text-xs"
              >
                {organization.active ? "Active" : "Inactive"}
              </Badge>
              {organization.isBlocked && (
                <Badge variant="destructive" className="text-xs">
                  Blocked
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Mobile Edit Button */}
          <Button
            size="sm"
            className="sm:hidden"
            asChild
          >
            <Link href="/organization/members">
              <IconHomeCog className="h-4 w-4" />
            </Link>
          </Button>
          {/* Desktop Edit Button */}
          <Button
            className="hidden sm:flex"
            asChild
          >
            <Link href="/organization/members" className="flex items-center">
              <IconHomeCog className="mr-2 h-4 w-4" />
              Manage Members
            </Link>
          </Button>
        </div>
      </div>
      {/* Desktop Navigation - Horizontal Tabs */}
      <Card className="hidden md:block border-0 shadow-sm bg-muted/30 p-0">
        <CardContent className="p-1">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    group relative flex items-center gap-3 px-5 py-3 rounded-lg
                    flex-shrink-0 transition-all duration-200 font-medium text-sm
                    ${isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-background cursor-pointer hover:bg-accent hover:shadow-sm text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"
                    }`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-foreground/30 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Navigation - Sheet */}
      <div className="md:hidden">
        <CardContent className="p-0">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <ActiveIcon className="h-4 w-4" />
                  <span>{activeItem?.label || "Menu"}</span>
                </div>
                <IconMenu2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[79vh] px-2 flex flex-col">
              <SheetHeader className="flex-shrink-0 pb-4">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Browse through your organization sections
                </SheetDescription>
              </SheetHeader>

              {/* Organization Quick Info */}
              <div className="p-2 rounded-lg bg-muted/50 space-y-1 flex-shrink-0 mb-1 mr-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <div className="flex gap-2">
                    {organization?.verified && (
                      <Badge variant="default" className="text-xs">
                        <IconCheck className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                    {hasWarnings && (
                      <Badge variant="destructive" className="text-xs">
                        <IconAlertCircle className="mr-1 h-3 w-3" />
                        {stats.totalWarnings} Warnings
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Events</p>
                    <p className="text-lg font-bold">{stats.totalEventsHosted || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tickets</p>
                    <p className="text-lg font-bold">{stats.totalTicketsSold || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Trust</p>
                    <p className="text-lg font-bold">{organization?.trustScore || 0}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 min-h-0 overflow-hidden w-full">
                <ScrollArea className="h-full w-full">
                  <div className="space-y-2 pb-4 pr-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSectionClick(item.id)}
                          className={`w-full flex items-start gap-4 p-4 rounded-lg border transition-all ${isActive
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card hover:bg-accent border-border"
                            }`}
                        >
                          <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isActive ? "" : "text-muted-foreground"
                            }`} />
                          <div className="flex-1 text-left">
                            <p className={`font-medium ${isActive ? "" : "text-foreground"}`}>
                              {item.label}
                            </p>
                            <p className={`text-xs mt-0.5 ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                              }`}>
                              {item.description}
                            </p>
                          </div>
                          {isActive && (
                            <IconCheck className="h-5 w-5 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Additional Info */}
              {hasBlockedEvents && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex-shrink-0">
                  <div className="flex items-start gap-2">
                    <IconAlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">
                        {stats.totalBlockedEvents} Blocked Event{stats.totalBlockedEvents > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Check settings for more details
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </CardContent>
      </div>
    </>
  );
};

export default ResponsiveNavigation;
