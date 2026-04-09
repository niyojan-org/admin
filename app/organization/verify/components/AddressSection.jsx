"use client";

import { Separator } from "@/components/ui/separator";
import { IconUser } from "@tabler/icons-react";

export function AddressSection({ address, supportContact }) {
    if (!address) {
        return <p className="text-muted-foreground text-sm">Address details not available</p>;
    }

    return (
        <div className="space-y-6">
            {/* Address */}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <p className="text-sm font-medium text-muted-foreground">Street Address</p>
                    <p className="font-medium">{address.locality}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">City</p>
                        <p className="font-medium text-sm">{address.city}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">State</p>
                        <p className="font-medium text-sm">{address.state}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Country</p>
                        <p className="font-medium text-sm">{address.country}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Zip Code</p>
                        <p className="font-medium text-sm">{address.zipCode}</p>
                    </div>
                </div>
            </div>

            {/* Support Contact */}
            {supportContact && (
                <>
                    <Separator />
                    <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2 text-sm">
                            <IconUser className="w-4 h-4 text-primary" />
                            Support Contact
                        </h4>
                        <div className="space-y-3 pl-6">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Name</p>
                                <p className="font-medium text-sm">{supportContact.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Phone</p>
                                <p className="font-medium text-sm font-mono">{supportContact.phone}</p>
                            </div>
                            {supportContact.email && (
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                                    <p className="font-medium text-sm">{supportContact.email}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
