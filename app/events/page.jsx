"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  IconPlus,
  IconSearch,
  IconDownload,
  IconCalendarEvent
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import EventCard from "./components/EventCard";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/events/admin/my-events");

        setEvents(data.data.events);
        setLoading(false);
      } catch (error) {
        console.log(error.response)
        toast.error(error.response?.data?.message || "Failed to fetch events. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);


  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.sessions && event.sessions[0]?.venue?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-[80vh]">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Filters Skeleton */}
        <Card className="p-6 shadow-lg rounded-xl bg-white/80">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </Card>

        {/* Events Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden shadow-md rounded-xl bg-white/90">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-8 w-16" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh md:px-8 pb-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-1 md:gap-4">
        <div className="-space-y-1 sm:space-y-0">
          <h1 className="text-4xl font-extrabold text-primary drop-shadow">Events</h1>
          <p className="text-muted-foreground text-base">Manage and monitor your events</p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center w-full md:w-auto">
          <div className="relative flex-1 w-full md:w-64">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full focus-visible:ring-2 focus-visible:ring-primary transition"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex w-full sm:w-auto items-center gap-3 sm:gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40 focus-visible:ring-2 focus-visible:ring-primary transition">
                {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="transition shadow hidden sm:flex">
              <IconDownload className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="w-full md:w-auto sm:hidden" asChild>
              <Link href="/events/create">
                <IconPlus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>

          </div>
        </div>

        <Button className="w-full md:w-auto hidden sm:flex" asChild>
          <Link href="/events/create">
            <IconPlus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full ">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-5">
              {filteredEvents.map((event, index) => (
                <div
                  key={event._id}
                  className=""
                >
                  <EventCard event={event} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="m-8 p-12 text-center shadow-xl rounded-xl flex flex-col items-center justify-center gap-4">
              <div className="mx-auto mb-4">
                <IconCalendarEvent className="h-16 w-16 text-primary animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                {searchQuery ? "No events found" : "No events yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first event."}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/events/create">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </Link>
                </Button>
              )}
            </Card>
          )}
        </ScrollArea>
      </div>
    </div>
  );

}
