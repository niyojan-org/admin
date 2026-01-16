"use client";

import Logo from "@/assets/svg/Logo";
import { IconShieldLock } from "@tabler/icons-react";
import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t bg-accent/5">
            <div className="container mx-auto py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Top Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                        {/* Logo and Name */}
                        <div className="flex items-center gap-3">
                            <Logo className="w-10 h-10" />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-tight text-foreground">
                                    ORGATICK
                                </span>
                                <span className="text-xs text-muted-foreground tracking-wide">
                                    Admin Control Panel
                                </span>
                            </div>
                        </div>

                        {/* Internal System Notice */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border">
                            <IconShieldLock className="size-4 text-primary" />
                            <span className="text-sm text-muted-foreground font-medium">
                                Internal Administrative System
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t my-8" />

                    {/* Policy Links */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-6 text-sm text-muted-foreground">
                        <Link href="/security" className="hover:text-foreground transition-colors">
                            Security
                        </Link>
                        <span className="text-muted-foreground/50">·</span>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            Privacy
                        </Link>
                        <span className="text-muted-foreground/50">·</span>
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Terms
                        </Link>
                        <span className="text-muted-foreground/50">·</span>
                        <Link href="/cookies" className="hover:text-foreground transition-colors">
                            Cookies
                        </Link>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-6">
                            <p>© {currentYear} ORGATICK. All rights reserved.</p>
                            <span className="hidden md:block text-muted-foreground/50">|</span>
                            <p className="font-mono text-xs">admin.orgatick.in</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <p className="text-xs text-muted-foreground/70">
                                Authorized Personnel Only
                            </p>
                        </div>
                    </div>

                    {/* Legal Notice */}
                    <div className="mt-8 pt-8 border-t">
                        <p className="text-xs text-muted-foreground/60 text-center leading-relaxed max-w-3xl mx-auto">
                            This is a secured administrative control panel. All access attempts
                            are logged and monitored. Unauthorized access is prohibited and may
                            result in legal action. By accessing this system, you acknowledge
                            compliance with internal security policies.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
