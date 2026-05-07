import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconCircleCheck,
  IconPlus,
  IconTicket,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
const numberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

function SummaryCard({ title, value, helper, icon: Icon, accentClass }) {
  return (
    <Card className="border-border/70 bg-background/80 shadow-sm backdrop-blur-sm">
      <CardContent className="flex items-start justify-between gap-3 p-0">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {value}
              </p>
            </div>
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
                accentClass,
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{helper}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TicketInfo({ tickets, handleCreateTicket, needCreateOption }) {
  const totalCapacity = tickets.reduce(
    (sum, ticket) => sum + Number(ticket?.capacity || 0),
    0,
  );
  const totalSold = tickets.reduce(
    (sum, ticket) => sum + Number(ticket?.sold || 0),
    0,
  );
  const liveTickets = tickets.filter((ticket) => ticket?.isActive).length;
  const projectedRevenue = tickets.reduce(
    (sum, ticket) =>
      sum + Number(ticket?.price || 0) * Number(ticket?.sold || 0),
    0,
  );
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardContent className="">
        <div className="flex flex-col gap-1 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl items-center">
            Build a clean ticket lineup for this event{" "}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Keep pricing, sales windows, and capacity easy to scan so you can
            make quick decisions without jumping between screens.
          </p>
          {needCreateOption && (
            <Button
              size="lg"
              className="h-11 rounded-full px-5"
              onClick={handleCreateTicket}
            >
              <IconPlus className="h-4 w-4" />
              Create ticket
            </Button>
          )}
        </div>

        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4 mt-2">
          <SummaryCard
            title="Ticket types"
            value={numberFormatter.format(tickets.length)}
            helper="Configured registration options"
            icon={IconTicket}
            accentClass="border-primary/20 bg-primary/10 text-primary"
          />
          <SummaryCard
            title="Live now"
            value={numberFormatter.format(liveTickets)}
            helper={`${numberFormatter.format(
              Math.max(tickets.length - liveTickets, 0),
            )} paused or inactive`}
            icon={IconCircleCheck}
            accentClass="border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
          />
          <SummaryCard
            title="Tickets sold"
            value={numberFormatter.format(totalSold)}
            helper={`${numberFormatter.format(totalCapacity)} total capacity`}
            icon={IconTrendingUp}
            accentClass="border-amber-500/20 bg-amber-500/10 text-amber-600"
          />
          <SummaryCard
            title="Revenue"
            value={`Rs ${currencyFormatter.format(projectedRevenue)}`}
            helper="Based on completed sales"
            icon={IconWallet}
            accentClass="border-sky-500/20 bg-sky-500/10 text-sky-600"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default TicketInfo;
