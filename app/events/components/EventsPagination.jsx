import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function EventsPagination({
  pagination,
  onPageChange,
  isDisabled,
}) {
  if (!pagination?.totalPages || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-xl border bg-card/80 backdrop-blur-sm p-4 sm:flex-row">
      <p className="text-sm text-muted-foreground text-center sm:text-left">
        Page{" "}
        <span className="font-semibold text-foreground">{pagination.page}</span>{" "}
        of {pagination.totalPages} • {pagination.totalItems} total events
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isDisabled || !pagination.hasPrevPage}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <IconChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isDisabled || !pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
          <IconChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
