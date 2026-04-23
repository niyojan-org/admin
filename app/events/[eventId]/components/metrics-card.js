import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconDashboard } from "@tabler/icons-react";
import { IconReport } from "@tabler/icons-react";
import { IconCalendar } from "@tabler/icons-react";
import moment from "moment";

function MetricsCard({ event, className }) {
  if (!event) return null;
  const formatCompactNumber = (value) => {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return "0";
    if (Math.abs(numericValue) < 1000) return String(numericValue);

    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    })
      .format(numericValue)
      .replace("K", "k");
  };
  return (
    <Card className={cn("w-full h-full justify-between", className)}>
      <CardHeader className="flex items-center justify-between text-lg">
        <div className="flex items-center gap-1">
          <IconDashboard />
          <p className="font-semibold">Metrics</p>
        </div>
      </CardHeader>
      <CardContent className="flex gap-3 items-center w-full justify-between">
        {event?.metrics?.view >= 0 && (
          <div className="flex-col items-center -space-y-1 justify-center w-fit text-center">
            <p className="text-2xl font-semibold">
              {formatCompactNumber(event.metrics.view)}
            </p>
            <p className="text-sm text-muted-foreground">Views</p>
          </div>
        )}
        {event?.metrics?.paidRegistrations >= 0 && (
          <div className="flex-col items-center -space-y-1 justify-center w-fit text-center">
            <p className="text-2xl font-semibold">
              {formatCompactNumber(event.metrics.paidRegistrations)}
            </p>
            <p className="text-sm text-muted-foreground">Paid Registrations</p>
          </div>
        )}
        {event?.metrics?.freeRegistrations >= 0 && (
          <div className="flex-col items-center -space-y-1 justify-center w-fit text-center">
            <p className="text-2xl font-semibold">
              {formatCompactNumber(event.metrics.freeRegistrations)}
            </p>
            <p className="text-sm text-muted-foreground">Free Registrations</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full cursor-pointer" disabled={true}>
          <IconReport className="inline mr-2" />
          View Detailed Report
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MetricsCard;
