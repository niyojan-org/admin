"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

function DataTablePagination({ pagination, setPagination, dataLength, total }) {
  return (
    <div className="flex items-center justify-between px-2 py-3 border-t">
      <div className="flex items-center gap-6">
        <div className="text-sm font-medium text-muted-foreground">
          Page{" "}
          <span className="font-semibold text-foreground">{pagination.page}</span> of{" "}
          <span className="font-semibold text-foreground">{pagination.totalPages}</span>
        </div>
        <div className="hidden sm:block text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{dataLength}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span> participants
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Rows per page:
          </span>
          <Select
            value={String(pagination.limit)}
            onValueChange={(val) =>
              setPagination((p) => ({ ...p, limit: Number(val), page: 1 }))
            }
          >
            <SelectTrigger className="w-[70px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
            }
            disabled={pagination.page === 1}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPagination((p) => ({ ...p, page: Math.min(pagination.totalPages, p.page + 1) }))
            }
            disabled={pagination.page === pagination.totalPages}
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>

      <div className="sm:hidden text-xs text-muted-foreground mt-2 w-full text-center">
        Showing {dataLength} of {total} participants
      </div>
    </div>
  );
}

export default DataTablePagination;
