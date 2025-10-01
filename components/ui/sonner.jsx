"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      richColors={true}
      toastOptions={{
        className: "rounded-lg shadow-lg",
      }}
      expanded={true}
      expand={true}
      icons={false}
      visibleToasts={3}
      className="toaster group"
      duplicateToasts={false}
      style={{
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      {...props}
    />
  );
};

export { Toaster };
