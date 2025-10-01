"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function DataTablePagination({ pagination, setPagination, dataLength, total }) {
  return (
    <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
      <div className="text-sm text-muted-foreground">
        Page {pagination.page} of {pagination.totalPages}
      </div>
      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
          disabled={pagination.page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPagination((p) => ({ ...p, page: Math.min(pagination.totalPages, p.page + 1) }))}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </Button>
      </div>
      <div className="flex flex-col-reverse items-center gap-0">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={String(pagination.limit)} onValueChange={val => setPagination(p => ({ ...p, limit: Number(val), page: 1 }))}>
            <SelectTrigger className="w-20">
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
        <p className="text-xs text-muted-foreground">
          Showing {dataLength} of {total} participants
        </p>
      </div>
    </div>
  );
}

export default DataTablePagination;
