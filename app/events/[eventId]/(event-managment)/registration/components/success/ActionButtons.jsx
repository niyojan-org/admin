"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ticket, Calendar, Home, ArrowRight, Eye } from "lucide-react";

export default function ActionButtons({ eventSlug = "" }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000">
        <Button 
          asChild
          className="rounded-full w-full group h-9"
        >
          <Link href="/profile/tickets">
            <Ticket className="w-4 h-4" />
            View My Tickets
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        
        {eventSlug ? (
          <Button 
            asChild
            variant="outline"
            className="rounded-full w-full h-9"
          >
            <Link href={`/events/${eventSlug}`}>
              <Eye className="w-4 h-4" />
              View Event
            </Link>
          </Button>
        ) : (
          <Button 
            asChild
            variant="outline"
            className="rounded-full w-full h-9"
          >
            <Link href="/events">
              <Calendar className="w-4 h-4" />
              Browse Events
            </Link>
          </Button>
        )}
      </div>

      <div className="text-center mt-4 animate-in fade-in duration-700 delay-1000">
        <Button 
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </>
  );
}
