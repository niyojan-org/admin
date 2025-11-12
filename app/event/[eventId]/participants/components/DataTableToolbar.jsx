"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Eye, RefreshCw, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DataTableToolbar({
  table,
  search,
  setSearch,
  loading,
  refreshing,
  onRefresh,
  event,
  status,
  setStatus,
  ticketType,
  setTicketType,
  paymentStatus,
  setPaymentStatus,
  handleExport
}) {
  return (
    <div className="w-full space-y-3 mb-4">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Participants</h1>
        <Button size="sm" variant="outline" onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 w-full">
        <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center w-full md:w-auto">
          <div className="relative w-full md:w-[280px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 pr-8 w-full"
              placeholder="Search participants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-2.5"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 flex-1 md:flex-none">
                  <Eye className="w-4 h-4" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                {table.getAllLeafColumns().map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={() => col.toggleVisibility()}
                  >
                    {col.columnDef.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading || refreshing}
              className={`flex-1 md:flex-none ${refreshing ? "disabled:opacity-50" : ""}`}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {event?.tickets?.length > 1 && (
            <Select
              value={ticketType || "all"}
              onValueChange={(val) => setTicketType(val === "all" ? "" : val)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Ticket Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ticket Types</SelectItem>
                {event.tickets.map((t) => (
                  <SelectItem key={t.type} value={t.type}>
                    {t.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select
            value={status || "all"}
            onValueChange={(val) => setStatus(val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Participants</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={paymentStatus || "all"}
            onValueChange={(val) => setPaymentStatus(val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {ticketType && (
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setTicketType("")}
          >
            Ticket: {ticketType} <X className="ml-1 h-3 w-3" />
          </Badge>
        )}
        {status && (
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setStatus("")}
          >
            Status: {status} <X className="ml-1 h-3 w-3" />
          </Badge>
        )}
        {paymentStatus && (
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setPaymentStatus("")}
          >
            Payment: {paymentStatus} <X className="ml-1 h-3 w-3" />
          </Badge>
        )}
      </div>
    </div>
  );
}