"use client";

import { IconCookie, IconCheck, IconX, IconShieldCheck } from "@tabler/icons-react";
import Link from "next/link";

export default function CookiesPage() {
    return (
        <div className="">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 w-full">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto py-4 max-w-4xl">
                {/* Page Title */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card mb-6">
                        <IconCookie className="size-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Cookie Policy
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Cookie Policy
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Last updated: January 16, 2026
                    </p>
                </div>

                {/* Introduction */}
                <section className="mb-12 p-6 rounded-lg border bg-card">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        This Cookie Policy explains how ORGATICK ("<strong>we</strong>", "<strong>our</strong>", or "<strong>us</strong>") 
                        uses cookies and similar technologies on our administrative control panel.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        By using our Platform, you consent to the use of cookies as described in this policy.
                    </p>
                </section>

                {/* What Are Cookies */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">What Are Cookies?</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you 
                        visit a website. They are widely used to make websites work more efficiently and provide information to 
                        website owners.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Cookies can be "persistent" (remaining on your device until deleted or expired) or "session" cookies 
                        (deleted when you close your browser).
                    </p>
                </section>

                {/* Cookies We Use */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Cookies We Use</h2>
                    <div className="space-y-6">
                        {/* Essential Cookies */}
                        <div className="p-6 rounded-lg border bg-card">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                    <IconCheck className="size-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Essential / Strictly Necessary Cookies
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        These cookies are required for the Platform to function and cannot be disabled.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3 ml-14">
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="font-semibold text-foreground text-sm mb-1">Session Management</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Maintains your logged-in state across pages
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-mono">next-auth.session-token</span> • Expires: Session or 30 days
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="font-semibold text-foreground text-sm mb-1">CSRF Protection</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Prevents cross-site request forgery attacks
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-mono">next-auth.csrf-token</span> • Expires: Session
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="font-semibold text-foreground text-sm mb-1">Authentication State</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Stores secure authentication tokens
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-mono">__Secure-next-auth.callback-url</span> • Expires: Session
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Functional Cookies */}
                        <div className="p-6 rounded-lg border bg-card">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                    <IconCheck className="size-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Functional Cookies
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        These cookies enable enhanced functionality and personalization.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3 ml-14">
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="font-semibold text-foreground text-sm mb-1">Theme Preference</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Remembers your light/dark mode preference
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-mono">theme</span> • Expires: 1 year
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="font-semibold text-foreground text-sm mb-1">Organization Context</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Stores your selected organization for multi-org accounts
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-mono">selected-org</span> • Expires: 30 days
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="font-semibold text-foreground text-sm mb-1">Language Preference</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Remembers your language selection (if applicable)
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-mono">locale</span> • Expires: 1 year
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Cookies */}
                        <div className="p-6 rounded-lg border bg-card">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <IconShieldCheck className="size-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Security Cookies
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        These cookies help detect and prevent security threats.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3 ml-14">
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="font-semibold text-foreground text-sm mb-1">Device Fingerprint</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Helps identify suspicious login attempts from unknown devices
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-mono">device-id</span> • Expires: 90 days
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="font-semibold text-foreground text-sm mb-1">Rate Limiting</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Prevents brute force attacks and API abuse
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-mono">rate-limit-token</span> • Expires: 1 hour
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* What We DON'T Use */}
                        <div className="p-6 rounded-lg border bg-card border-green-500/20">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                    <IconX className="size-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        What We DON'T Use
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        We explicitly do NOT use the following types of cookies:
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 ml-14 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <IconX className="size-4 text-green-500" />
                                    <p className="text-sm">No advertising or marketing cookies</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconX className="size-4 text-green-500" />
                                    <p className="text-sm">No third-party tracking cookies (Google Analytics, Facebook Pixel, etc.)</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconX className="size-4 text-green-500" />
                                    <p className="text-sm">No behavioral profiling or retargeting cookies</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconX className="size-4 text-green-500" />
                                    <p className="text-sm">No social media tracking pixels</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Managing Cookies */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">How to Manage Cookies</h2>
                    <div className="space-y-4 text-muted-foreground">
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Browser Settings</h3>
                            <p className="mb-2">
                                Most web browsers allow you to control cookies through their settings. You can:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>View and delete existing cookies</li>
                                <li>Block all cookies</li>
                                <li>Block third-party cookies only</li>
                                <li>Clear cookies when you close your browser</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold mb-2">
                                ⚠️ Important Notice
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Blocking or deleting essential cookies will prevent you from logging in and using the Platform. 
                                These cookies are strictly necessary for the system to function.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Browser-Specific Instructions</h3>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Cookie Lifespans */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Cookie Lifespans</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">Cookie Type</th>
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">Duration</th>
                                    <th className="text-left py-3 px-4 font-semibold text-foreground">Can Be Disabled?</th>
                                </tr>
                            </thead>
                            <tbody className="text-muted-foreground">
                                <tr className="border-b">
                                    <td className="py-3 px-4">Session Cookies</td>
                                    <td className="py-3 px-4">Until browser closes or 30 days</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center gap-1 text-red-500">
                                            <IconX className="size-4" /> No (Essential)
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 px-4">Security Cookies</td>
                                    <td className="py-3 px-4">1 hour to 90 days</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center gap-1 text-red-500">
                                            <IconX className="size-4" /> No (Essential)
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 px-4">Functional Cookies</td>
                                    <td className="py-3 px-4">30 days to 1 year</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center gap-1 text-green-500">
                                            <IconCheck className="size-4" /> Yes (via browser)
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Data Privacy */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Data Privacy and Security</h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            All cookies used by ORGATICK are handled with strict security measures:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>HTTP-Only Flags:</strong> Session cookies cannot be accessed by JavaScript</li>
                            <li><strong>Secure Flags:</strong> Cookies are only transmitted over HTTPS</li>
                            <li><strong>SameSite Attributes:</strong> Protection against CSRF attacks</li>
                            <li><strong>Encryption:</strong> Sensitive cookie data is encrypted</li>
                            <li><strong>No Cross-Site Tracking:</strong> Cookies are not shared with third parties</li>
                        </ul>
                    </div>
                </section>

                {/* Updates */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We may update this Cookie Policy to reflect changes in technology, legal requirements, or our practices. 
                        The "Last updated" date at the top will be revised accordingly. We encourage you to review this policy 
                        periodically.
                    </p>
                </section>

                {/* Contact */}
                <section>
                    <div className="p-6 rounded-lg border bg-card">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Questions About Cookies?</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If you have questions about our use of cookies or this policy:
                        </p>
                        <div className="space-y-2 text-muted-foreground">
                            <p>Email: <a href="mailto:privacy@orgatick.in" className="text-primary hover:underline">privacy@orgatick.in</a></p>
                            <p className="text-sm mt-4">
                                For general privacy information, see our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer Navigation */}
                <div className="mt-16 pt-8 border-t">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <Link href="/security" className="hover:text-foreground transition-colors">
                            Security Policy
                        </Link>
                        <span>•</span>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <span>•</span>
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
