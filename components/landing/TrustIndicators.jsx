"use client";

import {
  IconClock,
  IconServer,
  IconLock,
  IconActivity,
} from "@tabler/icons-react";

const indicators = [
  {
    icon: IconClock,
    value: "99.9%",
    label: "Uptime SLA",
  },
  {
    icon: IconServer,
    value: "< 100ms",
    label: "Response Time",
  },
  {
    icon: IconLock,
    value: "256-bit",
    label: "Encryption",
  },
  {
    icon: IconActivity,
    value: "24/7",
    label: "Monitoring",
  },
];

export function TrustIndicators() {
  return (
    <section className="py-16 border-y bg-accent/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-6" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {indicator.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {indicator.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
