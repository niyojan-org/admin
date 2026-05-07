import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconCalendarUser } from "@tabler/icons-react";
import { IconBell } from "@tabler/icons-react";
import { IconCalendar } from "@tabler/icons-react";
import moment from "moment";

function RegistrationCard({ event, className }) {
  if (!event) return null;
  return (
    <Card
      className={cn("w-full h-full gap-3 flex-col justify-between", className)}
    >
      <CardHeader className="flex items-center justify-between text-lg">
        <div className="flex items-center gap-1">
          <IconCalendarUser />
          <p className="font-semibold">Registration</p>
        </div>
        <Badge variant={event.isRegistrationOpen ? "success" : "destructive"}>
          {event.isRegistrationOpen ? "Open" : "Not Open"}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 items-center">
        <div className="flex items-center">
          <IconCalendar className="inline mr-2" />
          <p className="font-semibold ">
            {moment
              .utc(event.registrationStart)
              .local()
              .format("MMMM Do YYYY, h:mm a")}
          </p>
        </div>
        <p className="font-semibold ">TO</p>
        <div className="flex items-center">
          <IconCalendar className="inline mr-2" />
          <p className="font-semibold ">
            {moment
              .utc(event.registrationEnd)
              .local()
              .format("MMMM Do YYYY, h:mm a")}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          disabled={true}
          className="w-full cursor-pointer disabled:cursor-not-allowed"
        >
          <IconBell className="inline mr-2" />
          Send Reminder
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RegistrationCard;
