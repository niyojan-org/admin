"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconBuilding,
  IconFileText,
  IconCreditCard,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react";

const NavigationBar = ({ activeSection, onNavigate }) => {
  const navigationItems = [
    { id: "overview", label: "Overview", icon: IconBuilding },
    { id: "details", label: "Details", icon: IconFileText },
    { id: "bank", label: "Bank Details", icon: IconCreditCard },
    { id: "stats", label: "Statistics", icon: IconChartBar },
    { id: "documents", label: "Documents", icon: IconFileText },
    { id: "settings", label: "Settings", icon: IconSettings },
  ];

  return (
    <Card>
      <CardContent className="p-2">
        <div className="flex gap-2 overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                onClick={() => onNavigate(item.id)}
                className="flex-shrink-0"
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationBar;
