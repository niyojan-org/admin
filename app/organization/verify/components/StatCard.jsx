"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({ title, value, icon: Icon, className, variant = "default" }) {
    const variants = {
        default: "bg-primary/5 border-primary/20",
        success: "bg-green-500/5 border-green-500/20",
        warning: "bg-yellow-500/5 border-yellow-500/20",
        danger: "bg-red-500/5 border-red-500/20",
    };

    return (
        <Card className={cn("border-2 hover:shadow-md transition-all duration-200", variants[variant], className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                    {Icon && (
                        <div className="p-3 rounded-full bg-primary/10">
                            <Icon className="w-6 h-6 text-primary" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
