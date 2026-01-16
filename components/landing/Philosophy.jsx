"use client";

import {
    IconRocket,
    IconCode,
    IconBolt,
    IconShield,
} from "@tabler/icons-react";

const principles = [
    {
        icon: IconRocket,
        title: "Built for Scale",
        description:
            "Architected to handle high-volume events, concurrent registrations, and real-time payment processing without performance degradation.",
    },
    {
        icon: IconCode,
        title: "Backend-First Design",
        description:
            "API-driven architecture with structured endpoints, predictable responses, and comprehensive error handling for reliable integrations.",
    },
    {
        icon: IconBolt,
        title: "Predictable Workflows",
        description:
            "No hidden automation. Every action is deliberate, logged, and reversible. Full control over system behavior and data flow.",
    },
    {
        icon: IconShield,
        title: "Zero Surprises",
        description:
            "Explicit validation, clear error messages, and comprehensive audit trails. You always know what the system is doing and why.",
    },
];

export function Philosophy() {
    return (
        <section className="py-10 md:py-32 relative">
            <div className="container mx-auto">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        System Philosophy
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Designed with reliability, transparency, and control at the core.
                    </p>
                </div>

                {/* Principles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {principles.map((principle, index) => {
                        const Icon = principle.icon;
                        return (
                            <div
                                key={index}
                                className="relative p-8 rounded-lg border bg-card"
                            >
                                {/* Icon */}
                                <div className="mb-4 inline-flex items-center justify-center p-3 rounded-lg bg-primary/10 text-primary">
                                    <Icon className="size-7" strokeWidth={1.5} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-foreground mb-3">
                                    {principle.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {principle.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Quote Box */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative p-8 md:p-12 rounded-xl border-2 bg-linear-to-br from-card to-accent/5">
                        <div className="absolute top-6 left-6 text-6xl text-primary/20 font-serif">
                            "
                        </div>
                        <p className="text-xl md:text-2xl text-foreground font-medium text-center leading-relaxed relative z-10">
                            This is not a consumer application.
                            <br />
                            This is infrastructure.
                        </p>
                        <div className="absolute bottom-6 right-6 text-6xl text-primary/20 font-serif">
                            "
                        </div>
                    </div>
                </div>

                {/* Technical Stack Info */}
                <div className="max-w-3xl mx-auto mt-10 text-center">
                    <p className="text-sm text-muted-foreground/70 leading-relaxed">
                        Powered by enterprise-grade infrastructure. Designed for teams who need reliability, not features.
                    </p>
                </div>
            </div>
        </section>
    );
}
