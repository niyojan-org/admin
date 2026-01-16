"use client";

import {
    IconCalendarEvent,
    IconUsers,
    IconCreditCard,
    IconMail,
    IconSettings,
    IconChartBar,
    IconUserCheck,
    IconBell,
    IconDatabase,
} from "@tabler/icons-react";

const capabilities = [
    {
        icon: IconCalendarEvent,
        title: "Event Lifecycle Management",
        description:
            "Full control over event creation, configuration, capacity management, and closure workflows.",
    },
    {
        icon: IconUsers,
        title: "Registration Control",
        description:
            "Manage individual and group registrations with real-time capacity tracking and sold status monitoring.",
    },
    {
        icon: IconCreditCard,
        title: "Payment Tracking & Retries",
        description:
            "Monitor payment statuses, handle failures, initiate retries, and maintain financial audit trails.",
    },
    {
        icon: IconUserCheck,
        title: "Approval-Based Flows",
        description:
            "Configure and manage approval workflows for events, registrations, and administrative actions.",
    },
    {
        icon: IconChartBar,
        title: "Real-Time Analytics",
        description:
            "Track event performance, registration trends, revenue metrics, and system health in real time.",
    },
    {
        icon: IconMail,
        title: "Communication Tools",
        description:
            "Centralized email and notification management with template controls and delivery tracking.",
    },
    {
        icon: IconDatabase,
        title: "Multi-Domain Operations",
        description:
            "Handle redirect-based flows, multi-domain routing, and cross-system integrations seamlessly.",
    },
    {
        icon: IconBell,
        title: "System Notifications",
        description:
            "Configure alerts, webhooks, and automated notifications for critical system events.",
    },
    {
        icon: IconSettings,
        title: "System-Level Controls",
        description:
            "Audit logs, configuration management, user permissions, and administrative oversight tools.",
    },
];

export function Capabilities() {
    return (
        <section id="capabilities" className="relative">
            <div className="container mx-auto space-y-5">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground ">
                        Administrative Capabilities
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Structured controls for professional event operations and system
                        management.
                    </p>
                </div>

                {/* Capabilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {capabilities.map((capability, index) => {
                        const Icon = capability.icon;
                        return (
                            <div
                                key={index}
                                className="group relative p-6 rounded-lg border bg-card hover:bg-accent/5 transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className="mb-4 inline-flex items-center justify-center p-3 rounded-lg bg-primary/10 text-primary">
                                    <Icon className="size-6" />
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {capability.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {capability.description}
                                    </p>
                                </div>

                                {/* Hover Border Effect */}
                                <div className="absolute inset-0 rounded-lg border-2 border-primary/0 group-hover:border-primary/20 transition-colors duration-300" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
