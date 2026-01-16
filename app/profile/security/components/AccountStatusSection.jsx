"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconShield } from "@tabler/icons-react";

export function AccountStatusSection({ user }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <IconShield className="w-5 h-5" />
                    <CardTitle>Account Status</CardTitle>
                </div>
                <CardDescription>
                    Current status and role of your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">Active Account</Badge>
                    <Badge variant="outline" className="text-xs">
                        {user?.organization?.role 
                            ? user.organization.role.charAt(0).toUpperCase() + user.organization.role.slice(1)
                            : "User"}
                    </Badge>
                    {user?.isVerified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
