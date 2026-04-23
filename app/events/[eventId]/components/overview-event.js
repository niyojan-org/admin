import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconBell,
  IconBrandWhatsapp,
  IconCalendarUser,
  IconChecks,
  IconDeviceLaptop,
  IconDiscount2,
  IconInfoCircle,
  IconShare3,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";

const titleCase = (value) => {
  if (!value) return "Not specified";

  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStatusBadge = (event) => {
  if (event?.isBlocked) {
    return {
      label: "Blocked",
      variant: "destructive",
      description: "This event is currently blocked.",
    };
  }

  if (event?.status === "cancelled") {
    return {
      label: "Cancelled",
      variant: "destructive",
      description: "This event has been cancelled.",
    };
  }

  if (event?.isPublished) {
    return {
      label: "Published",
      variant: "success",
      description: "This event is live and visible to attendees.",
    };
  }

  if (event?.status === "draft") {
    return {
      label: "Draft event",
      variant: "secondary",
      description: "This event is still being prepared and is not published yet.",
    };
  }

  return {
    label: titleCase(event?.status),
    variant: "secondary",
    description: `Current event status is ${titleCase(event?.status).toLowerCase()}.`,
  };
};

const getBooleanBadge = (enabled) => (enabled ? "success" : "secondary");

function OverviewEvent({ event, className }) {
  if (!event) return null;

  const status = getStatusBadge(event);
  const visibility = event.isPrivate || event.visibility === "private";

  const overviewItems = [
    {
      icon: IconDeviceLaptop,
      label: "Event mode",
      value:
        event.mode === "online"
          ? "Online event"
          : event.mode === "offline"
            ? "In-person event"
            : `${titleCase(event.mode)} event`,
      variant: "secondary",
    },
    {
      icon: IconWorld,
      label: "Visibility",
      value: visibility ? "Private event" : "Public event",
      variant: visibility ? "secondary" : "success",
    },
    {
      icon: IconInfoCircle,
      label: "Status",
      value: status.label,
      description: status.description,
      variant: status.variant,
    },
    {
      icon: IconCalendarUser,
      label: "Registration",
      value: event.isRegistrationOpen
        ? "Registration is open"
        : "Registration is closed",
      variant: event.isRegistrationOpen ? "success" : "destructive",
    },
    {
      icon: IconUsers,
      label: "Sessions",
      value: event.allowMultipleSessions
        ? "Multiple sessions are allowed"
        : "Only one session is allowed",
      variant: getBooleanBadge(event.allowMultipleSessions),
    },
    {
      icon: IconDiscount2,
      label: "Coupons",
      value: event.allowCoupons ? "Coupons are allowed" : "Coupons are disabled",
      variant: getBooleanBadge(event.allowCoupons),
    },
    {
      icon: IconShare3,
      label: "Referrals",
      value: event.allowReferrals
        ? "Referrals are allowed"
        : "Referrals are disabled",
      variant: getBooleanBadge(event.allowReferrals),
    },
    {
      icon: IconChecks,
      label: "Participant approval",
      value: event.autoApproveParticipants
        ? "Participants are approved automatically"
        : "Participants need manual approval",
      variant: getBooleanBadge(event.autoApproveParticipants),
    },
    {
      icon: IconBell,
      label: "Notifications",
      value: event.enableEmailNotifications
        ? "Email notifications are enabled"
        : "Email notifications are disabled",
      variant: getBooleanBadge(event.enableEmailNotifications),
    },
    {
      icon: IconBrandWhatsapp,
      label: "WhatsApp",
      value: event.enableWhatsappNotifications
        ? "WhatsApp notifications are enabled"
        : "WhatsApp notifications are disabled",
      variant: getBooleanBadge(event.enableWhatsappNotifications),
    },
  ];

  return (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader className="flex items-center justify-between text-lg">
        <div className="flex items-center gap-1">
          <IconInfoCircle />
          <p className="font-semibold">Event Overview</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {overviewItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3"
            >
              <div className="mt-0.5 rounded-md bg-background p-1.5 text-muted-foreground">
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>
                <Badge
                  variant={item.variant}
                  className="whitespace-normal text-left"
                >
                  {item.value}
                </Badge>
                {item.description && (
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default OverviewEvent;
