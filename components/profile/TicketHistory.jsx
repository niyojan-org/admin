"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpinnerCustom } from "../ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Ticket,
  Calendar,
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 2;

export function TicketHistory({ className }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchTicketHistory();
  }, []);

  const fetchTicketHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/participants/history');
      setTickets(response.data.history || []);
    } catch (error) {
      console.error('Error fetching ticket history:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch ticket history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async (ticketCode) => {
    try {
      toast.info('Downloading ticket...');
      const response = await api.get(`/user/participants/ticket/${ticketCode}`, {
        responseType: 'blob'
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${ticketCode}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Ticket downloaded successfully');
    } catch (error) {
      console.error('Error downloading ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to download ticket');
    }
  };

  const handleViewDetails = (ticketCode) => {
    router.push(`/profile/tickets?ticketCode=${ticketCode}`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTickets = tickets.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return {
          variant: "default",
          icon: CheckCircle,
          label: "Confirmed",
          color: "text-green-600",
        };
      case "pending":
        return {
          variant: "secondary",
          icon: Clock,
          label: "Pending",
          color: "text-yellow-600",
        };
      case "cancelled":
        return {
          variant: "destructive",
          icon: XCircle,
          label: "Cancelled",
          color: "text-destructive",
        };
      default:
        return {
          variant: "outline",
          icon: AlertCircle,
          label: status || "Unknown",
          color: "text-muted-foreground",
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getEventDate = (ticket) => {
    // Get the first session date if available, otherwise use createdAt
    if (ticket.sessionCheckIn && ticket.sessionCheckIn.length > 0) {
      return ticket.sessionCheckIn[0].sessionDetails?.startTime;
    }
    return ticket.createdAt;
  };

  const getEventVenue = (ticket) => {
    // Get the first session venue if available
    if (ticket.sessionCheckIn && ticket.sessionCheckIn.length > 0) {
      const venue = ticket.sessionCheckIn[0].sessionDetails?.venue;
      if (venue) {
        return `${venue.name}, ${venue.city}`;
      }
    }
    return "Venue TBA";
  };

  if (loading) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Ticket History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div> */}
          {/* <p className="text-sm text-muted-foreground mt-4">Loading tickets...asfdasfd</p> */}
          <SpinnerCustom />
        </CardContent>
      </Card>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card className={cn("h-full ", className)}>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Ticket History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No tickets found
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Your ticket history will appear here once you book events.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("flex flex-col h-full p-0 py-2 gap-2", className)}>
      <CardHeader className="border-b flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            <span className="text-lg">Ticket History</span>
          </div>
          <Badge variant="outline" className="text-xs">{tickets.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-0">
            {currentTickets.map((ticket, index) => {
              const statusConfig = getStatusConfig(ticket.status);
              const StatusIcon = statusConfig.icon;
              const eventDate = getEventDate(ticket);
              const eventVenue = getEventVenue(ticket);
              return (
                <div key={index}>
                  <div className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2">
                            {ticket.event.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Code: {ticket.ticket.code}
                          </p>
                        </div>
                        <Badge variant={statusConfig.variant} className="gap-1 text-xs shrink-0">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>

                      {/* Event Details */}
                      <div className="grid grid-cols-1 gap-1.5 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatDate(eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="line-clamp-1">{eventVenue}</span>
                        </div>
                      </div>

                      {/* Ticket Info */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {ticket.ticket.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {ticket.event.category}
                        </Badge>
                        <span className="text-xs font-semibold">
                          ₹{ticket.ticket.price}
                        </span>
                      </div>

                      {/* Group Info */}
                      {ticket.groupInfo?.groupName && (
                        <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                          Group: {ticket.groupInfo.groupName}
                          ({ticket.groupInfo.memberIndex}/{ticket.groupInfo.totalMembers})
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="default"
                          className="gap-1.5 h-8 text-xs flex-1"
                          onClick={() => handleViewDetails(ticket.ticket.code)}
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Details
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 h-8 text-xs"
                          onClick={() => handleDownloadTicket(ticket.ticket.code)}
                        >
                          <Download className="h-3 w-3" />
                          Ticket
                        </Button>
                      </div>
                    </div>
                  </div>

                  {index < currentTickets.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <CardFooter className="border-t flex-shrink-0 [.border-t]:pt-1">
          <Pagination className="w-full">
            <PaginationContent className="flex justify-center w-full">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={cn(
                    "cursor-pointer",
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={cn(
                    "cursor-pointer",
                    currentPage === totalPages && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
}