"use client";

import {
    IconLayoutDashboard,
    IconCalendar,
    IconUsers,
    IconChartLine,
    IconBell,
    IconSettings,
} from "@tabler/icons-react";

export function DashboardPreview() {
    return (
        <section className="relative overflow-hidden">
            <div className="container mx-auto">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3 md:mb-4">
                        Built for operations teams
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground">
                        A clean, structured interface designed for efficiency and clarity.
                    </p>
                </div>

                {/* Dashboard Wireframe */}
                <div className="max-w-6xl mx-auto">
                    <div className="relative rounded-lg md:rounded-xl border-2 bg-card p-2 sm:p-3 md:p-4 shadow-2xl">
                        {/* Browser Chrome */}
                        <div className="flex items-center gap-2 mb-3 md:mb-4 pb-2 md:pb-3 border-b">
                            <div className="flex gap-1 sm:gap-1.5">
                                <div className="size-2 sm:size-3 rounded-full bg-destructive/60" />
                                <div className="size-2 sm:size-3 rounded-full bg-yellow-500/60" />
                                <div className="size-2 sm:size-3 rounded-full bg-success/60" />
                            </div>
                            <div className="hidden sm:flex flex-1 mx-2 md:mx-8 px-3 md:px-4 py-1 rounded bg-muted/50 text-xs text-muted-foreground font-mono overflow-hidden">
                                <span className="truncate">admin.orgatick.in/dashboard</span>
                            </div>
                        </div>

                        {/* Dashboard Layout */}
                        <div className="flex gap-2 sm:gap-3 md:gap-4">
                            {/* Sidebar - Hidden on mobile, visible on tablet+ */}
                            <div className="hidden sm:flex w-12 md:w-16 flex-col gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg bg-muted/30">
                                <div className="p-1.5 md:p-2 rounded bg-primary/20 text-primary">
                                    <IconLayoutDashboard className="size-4 md:size-5" />
                                </div>
                                <div className="p-1.5 md:p-2 rounded hover:bg-muted/50 text-muted-foreground transition-colors">
                                    <IconCalendar className="size-4 md:size-5" />
                                </div>
                                <div className="p-1.5 md:p-2 rounded hover:bg-muted/50 text-muted-foreground transition-colors">
                                    <IconUsers className="size-4 md:size-5" />
                                </div>
                                <div className="p-1.5 md:p-2 rounded hover:bg-muted/50 text-muted-foreground transition-colors">
                                    <IconChartLine className="size-4 md:size-5" />
                                </div>
                                <div className="hidden md:block p-2 rounded hover:bg-muted/50 text-muted-foreground transition-colors">
                                    <IconBell className="size-5" />
                                </div>
                                <div className="mt-auto p-1.5 md:p-2 rounded hover:bg-muted/50 text-muted-foreground transition-colors">
                                    <IconSettings className="size-4 md:size-5" />
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 space-y-2 sm:space-y-3 md:space-y-4 min-w-0">
                                {/* Header Bar */}
                                <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-muted/20 border">
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <div className="h-4 md:h-6 w-32 sm:w-40 md:w-48 rounded bg-muted/60" />
                                        <div className="h-2 md:h-3 w-20 sm:w-24 md:w-32 rounded bg-muted/40" />
                                    </div>
                                    <div className="h-8 md:h-9 w-24 md:w-32 rounded bg-primary/20 ml-2" />
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="p-3 md:p-4 rounded-lg bg-muted/20 border space-y-1.5 md:space-y-2"
                                        >
                                            <div className="h-2.5 md:h-3 w-16 md:w-20 rounded bg-muted/40" />
                                            <div className="h-6 md:h-8 w-20 md:w-24 rounded bg-muted/60" />
                                            <div className="h-1.5 md:h-2 w-12 md:w-16 rounded bg-success/40" />
                                        </div>
                                    ))}
                                </div>

                                {/* Chart Area */}
                                <div className="p-4 md:p-6 rounded-lg bg-muted/20 border">
                                    <div className="flex items-center justify-between mb-3 md:mb-4">
                                        <div className="h-4 md:h-5 w-24 md:w-32 rounded bg-muted/60" />
                                        <div className="h-4 md:h-5 w-16 md:w-24 rounded bg-muted/40" />
                                    </div>
                                    <div className="h-32 sm:h-40 md:h-48 rounded bg-muted/30 flex items-end justify-around p-2 sm:p-3 md:p-4 gap-1 sm:gap-1.5 md:gap-2">
                                        {[40, 70, 45, 80, 60, 90, 55, 75].map((height, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 rounded-t bg-primary/40"
                                                style={{ height: `${height}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Table Section */}
                                <div className="rounded-lg bg-muted/20 border overflow-hidden">
                                    <div className="p-3 md:p-4 border-b bg-muted/10">
                                        <div className="h-3 md:h-4 w-32 md:w-40 rounded bg-muted/60" />
                                    </div>
                                    <div className="divide-y">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="p-3 md:p-4 flex items-center gap-2 md:gap-4">
                                                <div className="size-6 md:size-8 rounded-full bg-muted/60 shrink-0" />
                                                <div className="flex-1 space-y-1 md:space-y-2 min-w-0">
                                                    <div className="h-2.5 md:h-3 w-32 sm:w-40 md:w-48 rounded bg-muted/60" />
                                                    <div className="h-1.5 md:h-2 w-20 sm:w-24 md:w-32 rounded bg-muted/40" />
                                                </div>
                                                <div className="h-5 md:h-6 w-16 md:w-20 rounded-full bg-success/30 shrink-0" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Caption */}
                    <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6 md:mt-8">
                        Clean interface · Real-time data · Structured workflows
                    </p>
                </div>
            </div>
        </section>
    );
}
