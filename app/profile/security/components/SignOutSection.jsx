"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export function SignOutSection() {
    const router = useRouter();
    const { logout } = useUserStore();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <IconLogout className="w-5 h-5" />
                    <CardTitle>Sign Out</CardTitle>
                </div>
                <CardDescription>
                    Sign out of your account on this device
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="gap-2"
                >
                    <IconLogout className="h-4 w-4" />
                    Sign Out
                </Button>
            </CardContent>
        </Card>
    );
}
