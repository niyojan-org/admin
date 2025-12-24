"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Eye,
  Edit,
  Share2,
  Clock,
  Globe2,
  Ticket
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function EventCard({ event, organization }) {
  if (!event) return null;

  const getStatusBadge = (status, isPublished, isBlocked) => {
    if (isBlocked) return { variant: "destructive", label: "Blocked" };
    if (!isPublished) return { variant: "secondary", label: "Draft" };
    if (status === "published") return { variant: "default", label: "Published" };
    if (status === "cancelled") return { variant: "destructive", label: "Cancelled" };
    if (status === "completed") return { variant: "outline", label: "Completed" };
    return { variant: "default", label: status || "Active" };
  };

  const getModeBadge = (mode) => {
    const variants = {
      online: { variant: "default", label: "Online", icon: Globe2 },
      offline: { variant: "secondary", label: "Offline", icon: MapPin },
      hybrid: { variant: "outline", label: "Hybrid", icon: Globe2 }
    };
    return variants[mode?.toLowerCase()] || variants.offline;
  };

  const statusBadge = getStatusBadge(event.status, event.isPublished, event.isBlocked);
  const modeBadge = getModeBadge(event.mode);
  const ModeIcon = modeBadge.icon;

  return (
    <Card className="mb-2 md:mb-3 overflow-hidden shadow-md">
      {/* Banner Image with Overlay Content */}
      <div className="relative">
        {/* Background Image */}
        <div className="relative h-60 sm:h-64 w-full">
          {event.bannerImage ? (
            <Image
              src={event.bannerImage}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30" />
          )}
          {/* Dark gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
          {/* Status and Mode Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            <Badge variant={modeBadge.variant}>
              <ModeIcon className="w-3 h-3 mr-1" />
              {modeBadge.label}
            </Badge>
            {event.category && (
              <Badge variant="outline" className="bg-accent-foreground">{event.category}</Badge>
            )}
            {event.featured && <Badge variant="warning">Featured</Badge>}
          </div>

          {/* Title and Organization */}
          <div className="space-y-1 mb-3">
            <div className="flex items-start gap-3">
              {organization?.logo && (
                <img 
                  src={organization.logo} 
                  alt={organization.name} 
                  className="w-10 h-10 rounded-full flex-shrink-0 object-cover border-2 border-white/80" 
                />
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold leading-tight break-words text-white">
                  {event.title}
                </h1>
                {organization && (
                  <p className="text-sm text-white/80 break-words">
                    by <span className="font-medium text-white">{organization.name}</span>
                    {organization.verified && (
                      <span className="ml-1 text-blue-400">✓</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tags - Limited to 3 for overlay */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {event.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-black/50 text-white border-white/20">
                  #{tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="outline" className="text-xs bg-black/50 text-white border-white/20">
                  +{event.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

        <Separator />

      {/* Bottom Card Content - Stats and Other Info */}
      <CardContent className="sm:p-3    ">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.totalRegistrations || 0} registered</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Eye className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.viewCount || 0} views</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.sessions?.length || 0} sessions</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Created {new Date(event.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}