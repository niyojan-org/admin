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
    <Card className="mb-6 overflow-hidden">
      {/* Banner Image */}
      {event.bannerImage && (
        <div className="relative h-48 sm:h-56 md:h-64 w-full">
          <Image
            src={event.bannerImage}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Action Buttons Overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="sm" variant="outline" className="hidden sm:flex" asChild>
              <Link href={`/event/share/${event._id}`}>
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/event/edit/${event._id}`}>
                <Edit className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Edit</span>
              </Link>
            </Button>
          </div>
        </div>
      )}

      <CardContent className="p-4 sm:p-6">
        {/* Status and Mode Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          <Badge variant={modeBadge.variant}>
            <ModeIcon className="w-3 h-3 mr-1" />
            {modeBadge.label}
          </Badge>
          {event.category && (
            <Badge variant="outline">{event.category}</Badge>
          )}
          {event.type && (
            <Badge variant="outline">{event.type}</Badge>
          )}
          {event.featured && <Badge variant="warning">Featured</Badge>}
          {event.fraudulent && <Badge variant="destructive">Fraudulent</Badge>}
        </div>

        {/* Title and Organization */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            {organization?.logo && (
              <img 
                src={organization.logo} 
                alt={organization.name} 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 object-cover" 
              />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight break-words">
                {event.title}
              </h1>
              {organization && (
                <p className="text-sm sm:text-base text-muted-foreground mt-1 break-words">
                  by <span className="font-medium text-primary">{organization.name}</span>
                  {organization.verified && (
                    <span className="ml-1 text-blue-500">✓</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-muted-foreground mt-4 text-sm sm:text-base leading-relaxed line-clamp-3">
            {event.description}
          </p>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Registration Period */}
        {event.registrationStart && event.registrationEnd && (
          <div className="mt-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">Registration:</span>
              </div>
              <span className="sm:ml-auto text-xs sm:text-sm">
                {new Date(event.registrationStart).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric' 
                })} - {new Date(event.registrationEnd).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{event.totalRegistrations || 0} registered</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Eye className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{event.viewCount || 0} views</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{event.sessions?.length || 0} sessions</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Created {new Date(event.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}