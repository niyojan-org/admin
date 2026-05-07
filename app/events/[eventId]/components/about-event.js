import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function AboutEvent({ event, className }) {
  if (!event) return null;
  return (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader>About this event</CardHeader>
      <CardContent>{event?.description}</CardContent>
    </Card>
  );
}

export default AboutEvent;
