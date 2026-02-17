"use client";

import { IconFileText, IconAlertCircle, IconCreditCard, IconUserX, IconScale } from "@tabler/icons-react";
import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
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
                        <IconFileText className="size-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Terms of Service
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Last updated: January 16, 2026
                    </p>
                </div>

                {/* Introduction */}
                <section className="mb-12 p-6 rounded-lg border bg-card">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        These Terms of Service ("<strong>Terms</strong>") govern your access to and use of the ORGATICK administrative
                        control panel ("<strong>Platform</strong>"). By creating an account or using the Platform, you agree to be bound
                        by these Terms.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        If you do not agree with these Terms, you may not access or use the Platform.
                    </p>
                </section>

                {/* Terms Sections */}
                <div className="space-y-12">
                    {/* Eligibility */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Eligibility and Account Registration</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">1.1 Eligibility</h3>
                                <p>
                                    You must be at least 18 years old and have the legal capacity to enter into binding contracts.
                                    The Platform is intended for authorized organization administrators only.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">1.2 Account Accuracy</h3>
                                <p>
                                    You agree to provide accurate, current, and complete information during registration and to
                                    update such information as necessary.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">1.3 Account Security</h3>
                                <p>You are responsible for:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                    <li>Maintaining the confidentiality of your credentials</li>
                                    <li>All activities that occur under your account</li>
                                    <li>Immediately notifying us of any unauthorized access</li>
                                    <li>Enabling and maintaining multi-factor authentication</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Permitted Use */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Permitted Use</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">2.1 License Grant</h3>
                                <p>
                                    We grant you a limited, non-exclusive, non-transferable, revocable license to access and use
                                    the Platform for event management purposes in accordance with these Terms.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">2.2 Acceptable Use</h3>
                                <p className="mb-2">You may use the Platform to:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Create and manage events</li>
                                    <li>Process event registrations and payments</li>
                                    <li>Generate and validate tickets</li>
                                    <li>Communicate with event attendees</li>
                                    <li>Analyze event data and metrics</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Prohibited Activities */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                                <IconUserX className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">3. Prohibited Activities</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <p>You agree <strong>NOT</strong> to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Violate any applicable laws, regulations, or third-party rights</li>
                                <li>Use the Platform for fraudulent or deceptive purposes</li>
                                <li>Attempt to gain unauthorized access to any part of the Platform</li>
                                <li>Interfere with or disrupt the Platform's operation or servers</li>
                                <li>Use automated scripts, bots, or scrapers without authorization</li>
                                <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
                                <li>Share your account credentials with unauthorized parties</li>
                                <li>Upload malicious code, viruses, or harmful content</li>
                                <li>Harass, abuse, or harm other users</li>
                                <li>Resell or redistribute Platform access without permission</li>
                                <li>Collect user data for unauthorized purposes</li>
                            </ul>
                        </div>
                    </section>

                    {/* Organization Responsibilities */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Organization Responsibilities</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">4.1 Data Controller Obligations</h3>
                                <p className="mb-2">
                                    As an organization administrator, you are the data controller for attendee information collected
                                    through your events. You are responsible for:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Obtaining necessary consents from attendees</li>
                                    <li>Complying with applicable data protection laws</li>
                                    <li>Providing clear privacy notices to attendees</li>
                                    <li>Handling data subject requests (access, deletion, etc.)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">4.2 Event Content</h3>
                                <p>
                                    You are solely responsible for the accuracy, legality, and appropriateness of all event content,
                                    descriptions, and materials uploaded to the Platform.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">4.3 Compliance</h3>
                                <p>
                                    You must ensure your events comply with all applicable laws, including but not limited to
                                    consumer protection, accessibility, and health and safety regulations.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Payments */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconCreditCard className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">5. Payments and Fees</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">5.1 Platform Fees</h3>
                                <p>
                                    Fees for using the Platform, if any, will be communicated during account setup. Current pricing
                                    and fee structure are available upon request.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">5.2 Payment Processing</h3>
                                <p className="mb-2">
                                    All payments are processed through Razorpay, a third-party payment processor. By using payment
                                    features, you agree to:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Razorpay's terms of service</li>
                                    <li>Payment gateway fees and transaction charges</li>
                                    <li>Standard payment processing timelines</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">5.3 Refunds</h3>
                                <p>
                                    Refund policies for event tickets are determined by the event organizer. Platform fees are
                                    non-refundable except as required by law or at our sole discretion.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">5.4 Taxes</h3>
                                <p>
                                    You are responsible for any applicable taxes related to your use of the Platform or events you organize.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">6.1 Platform Ownership</h3>
                                <p>
                                    The Platform, including all software, code, designs, logos, and content, is owned by ORGATICK
                                    and protected by intellectual property laws.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">6.2 Your Content</h3>
                                <p className="mb-2">
                                    You retain ownership of content you upload (event descriptions, images, etc.). By uploading content,
                                    you grant us a limited license to:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Display and distribute it as necessary for Platform operation</li>
                                    <li>Create backups and ensure service availability</li>
                                    <li>Generate QR codes and tickets</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Service Availability */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">7. Service Availability and Support</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">7.1 Uptime</h3>
                                <p>
                                    We strive to maintain high availability but do not guarantee uninterrupted access. Scheduled
                                    maintenance will be announced in advance when possible.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">7.2 Modifications</h3>
                                <p>
                                    We reserve the right to modify, suspend, or discontinue any part of the Platform at any time
                                    with reasonable notice.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Termination */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                                <IconAlertCircle className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">8. Termination</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">8.1 By You</h3>
                                <p>
                                    You may terminate your account at any time through account settings. Data deletion is subject
                                    to our retention policies.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">8.2 By Us</h3>
                                <p className="mb-2">We may suspend or terminate your account if:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>You violate these Terms</li>
                                    <li>Your account poses a security risk</li>
                                    <li>You engage in fraudulent activity</li>
                                    <li>Required by law or legal process</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">8.3 Effect of Termination</h3>
                                <p>
                                    Upon termination, your access will cease immediately. We may retain certain data as required
                                    by law or for legitimate business purposes.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Disclaimers */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <IconScale className="size-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">9. Disclaimers and Limitation of Liability</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">9.1 "As Is" Provision</h3>
                                <p>
                                    THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
                                    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR
                                    PURPOSE, OR NON-INFRINGEMENT.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">9.2 Limitation of Liability</h3>
                                <p>
                                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, ORGATICK SHALL NOT BE LIABLE FOR ANY INDIRECT,
                                    INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
                                    WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR OTHER INTANGIBLE LOSSES.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">9.3 Third-Party Services</h3>
                                <p>
                                    We are not responsible for failures or issues caused by third-party services (payment processors,
                                    email providers, etc.).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Indemnification */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">10. Indemnification</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You agree to indemnify, defend, and hold harmless ORGATICK, its officers, directors, employees, and
                            agents from any claims, liabilities, damages, losses, and expenses arising from your use of the Platform,
                            violation of these Terms, or infringement of any third-party rights.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law and Disputes</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
                                jurisdiction of courts in [Your City/State], India.
                            </p>
                        </div>
                    </section>

                    {/* Changes to Terms */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">12. Changes to These Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update these Terms from time to time. Material changes will be communicated via email or
                            platform notification at least 30 days before they take effect. Continued use of the Platform after
                            changes become effective constitutes acceptance of the revised Terms.
                        </p>
                    </section>

                    {/* Miscellaneous */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">13. Miscellaneous</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">13.1 Entire Agreement</h3>
                                <p>
                                    These Terms, along with our Privacy Policy and other referenced policies, constitute the entire
                                    agreement between you and ORGATICK.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">13.2 Severability</h3>
                                <p>
                                    If any provision of these Terms is found to be unenforceable, the remaining provisions will
                                    continue in full force and effect.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">13.3 No Waiver</h3>
                                <p>
                                    Failure to enforce any provision of these Terms does not constitute a waiver of that provision.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <div className="p-6 rounded-lg border bg-card">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                For questions or concerns regarding these Terms of Service:
                            </p>
                            <div className="space-y-2 text-muted-foreground">
                                <p>Email: <a href="mailto:support@orgatick.in" className="text-primary hover:underline">support@orgatick.in</a></p>
                                <p>Orgatick Support</p>
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
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            Privacy Policy
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
