"use client";

import { IconShieldLock, IconFingerprint, IconKey, IconDeviceDesktop, IconFileAnalytics, IconAlertTriangle, IconLock } from "@tabler/icons-react";
import Link from "next/link";

export default function SecurityPage() {
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
                        <IconShieldLock className="size-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Security Policy
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Security Policy
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Last updated: January 16, 2026
                    </p>
                </div>

                {/* Introduction */}
                <section className="mb-12 p-6 rounded-lg border bg-card">
                    <p className="text-muted-foreground leading-relaxed">
                        ORGATICK is an administrative control panel designed for event management organizations. 
                        Security is fundamental to our architecture. This document outlines our security practices, 
                        infrastructure decisions, and vulnerability response procedures.
                    </p>
                </section>

                {/* Security Sections */}
                <div className="space-y-12">
                    {/* Authentication */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconFingerprint className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Authentication</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Multi-Factor Authentication (MFA)</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Enforced for all administrative accounts</li>
                                    <li>Time-based One-Time Passwords (TOTP) support</li>
                                    <li>Backup codes provided during setup</li>
                                    <li>Cannot be disabled by users</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Passkey & WebAuthn</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Passwordless authentication using biometrics</li>
                                    <li>Hardware security key support (YubiKey, etc.)</li>
                                    <li>Platform authenticator support (Touch ID, Windows Hello)</li>
                                    <li>Phishing-resistant authentication flow</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Email Verification</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Required for all new accounts</li>
                                    <li>Re-verification on email change</li>
                                    <li>Time-limited verification tokens</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Authorization */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconLock className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Authorization</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Role-Based Access Control (RBAC)</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Admin-only access to the control panel</li>
                                    <li>Organization-level permissions</li>
                                    <li>Member invitation and approval system</li>
                                    <li>Granular permissions for events and data</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Organization Isolation</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Data segregation between organizations</li>
                                    <li>No cross-organization data access</li>
                                    <li>Verified organization ownership</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Session Management */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconKey className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Session Management</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Secure, HTTP-only session cookies</li>
                                <li>Automatic session expiration</li>
                                <li>Active session monitoring and tracking</li>
                                <li>Remote session termination capability</li>
                                <li>Device fingerprinting for anomaly detection</li>
                                <li>Forced logout on security events</li>
                            </ul>
                        </div>
                    </section>

                    {/* Login Activity Tracking */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconDeviceDesktop className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Login Activity & Audit Logs</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Comprehensive logging of all authentication attempts</li>
                                <li>Device information (browser, OS, IP address)</li>
                                <li>Geolocation tracking of login attempts</li>
                                <li>Failed login attempt monitoring</li>
                                <li>Audit trails for all administrative actions</li>
                                <li>Immutable log storage</li>
                            </ul>
                        </div>
                    </section>

                    {/* Payment Security */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconFileAnalytics className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Payment Security</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>PCI-compliant payment processing via Razorpay</li>
                                <li>No credit card data stored on our servers</li>
                                <li>Tokenized payment methods</li>
                                <li>Secure webhook validation</li>
                                <li>Transaction verification and reconciliation</li>
                            </ul>
                        </div>
                    </section>

                    {/* Infrastructure */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconFileAnalytics className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Infrastructure Security</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Data Protection</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Encryption in transit (TLS 1.3)</li>
                                    <li>Encryption at rest for sensitive data</li>
                                    <li>Regular automated backups</li>
                                    <li>Secure data deletion procedures</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Application Security</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Regular dependency updates and security patches</li>
                                    <li>Input validation and sanitization</li>
                                    <li>SQL injection prevention</li>
                                    <li>XSS and CSRF protection</li>
                                    <li>Rate limiting and DDoS protection</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Vulnerability Reporting */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconAlertTriangle className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Vulnerability Reporting</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                We take security vulnerabilities seriously. If you discover a security issue, 
                                please report it responsibly:
                            </p>
                            <div className="p-4 rounded-lg bg-muted/50 border">
                                <p className="font-semibold text-foreground mb-2">Contact:</p>
                                <p>Email: <a href="mailto:security@orgatick.in" className="text-primary hover:underline">security@orgatick.in</a></p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Please include:</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Detailed description of the vulnerability</li>
                                    <li>Steps to reproduce</li>
                                    <li>Potential impact assessment</li>
                                    <li>Any proof-of-concept code (if applicable)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Our commitment:</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Acknowledge receipt within 48 hours</li>
                                    <li>Provide regular updates on resolution progress</li>
                                    <li>Credit researchers (if desired) after fix deployment</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Security Updates */}
                    <section>
                        <div className="p-6 rounded-lg border bg-card">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Security Updates</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                This security policy is reviewed and updated regularly to reflect our current practices. 
                                Material changes will be communicated to all administrators. For questions or concerns, 
                                contact us at <a href="mailto:security@orgatick.in" className="text-primary hover:underline">security@orgatick.in</a>.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer Navigation */}
                <div className="mt-16 pt-8 border-t">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <span>•</span>
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                        <span>•</span>
                        <Link href="/cookies" className="hover:text-foreground transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
