"use client";
import React from "react";
import { Card } from "@/components/ui/card";

export default function EventCard({ event, organization }) {
  if (!event) return null;
  return (
    <Card className="mb-6 flex flex-col md:flex-row gap-4 p-4 items-center">
      {event.bannerImage && (
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full md:w-64 h-40 object-cover rounded-lg shadow"
        />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {organization?.logo && (
            <img src={organization.logo} alt={organization.name} className="w-8 h-8 rounded-full" />
          )}
          <span className="font-semibold text-lg">{event.title}</span>
          {event.category && (
            <span className="ml-2 px-2 py-0.5 bg-muted rounded text-xs">{event.category}</span>
          )}
        </div>
        <div className="text-muted-foreground text-sm mb-2 line-clamp-2">{event.description}</div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Mode: {event.mode}</span>
          <span>Type: {event.type}</span>
          <span>Registration: {new Date(event.registrationStart).toLocaleDateString()} - {new Date(event.registrationEnd).toLocaleDateString()}</span>
          <span>Sessions: {event.sessions?.length || 0}</span>
          <span>Tickets: {event.tickets?.length || 0}</span>
        </div>
      </div>
    </Card>
  );
}
