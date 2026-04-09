"use client";

import React from "react";

export default function VerificationLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background via-background to-muted/20">
      {children}
    </div>
  );
}
