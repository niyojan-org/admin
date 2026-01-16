"use client";

import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Name */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <Logo className="w-10 h-10 transition-transform group-hover:scale-105" />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                ORGATICK
                            </span>
                            <span className="text-xs text-muted-foreground tracking-wide">
                                Admin Control
                            </span>
                        </div>
                    </Link>

                    {/* Right Side - Theme Toggle & Login */}
                    <div className="flex items-center gap-3">
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="rounded-full"
                            >
                                {theme === "dark" ? (
                                    <IconSun className="size-5" />
                                ) : (
                                    <IconMoon className="size-5" />
                                )}
                            </Button>
                        )}

                        <Link href="/auth">
                            <Button size="default" className="font-medium">
                                Access Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
