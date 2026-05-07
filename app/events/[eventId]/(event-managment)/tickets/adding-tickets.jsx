import { IconArrowRight, IconPlus } from "@tabler/icons-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function AddingTicket({ className, onClick }) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group h-full min-h-[22rem] cursor-pointer rounded-[2rem] border-2 border-dashed border-border/70 bg-linear-to-br from-background to-muted/25 p-0 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/15 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
          <IconPlus className="h-7 w-7" />
        </div>

        <div className="mt-6 space-y-2">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            Add a new ticket
          </h3>
          <p className="mx-auto max-w-xs text-sm leading-6 text-muted-foreground">
            Launch another tier for VIP guests, early access, teams, or any
            special registration path.
          </p>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-4 py-2 text-sm font-medium text-primary">
          Create ticket
          <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default AddingTicket;
