'use client';
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
  Globe2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const EventHeader = ({ event, organization, setEventData }) => {
  const getStatusBadge = (status, isPublished, isBlocked) => {
    if (isBlocked) return { variant: "destructive", label: "Blocked" };
    if (!isPublished) return { variant: "secondary", label: "Draft" };
    if (status === "published") return { variant: "success", label: "Published" };
    if (status === "cancelled") return { variant: "destructive", label: "Cancelled" };
    if (status === "completed") return { variant: "outline", label: "Completed" };
    return { variant: "default", label: status };
  };

  const getModeBadge = (mode) => {
    const variants = {
      online: { variant: "default", label: "Online", icon: Globe2 },
      offline: { variant: "secondary", label: "Offline", icon: MapPin },
      hybrid: { variant: "outline", label: "Hybrid", icon: Globe2 }
    };
    return variants[mode] || variants.offline;
  };

  const statusBadge = getStatusBadge(event.status, event.isPublished, event.isBlocked);
  const modeBadge = getModeBadge(event.mode);
  const ModeIcon = modeBadge.icon;

  return (
    <Card className="overflow-hidden">
      {/* Banner Image */}
      <div className="relative h-64 w-full">
        <Image
          src={event?.bannerImage || 'https://res.cloudinary.com/ddk9qhmit/image/upload/v1761138208/orgatickBanner_vdyzdk.png'}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Action Buttons Overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/event/${event._id}/share`}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/event/${event._id}/edit`}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Link>
          </Button>
        </div>
      </div>
      <CardContent className="p-2 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Event Info (2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-4 order-1">
            {/* Status and Mode Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
              <Badge variant={modeBadge.variant}>
                <ModeIcon className="w-3 h-3 mr-1" />
                {modeBadge.label}
              </Badge>
              {event.featured && <Badge variant="warning">Featured</Badge>}
              {event.fraudulent && <Badge variant="destructive">Fraudulent</Badge>}
              <Badge variant="outline">{event.type}</Badge>
            </div>

            {/* Title and Organization */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <p className="text-muted-foreground">
                by <span className="font-medium text-primary">{organization.name}</span>
                {organization.verified && (
                  <span className="ml-1 text-blue-500">✓</span>
                )}
              </p>
            </div>

            {/* Description */}
            {event.description && (
              <p className="text-muted-foreground text-base leading-relaxed">
                {event.description}
              </p>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats - Always at bottom (spans full width, appears last) */}
          <div className="lg:col-span-3 order-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{event.totalRegistrations} registered</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{event.viewCount} views</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{event.sessions?.length || 0} sessions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Created {new Date(event.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventHeader;