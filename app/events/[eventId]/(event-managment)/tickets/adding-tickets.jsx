import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconArrowRight } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";

function AddingTicket({ className, onClick }) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "w-full max-w-md h-full cursor-pointer border-2 border-dashed",
        "flex flex-col items-center justify-center text-center",
        "transition-all hover:border-primary hover:bg-muted/40 hover:shadow-md",
        className,
      )}
    >
      {/* Icon */}
      <div className="p-4 rounded-full bg-muted mb-3">
        <IconPlus className="h-6 w-6 text-muted-foreground" />
      </div>

      {/* Title */}
      <h3 className="font-semibold">Add New Ticket</h3>

      {/* Subtitle */}
      <p className="text-muted-foreground mt-1 max-w-45">
        Create a new ticket type for this event
      </p>

      {/* CTA Hint */}
      <div className="text-primary mt-3 font-medium flex hover-underline itmes-center gap-2">
        <p>Click to create </p>
        <IconArrowRight className="" />
      </div>
    </Card>
  );
}

export default AddingTicket;
