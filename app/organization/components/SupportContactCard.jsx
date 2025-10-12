"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconUsers, IconMail, IconPhone } from "@tabler/icons-react";

const SupportContactCard = ({ organization }) => {
  const supportContact = organization.supportContact || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Contact</CardTitle>
        <CardDescription>Primary support contact information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <IconUsers className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{supportContact.name || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IconMail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{supportContact.email || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IconPhone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{supportContact.phone || "N/A"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportContactCard;
