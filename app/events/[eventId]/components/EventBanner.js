import CalendarCard from "../../../../components/Card/calendar-card.js";
import { Badge } from "@/components/ui/badge";
import {
  IconLockAccess,
  IconTicket,
  IconWorld,
  IconDeviceLaptopOff,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import Image from "next/image";

function EventBanner({ event }) {
  if (!event) return null;
  const size = 16;
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
    <div className="relative">
      <div className="rounded-2xl relative group">
        <Image
          src={event?.bannerImage || "/banner/default-event-banner.png"}
          alt="Event Banner"
          width={1920}
          height={1080}
          className="h-full rounded-2xl"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 bg-opacity-50 rounded-2xl transition-colors duration-300" />
        <div className="absolute inset-0 p-1 sm:p-2 flex flex-col justify-between">
          <div className="flex gap-2 overflow-x-hidden scrollbar-none">
            {event?.tags?.map((tag) => (
              <Badge key={tag} className="shrink-0">
                {tag}
              </Badge>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-4">
              <CalendarCard
                date={event?.sessions[0]?.startTime}
                className="text-white bg-none bg-black/30 border-white/50"
              />
              <div>
                <p className="text-4xl text-white line-clamp-1 truncate">
                  {event?.title}
                </p>
                <div className="text-white flex gap-2">
                  <div className="flex items-center gap-0.5">
                    <p>
                      {event?.mode === "online" ? (
                        <IconDeviceLaptop size={size} />
                      ) : event?.mode === "offline" ? (
                        <IconTicket size={size} />
                      ) : (
                        <IconDeviceLaptopOff size={size} />
                      )}
                    </p>
                    <p className="uppercase">{event?.mode}</p>
                  </div>
                  <br className="border-muted border" />
                  <div className="flex items-center gap-0.5">
                    <p>
                      {event?.isPrivate ? (
                        <IconLockAccess size={size} />
                      ) : (
                        <IconWorld size={size} />
                      )}
                    </p>
                    <p className="uppercase">
                      {event?.isPrivate ? "Private" : "Public"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:py-4 w-full px-2 text-white flex gap-8 justify-end sm:justify-start">
              {event?.metrics?.view >= 0 && (
                <div className="flex-col items-center -space-y-1 justify-center w-fit text-center">
                  <p className="text-lg">
                    {formatCompactNumber(event.metrics.view)}
                  </p>
                  <p className="text-sm">Views</p>
                </div>
              )}
              {event?.metrics?.paidRegistrations >= 0 && (
                <div className="flex-col items-center -space-y-1 justify-center w-fit text-center">
                  <p className="text-lg">
                    {formatCompactNumber(event.metrics.paidRegistrations)}
                  </p>
                  <p className="text-sm">Paid Registrations</p>
                </div>
              )}
              {event?.metrics?.freeRegistrations >= 0 && (
                <div className="flex-col items-center -space-y-1 justify-center w-fit text-center">
                  <p className="text-lg">
                    {formatCompactNumber(event.metrics.freeRegistrations)}
                  </p>
                  <p className="text-sm">Free Registrations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventBanner;
