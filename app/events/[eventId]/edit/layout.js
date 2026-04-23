"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EventEditLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
