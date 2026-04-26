import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import {
  IconCalendarEvent,
  IconChartBar,
  IconDiscount2,
  IconEdit,
  IconForms,
  IconListDetails,
  IconQrcode,
  IconReportAnalytics,
  IconSettings2,
  IconShare3,
  IconSpeakerphone,
  IconTicket,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";

const roleLabels = {
  owner: "Owner",
  admin: "Admin",
  manager: "Manager",
  volunteer: "Volunteer",
  member: "Member",
};

const canUseAction = (role, allowedRoles) => allowedRoles.includes(role);

function QuickActionButton({ action }) {
  const Icon = action.icon;

  if (action.disabled || !action.href) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className="h-auto min-h-16 w-full justify-start whitespace-normal px-3 py-3 text-left"
      >
        <Icon className="mt-0.5 shrink-0" />
        <span className="min-w-0">
          <span className="block font-medium">{action.label}</span>
          <span className="block text-xs font-normal text-muted-foreground">
            {action.description}
          </span>
        </span>
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant={action.primary ? "default" : "outline"}
      className="h-auto min-h-16 w-full justify-start whitespace-normal px-3 py-3 text-left"
    >
      <Link href={action.href}>
        <Icon className="mt-0.5 shrink-0" />
        <span className="min-w-0">
          <span className="block font-medium">{action.label}</span>
          <span className="block text-xs font-normal opacity-80">
            {action.description}
          </span>
        </span>
      </Link>
    </Button>
  );
}

function QuickActionsCard({ event, className }) {
  const { user } = useUserStore();

  if (!event) return null;

  const userRole = user?.organization?.role || "member";
  const eventPath = event.slug || event._id;
  const hasCheckInSession = event.sessions?.some(
    (session) => session.allowCheckIn || session.checkInCode,
  );
  const registrationOpen = Boolean(event.isRegistrationOpen);

  const actions = [
    {
      label: "Edit event details",
      description: "Update title, description, mode, visibility, and settings.",
      icon: IconEdit,
      href: `/events/${eventPath}/edit?step=basicDetails`,
      roles: ["owner", "admin"],
      primary: true,
    },
    {
      label: "Manage sessions",
      description: "Add sessions, update venues, and configure check-in.",
      icon: IconCalendarEvent,
      href: `/events/${eventPath}/edit?step=sessions`,
      roles: ["owner", "admin"],
    },
    {
      label: "Manage tickets",
      description: "Create, edit, and control ticket availability.",
      icon: IconTicket,
      href: `/events/${eventPath}/edit?step=tickets`,
      roles: ["owner", "admin"],
    },
    {
      label: "Manage custom fields",
      description: "Collect extra attendee information during registration.",
      icon: IconForms,
      href: `/events/${eventPath}/edit?step=customFields`,
      roles: ["owner", "admin"],
    },
    {
      label: "Manage coupons",
      description: event.allowCoupons
        ? "Create and manage discount coupons."
        : "Configure coupons for this event.",
      icon: IconDiscount2,
      href: `/events/${eventPath}/edit?step=coupons`,
      roles: ["owner", "admin", "manager"],
    },
    {
      label: "View registrations",
      description: "Review participants, ticket status, and attendee details.",
      icon: IconUsers,
      href: `/events/${eventPath}/participants`,
      roles: ["owner", "admin", "manager"],
    },
    {
      label: "Registration analytics",
      description: "Track registrations, capacity, and timeline performance.",
      icon: IconChartBar,
      href: `/events/${eventPath}/edit?step=registration`,
      roles: ["owner", "admin", "manager"],
    },
    {
      label: "Check-in",
      description: "Scan tickets for sessions where check-in is enabled.",
      icon: IconQrcode,
      href: hasCheckInSession ? `/events/${eventPath}/checkin` : null,
      roles: ["owner", "admin", "manager", "volunteer"],
      disabled: !hasCheckInSession,
    },
    {
      label: "Add participant",
      description: registrationOpen
        ? "Register an attendee directly."
        : "Registration must be open before adding participants.",
      icon: IconUserPlus,
      href: registrationOpen ? `/events/${eventPath}/registration` : null,
      roles: ["owner", "admin", "manager"],
      disabled: !registrationOpen,
    },
    {
      label: "Share event",
      description: "Open share links, QR codes, coupons, and referrals.",
      icon: IconShare3,
      href: `/events/${eventPath}/share`,
      roles: ["owner", "admin", "manager"],
    },
    {
      label: "Announcements",
      description: "Send email or WhatsApp updates to participants.",
      icon: IconSpeakerphone,
      href: `/events/${eventPath}/announcements`,
      roles: ["owner", "admin", "manager"],
    },
    {
      label: "Reports",
      description: "Detailed event reports are coming soon.",
      icon: IconReportAnalytics,
      roles: ["owner", "admin"],
      disabled: true,
    },
  ].filter((action) => canUseAction(userRole, action.roles));

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex items-start justify-between gap-3 sm:flex-row">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <IconSettings2 />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Shortcuts shown according to your organization role.
          </CardDescription>
        </div>
        <Badge variant="secondary">
          {roleLabels[userRole] || "Limited access"}
        </Badge>
      </CardHeader>
      <CardContent>
        {actions.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {actions.map((action) => (
              <QuickActionButton key={action.label} action={action} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
            Your role can view this event, but there are no management actions
            available for this account.
          </div>
        )}
        {!hasCheckInSession && canUseAction(userRole, ["owner", "admin"]) && (
          <div className="mt-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-700 dark:text-yellow-300">
            No session has check-in enabled yet. Open Manage sessions to enable
            check-in for a session.
          </div>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <IconListDetails size={16} />
          Only actions that make sense for this event and your role are shown.
        </div>
      </CardContent>
    </Card>
  );
}

export default QuickActionsCard;
