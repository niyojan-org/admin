"use client";

import {
    IconShieldLock,
    IconFingerprint,
    IconDeviceDesktop,
    IconFileAnalytics,
    IconKey,
    IconShieldCheck,
} from "@tabler/icons-react";

const securityFeatures = [
    {
        icon: IconShieldLock,
        title: "Multi-Factor Authentication",
        description: "Enforced MFA for all administrative accounts with TOTP and backup codes.",
    },
    {
        icon: IconFingerprint,
        title: "Passkey & WebAuthn Support",
        description: "Passwordless authentication using biometrics and hardware security keys.",
    },
    {
        icon: IconKey,
        title: "Session Validation",
        description: "Active session monitoring with automatic expiry and forced logout capabilities.",
    },
    {
        icon: IconDeviceDesktop,
        title: "Login Activity Tracking",
        description: "Comprehensive audit logs of all authentication attempts and device information.",
    },
    {
        icon: IconShieldCheck,
        title: "Admin-Only Access",
        description: "Role-based access control with granular permissions and approval workflows.",
    },
    {
        icon: IconFileAnalytics,
        title: "Audit-Ready Design",
        description: "Complete activity logs and compliance-ready audit trails for all operations.",
    },
];

export function Security() {
    return (
        <section className="py-10">
            <div className="container mx-auto">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card mb-6">
                        <IconShieldLock className="size-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Enterprise-Grade Security
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Locked down
                        <span className="text-primary"> By design.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        This system is intentional, controlled, and built for zero-trust
                        security standards.
                    </p>
                </div>

                {/* Security Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {securityFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="relative p-6 rounded-lg border bg-card"
                            >
                                {/* Icon */}
                                <div className="mb-4 inline-flex items-center justify-center p-3 rounded-lg bg-primary/10 text-primary">
                                    <Icon className="size-6" strokeWidth={1.5} />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Security Statement */}
                <div className="max-w-4xl mx-auto mt-10 p-8 rounded-lg border bg-card/50 backdrop-blur-sm">
                    <p className="text-center text-muted-foreground leading-relaxed">
                        Every action is logged. Every session is validated. Every access
                        request is verified. This is not a public application — it is a
                        secured administrative control panel designed for authorized
                        personnel only.
                    </p>
                </div>
            </div>
        </section>
    );
}
