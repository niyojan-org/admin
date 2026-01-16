"use client";

import { IconShieldCheck, IconDatabase, IconUsers, IconClock, IconTrash, IconEye } from "@tabler/icons-react";
import Link from "next/link";

export default function PrivacyPage() {
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
                        <IconShieldCheck className="size-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Privacy Policy
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Last updated: January 16, 2026
                    </p>
                </div>

                {/* Introduction */}
                <section className="mb-12 p-6 rounded-lg border bg-card">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        ORGATICK ("<strong>we</strong>", "<strong>our</strong>", or "<strong>us</strong>") provides an administrative control panel 
                        for event management organizations. This Privacy Policy explains how we collect, use, store, and protect 
                        your personal information.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        This policy applies to both organization administrators who use our platform and event attendees whose 
                        data is managed through our system.
                    </p>
                </section>

                {/* Privacy Sections */}
                <div className="space-y-12">
                    {/* What We Collect */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconDatabase className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
                        </div>
                        <div className="space-y-6 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">For Organization Administrators</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><strong>Account Information:</strong> Name, email address, phone number</li>
                                    <li><strong>Authentication Data:</strong> Password (hashed), MFA tokens, passkeys</li>
                                    <li><strong>Organization Details:</strong> Organization name, verification documents, member lists</li>
                                    <li><strong>Profile Information:</strong> Profile photo, bio, social links</li>
                                    <li><strong>Login Activity:</strong> IP addresses, device information, browser type, login timestamps</li>
                                    <li><strong>Usage Data:</strong> Actions performed, features accessed, session duration</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">For Event Attendees</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><strong>Registration Information:</strong> Name, email, phone number</li>
                                    <li><strong>Event-Specific Data:</strong> Ticket type, dietary preferences, accessibility needs (as collected by event organizers)</li>
                                    <li><strong>Payment Information:</strong> Transaction IDs (payment details are handled by Razorpay)</li>
                                    <li><strong>QR Codes:</strong> Generated unique identifiers for event check-in</li>
                                    <li><strong>Check-in Data:</strong> Entry timestamps, gate information</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Automatically Collected</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Cookies and session identifiers</li>
                                    <li>Device and browser fingerprints</li>
                                    <li>System logs and error reports</li>
                                    <li>Performance and analytics data</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Data */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconEye className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">How We Use Your Information</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Core Platform Services</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Account creation and authentication</li>
                                    <li>Event creation, management, and registration</li>
                                    <li>QR code generation and validation</li>
                                    <li>Payment processing and revenue tracking</li>
                                    <li>Email and SMS notifications</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Security & Compliance</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Fraud detection and prevention</li>
                                    <li>Security monitoring and incident response</li>
                                    <li>Audit logging and compliance reporting</li>
                                    <li>Enforcing terms of service</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Service Improvement</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Analyzing usage patterns to improve features</li>
                                    <li>Debugging and technical support</li>
                                    <li>Internal analytics (no third-party tracking)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Communication</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Transactional emails (tickets, confirmations)</li>
                                    <li>Security alerts and notifications</li>
                                    <li>System updates and announcements</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Data Sharing */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconUsers className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">How We Share Your Information</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <p className="font-semibold text-foreground">We do not sell your personal data. We share information only in the following circumstances:</p>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">With Event Organizers</h3>
                                <p className="mb-2">
                                    When you register for an event, your registration data is shared with the organization hosting that event. 
                                    They act as data controllers for their events.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Third-Party Service Providers</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><strong>Razorpay:</strong> Payment processing (PCI-compliant)</li>
                                    <li><strong>Email Services:</strong> Transactional email delivery</li>
                                    <li><strong>SMS Providers:</strong> SMS notifications and OTPs</li>
                                    <li><strong>Cloud Infrastructure:</strong> Hosting and data storage</li>
                                </ul>
                                <p className="mt-2 text-sm">
                                    All third parties are contractually required to protect your data and use it only for specified purposes.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Legal Requirements</h3>
                                <p>
                                    We may disclose information if required by law, court order, or government request, or to protect 
                                    our rights, property, or safety.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconClock className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Data Retention</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Account Data:</strong> Retained while your account is active</li>
                                <li><strong>Event Data:</strong> Retained for 3 years after event completion for compliance and reporting</li>
                                <li><strong>Payment Records:</strong> Retained for 7 years as per financial regulations</li>
                                <li><strong>Login Logs:</strong> Retained for 1 year for security auditing</li>
                                <li><strong>Deleted Accounts:</strong> Personal data deleted within 30 days, except where required by law</li>
                            </ul>
                        </div>
                    </section>

                    {/* User Rights */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconShieldCheck className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Your Privacy Rights</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <p>You have the following rights regarding your personal data:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your account and data (subject to legal retention requirements)</li>
                                <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
                                <li><strong>Objection:</strong> Object to certain data processing activities</li>
                                <li><strong>Withdrawal of Consent:</strong> Withdraw consent for optional data processing</li>
                            </ul>
                            <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
                                <p className="font-semibold text-foreground mb-2">To exercise your rights:</p>
                                <p>Email us at <a href="mailto:privacy@orgatick.in" className="text-primary hover:underline">privacy@orgatick.in</a></p>
                                <p className="text-sm mt-2">We will respond within 30 days.</p>
                            </div>
                        </div>
                    </section>

                    {/* Data Security */}
                    <section>
                        <div className="p-6 rounded-lg border bg-card">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We implement industry-standard security measures to protect your information:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Encryption in transit (TLS 1.3) and at rest</li>
                                <li>Multi-factor authentication</li>
                                <li>Regular security audits and penetration testing</li>
                                <li>Access controls and role-based permissions</li>
                                <li>Continuous monitoring and incident response</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                For detailed security practices, see our <Link href="/security" className="text-primary hover:underline">Security Policy</Link>.
                            </p>
                        </div>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Children's Privacy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our administrative platform is not intended for individuals under 18 years of age. 
                            We do not knowingly collect personal information from children. If you believe we have 
                            inadvertently collected such information, please contact us immediately.
                        </p>
                    </section>

                    {/* International Users */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">International Data Transfers</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Your data is primarily stored and processed in India. If you access our services from outside India, 
                            your information may be transferred to, stored, and processed in India. By using our services, you 
                            consent to this transfer.
                        </p>
                    </section>

                    {/* Changes to Policy */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Privacy Policy periodically. Material changes will be notified via email or 
                            platform announcement. The "Last updated" date at the top indicates the latest revision.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <div className="p-6 rounded-lg border bg-card">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                For questions, concerns, or requests regarding this Privacy Policy or your personal data:
                            </p>
                            <div className="space-y-2 text-muted-foreground">
                                <p>Email: <a href="mailto:privacy@orgatick.in" className="text-primary hover:underline">privacy@orgatick.in</a></p>
                                <p>Privacy Officer: Orgatick Privacy</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Navigation */}
                <div className="mt-16 pt-8 border-t">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <Link href="/security" className="hover:text-foreground transition-colors">
                            Security Policy
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
