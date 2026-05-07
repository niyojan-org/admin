"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InfoSection({ title, icon: Icon, children }) {
    return (
        <Card className="border-2 hover:shadow-lg transition-all duration-200 gap-0">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {Icon && <Icon className="w-5 h-5 text-primary" />}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    );
}

export function InfoItem({ label, value, icon: Icon }) {
    if (!value) return null;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-muted-foreground">
                {Icon && <Icon className="w-4 h-4" />}
                <p className="text-sm font-medium">{label}</p>
            </div>
            <p className="text-base font-medium pl-6">{value}</p>
        </div>
    );
}
