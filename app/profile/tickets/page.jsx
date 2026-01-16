"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Ticket, ArrowLeft, Filter, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketCard } from "./components/TicketCard";
import { TicketDetailDialog } from "./components/TicketDetailDialog";
import api from "@/lib/api";
import { toast } from "sonner";
import { SpinnerCustom } from "@/components/ui/spinner";

export default function TicketsPage({ searchParams }) {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, statusFilter]);

  // Handle URL parameters for opening dialog
  useEffect(() => {
    const handleTicketCodeParam = async () => {
      const ticketCode = (await searchParams).ticketCode;
      if (ticketCode && tickets.length > 0) {
        const ticket = tickets.find((t) => t.ticket?.code === ticketCode);
        if (ticket) {
          setSelectedTicket(ticket);
          setDialogOpen(true);
        }
      }
    };

    handleTicketCodeParam();
  }, [searchParams, tickets]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/participants/history");
      setTickets(response.data.history || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error(error.response?.data?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.event?.title
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          ticket.ticket?.code
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          ticket.event?.category
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredTickets(filtered);
  };

  const handleViewDetails = (ticketCode) => {
    const ticket = tickets.find((t) => t.ticket?.code === ticketCode);
    if (ticket) {
      setSelectedTicket(ticket);
      setDialogOpen(true);
      router.replace(`/profile/tickets?ticketCode=${ticketCode}`, {
        scroll: false,
      });
    }
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTicket(null);
    router.replace("/profile/tickets", { scroll: false });
  };

  const handleDownloadTicket = async (ticketCode) => {
    try {
      toast.info("Downloading ticket...");
      const response = await api.get(
        `/user/participants/ticket/${ticketCode}`,
        {
          responseType: "blob",
        }
      );

      // Check if the response is actually an error (JSON) instead of a blob
      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        // Response is JSON (error), parse it
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Failed to download ticket");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket-${ticketCode}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Ticket downloaded successfully");
    } catch (error) {
      // Handle blob error response
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          toast.error(errorData.message || "Failed to download ticket");
        } catch (parseError) {
          toast.error("Failed to download ticket");
        }
      } else {
        toast.error(
          error.response?.data?.message ||
          error.message ||
          "Failed to download ticket"
        );
      }
    }
  };

  const getStatusCounts = () => {
    return {
      all: tickets.length,
      confirmed: tickets.filter((t) => t.status === "confirmed").length,
      pending: tickets.filter((t) => t.status === "pending").length,
      cancelled: tickets.filter((t) => t.status === "cancelled").length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerCustom />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-dvh bg-background w-full">
        {/* Compact Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container mx-auto py-3">
            {/* Header Content */}
            <div className="flex flex-col gap-3">
              {/* Top Row - Title, Back & Count */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-8 w-8 shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Ticket className="h-5 w-5 text-primary shrink-0" />
                  <h1 className="text-lg sm:text-xl font-semibold truncate">
                    My Tickets
                  </h1>
                </div>

                {/* Ticket Count Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                  <span className="text-xs sm:text-sm font-semibold text-primary">
                    {filteredTickets.length}
                  </span>
                  <span className="hidden sm:inline text-xs text-muted-foreground">
                    / {tickets.length}
                  </span>
                </div>
              </div>

              {/* Bottom Row - Search & Filter */}
              <div className="flex gap-2">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32.5 sm:w-35 h-9 text-sm">
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center justify-between w-full gap-3">
                        <span>All</span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {statusCounts.all}
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="confirmed">
                      <div className="flex items-center justify-between w-full gap-3">
                        <span>Confirmed</span>
                        <span className="text-xs text-green-600 font-medium">
                          {statusCounts.confirmed}
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pending">
                      <div className="flex items-center justify-between w-full gap-3">
                        <span>Pending</span>
                        <span className="text-xs text-yellow-600 font-medium">
                          {statusCounts.pending}
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelled">
                      <div className="flex items-center justify-between w-full gap-3">
                        <span>Cancelled</span>
                        <span className="text-xs text-red-600 font-medium">
                          {statusCounts.cancelled}
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto py-6 md:py-8">
          {filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-20">
              <div className="text-center space-y-4 max-w-md">
                <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <Ticket className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold">
                  {searchQuery || statusFilter !== "all"
                    ? "No tickets found"
                    : "No tickets yet"}
                </h2>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Your event tickets will appear here once you register for events"}
                </p>
                {(searchQuery || statusFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredTickets.map((ticket, index) => {

                return (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    onViewDetails={handleViewDetails}
                    onDownload={handleDownloadTicket}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Ticket Detail Dialog */}
      </div>
      <TicketDetailDialog
        ticket={selectedTicket}
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        onDownload={handleDownloadTicket}
      />
    </>
  );
}
