"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Eye, RefreshCw, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <>
      <div className="flex w-full justify-end mb-2">
        <Button size="sm" variant="outline" onClick={handleExport} className="flex items-center">
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 w-full">
        <div className="flex gap-2 items-center flex-wrap">
          <input
            className="border rounded px-2 py-1 min-w-[200px]"
            placeholder="Search participants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
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
            className={refreshing ? "disabled:opacity-50" : ""}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 items-center md:mt-0">
          {event?.tickets?.length > 1 && (
            <Select
              value={ticketType || ''}
              onValueChange={setTicketType}
              className="min-w-[120px]"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Ticket Type" />
              </SelectTrigger>
              <SelectContent>
                {event.tickets.map((t) => (
                  <SelectItem key={t.type} value={t.type}>{t.type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select value={status || 'all'} onValueChange={val => setStatus(val === 'all' ? '' : val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Participants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Participants</SelectItem>
              <SelectItem value="pending">Pending Participant</SelectItem>
              <SelectItem value="confirmed">Confirmed Participant</SelectItem>
              <SelectItem value="cancelled" disabled>Cancelled Participant</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentStatus || 'all'} onValueChange={val => setPaymentStatus(val === 'all' ? '' : val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Payments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending Payments</SelectItem>
              <SelectItem value="completed">Completed Payments</SelectItem>
              <SelectItem value="failed">Failed Payments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
// Removed duplicate/erroneous code after main return and function.
