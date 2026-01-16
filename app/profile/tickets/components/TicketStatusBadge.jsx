import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TicketStatusBadge({ status, className }) {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          variant: "default",
          icon: CheckCircle,
          label: "Confirmed",
          className: "bg-green-500 hover:bg-green-600 text-white",
        };
      case "pending":
        return {
          variant: "secondary",
          icon: Clock,
          label: "Pending",
          className: "bg-yellow-500 hover:bg-yellow-600 text-white",
        };
      case "cancelled":
        return {
          variant: "destructive",
          icon: XCircle,
          label: "Cancelled",
          className: "bg-red-500 hover:bg-red-600 text-white",
        };
      default:
        return {
          variant: "outline",
          icon: AlertCircle,
          label: status || "Unknown",
          className: "bg-muted",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn("gap-1.5 font-medium", config.className, className)}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
