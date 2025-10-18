"use client";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import DataTableToolbar from "./DataTableToolbar";
import DataTablePagination from "./DataTablePagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { fetchParticipants } from "./participantApi";
import { fetchEvent } from "./useEvent";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import moment from "moment";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmDialog from "./ConfirmParticipantDialog";
import ExportDialog from "./ExportDialog";
import { toast } from "sonner"; // Replace the toast import with Sonner
import { ChevronDown, ChevronUp } from "lucide-react"


function getDynamicFieldColumns(data, inputFields) {
  // Collect all unique dynamic field keys
  const keys = new Set();
  data.forEach((row) => {
    if (row.dynamicFields) {
      Object.keys(row.dynamicFields).forEach((k) => keys.add(k));
    }
  });
  // Map keys to inputFields for labels
  return Array.from(keys).map((key) => {
    const field = inputFields?.find((f) => f.name === key);
    return {
      accessorKey: `dynamicFields.${key}`,
      header: field?.label || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      cell: (info) => info.row.original.dynamicFields?.[key] || "-",
    };
  });
}

const staticColumns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "ticket.type",
    header: "Ticket Type",
    cell: (info) => info.row.original.ticket?.type || "-",
  },
  {
    accessorKey: "payment.status",
    header: "Payment Status",
    cell: (info) => info.row.original.payment?.status || "Free",
  },
  {
    accessorKey: "sessionCheckIn",
    header: "Session Check-ins",
    cell: (info) => info.row.original.sessionCheckIn?.length || 0,
  },
  {
    accessorKey: "createdAt",
    header: "Registered At",
    cell: (info) => moment(info.row.original.createdAt).format("MMM D, YYYY, h:mm A"),
  },
];

const DataTable = ({ eventId }) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState({ field: "createdAt", order: "desc" });
  const [status, setStatus] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [event, setEvent] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogParticipant, setDialogParticipant] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch event meta
  useEffect(() => {
    if (!eventId) return;
    fetchEvent(eventId).then(setEvent);
  }, [eventId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchParticipants({
        eventId,
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        status,
        ticketType,
        paymentStatus,
        sortField: sort.field,
        sortOrder: sort.order,
      });
      setData(res.participants || []);
      setPagination((prev) => ({
        ...prev,
        total: res.pagination?.total || 0,
        totalPages: res.pagination?.totalPages || 1,
      }));
    } catch (e) {
      setData([]);
    }
    setLoading(false);
    setRefreshing(false);
  }, [eventId, pagination.page, pagination.limit, debouncedSearch, status, ticketType, paymentStatus, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize columns so they update when data changes
  const columns = useMemo(() => {
    const dynamicCols = getDynamicFieldColumns(data, event?.inputFields);
    // Insert dynamic columns after Email
    const idx = staticColumns.findIndex((col) => col.accessorKey === "email");
    // Remove Confirm action column
    return [
      ...staticColumns.slice(0, idx + 1),
      ...dynamicCols,
      ...staticColumns.slice(idx + 1),
    ];
  }, [data, event]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      pagination: { pageIndex: pagination.page - 1, pageSize: pagination.limit },
      sorting: [{ id: sort.field, desc: sort.order === "desc" }],
      columnVisibility,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater({
          pageIndex: pagination.page - 1,
          pageSize: pagination.limit,
        });
        setPagination((p) => ({
          ...p,
          page: next.pageIndex + 1,
          limit: next.pageSize,
        }));
      } else {
        setPagination((p) => ({
          ...p,
          page: updater.pageIndex + 1,
          limit: updater.pageSize,
        }));
      }
    },
    onSortingChange: (updater) => {
      if (Array.isArray(updater) && updater.length > 0) {
        setSort({
          field: updater[0].id,
          order: updater[0].desc ? "desc" : "asc",
        });
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  // Handler for refresh button
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Handler for export button
  const handleExport = async (exportOptions) => {
    setIsExporting(true);
    try {
      // Build query string from export options
      const queryParams = new URLSearchParams();
      Object.entries(exportOptions).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const res = await api.get(`/event/admin/participant/${eventId}/export?${queryParams.toString()}`, {
        responseType: "blob",
      });
      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `participants-${eventId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExportDialogOpen(false);
      toast.success("Export successful", {
        description: "Your participant data has been exported to CSV."
      });
    } catch (e) {
      console.log(e);
      toast.error("Export failed", {
        description: "There was a problem exporting your data."
      });
    } finally {
      setIsExporting(false);
    }
  };

  const LoadingSkeleton = () => (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: columns.length }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full rounded bg-muted relative overflow-hidden">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
              </Skeleton>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  return (
    <Card className="w-full space-y-4">
      <DataTableToolbar
        table={table}
        search={search}
        setSearch={setSearch}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        event={event}
        status={status}
        setStatus={setStatus}
        ticketType={ticketType}
        setTicketType={setTicketType}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
        handleExport={() => setExportDialogOpen(true)}
      />

      <ConfirmDialog
        dialogParticipant={dialogParticipant}
        setDialogParticipant={setDialogParticipant}
        eventId={eventId}
        fetchData={fetchData}
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <Card className="w-full overflow-hidden">
        <div className="overflow-x-auto h-96 border rounded">
          <Table className="w-full">
            <TableHeader className="bg-card sticky top-0 z-10">
              <TableRow className="hover:bg-transparent border-b">
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={() => {
                      if (header.column.getCanSort()) {
                        table.setSorting([
                          {
                            id: header.column.id,
                            desc: !header.column.getIsSorted() || header.column.getIsSorted() === "asc",
                          },
                        ])
                      }
                    }}
                    className={`${
                      header.column.getCanSort() ? "cursor-pointer select-none hover:bg-muted/70" : ""
                    } transition-colors bg-muted/60 backdrop-blur-sm shadow-sm`}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-xs opacity-50">
                          {header.column.getIsSorted() === "desc" ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : header.column.getIsSorted() === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4 opacity-0" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <LoadingSkeleton />
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={table.getAllLeafColumns().length}>
                    <div className="h-32 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <p className="font-medium">No participants found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const participant = row.original
                  const isPending = participant.status === "pending"
                  return (
                    <TableRow
                      key={row.id}
                      className={`cursor-pointer transition-colors ${
                        isPending ? "bg-destructive/20 hover:bg-destructive/30 cursor-pointer" : "cursor-pointer"
                      }`}
                      onClick={() => setDialogParticipant(participant)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3 max-w-12 truncate">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t bg-muted/30 p-4">
          <DataTablePagination
            pagination={pagination}
            setPagination={setPagination}
            dataLength={data.length}
            total={pagination.total}
          />
        </div>
      </Card>
    </Card>
  )
};

export default DataTable;
