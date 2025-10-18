"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconBrandInstagram, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import Logo from "@/assets/svg/Logo";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    // const handleSubscribe = (e) => {
    //   e.preventDefault();
    //   if (email.includes("@")) {
    //     setMessage("Subscribed successfully! 🎉");
    //     setEmail("");
    //   } else {
    //     setMessage("Please enter a valid email.");
    //   }
    // };

    return (
        <footer
            className="bg-card text-foreground pt-10 pb-5 px-6 sm:px-10 relative overflow-hidden transition-colors duration-700"
            role="contentinfo"
        >
            {/* Social & Newsletter */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-16 md:gap-0">
                {/* Newsletter Signup */}
                <section className="flex-1 max-w-md mx-auto md:mx-0 text-center md:text-left">
                    <header className="flex items-center justify-center md:justify-start gap-3 mb-6">
                        <Logo className="w-10 h-10" />
                        <h4 className="text-3xl font-extrabold text-primary tracking-tight">
                            Stay in the Loop
                        </h4>
                    </header>
                    <p className="text-foreground mb-4 text-base">
                        Subscribe for updates on student events, career boosters, and more.
                    </p>
                    <form
                        className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"

                    >
                        <Input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            aria-label="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full sm:w-[250px] py-5 rounded-lg border-border text-foreground placeholder-muted-foreground"
                            required
                        />
                        <Button
                            type="submit"
                            className="bg-primary py-5 rounded-lg text-primary-foreground hover:bg-primary/90 transition"
                        >
                            Subscribe
                        </Button>
                    </form>
                    {message && (
                        <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                            {message}
                        </p>
                    )}

                    {/* Social Links */}
                    <div className="flex gap-4 mt-6 justify-center md:justify-start">
                        <Link
                            href="https://instagram.com/orgatic"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="hover:text-primary transition-colors"
                        >
                            <IconBrandInstagram className="w-6 h-6" />
                        </Link>
                        <Link
                            href="https://twitter.com/orgatic"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                            className="hover:text-primary transition-colors"
                        >
                            <IconBrandX className="w-6 h-6" />
                        </Link>
                        <Link
                            href="https://linkedin.com/company/orgatic"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="hover:text-primary transition-colors"
                        >
                            <IconBrandLinkedin className="w-6 h-6" />
                        </Link>
                    </div>
                </section>

                {/* Footer Links (Now using GRID) */}
                <section className="flex-1 max-w-4xl mx-auto md:mx-0 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-10 text-sm md:text-base">
                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-5 text-primary">
                            Quick Links
                        </h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>
                                <Link href="/about" className="hover:text-primary transition">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary transition">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/explore"
                                    className="hover:text-primary transition"
                                >
                                    Explore Events
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-lg font-semibold mb-5 text-primary">Legal</h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>
                                <Link
                                    href="/privacy-policy"
                                    className="hover:text-primary transition"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms-and-conditions"
                                    className="hover:text-primary transition"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/refund-policy"
                                    className="hover:text-primary transition"
                                >
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-5 text-primary">
                            Support
                        </h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            Email us at: <br />
                            <Link
                                href="mailto:support@orgatic.events"
                                className="text-primary hover:underline"
                            >
                                support@orgatic.events
                            </Link>
                        </p>
                    </div>
                </section>
            </div>

            {/* Bottom Divider & Text */}
            <section className="max-w-7xl mx-auto mt-5 border-t border-border pt-4 text-center text-sm text-muted-foreground space-y-1">
                <p>
                    © {new Date().getFullYear()}{" "}
                    <span className="text-primary font-semibold">
                        <Link href="https://orgaticevent.in">Orgatic Event</Link>
                    </span>
                    . All rights reserved.
                </p>
                <p>
                    Managed & developed by{" "}
                    <span className="text-primary font-medium">Niyojan</span>.
                </p>
            </section>

            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: "Orgatic Event",
                        url: "https://orgatic.events",
                        logo: "https://orgatic.events/logo.png",
                        sameAs: [
                            "https://instagram.com/orgatic",
                            "https://twitter.com/orgatic",
                            "https://linkedin.com/company/orgatic",
                        ],
                    }),
                }}
            />
        </footer>
    );
}
