import { IconFilter, IconSearch, IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const STATUS_OPTIONS = [
  { label: "All status", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Blocked", value: "blocked" },
];

const PUBLISH_OPTIONS = [
  { label: "All publish states", value: "all" },
  { label: "Published", value: "true" },
  { label: "Unpublished", value: "false" },
];

const LIMIT_OPTIONS = ["10", "20", "50"];

export default function EventsFiltersBar({
  searchQuery,
  onSearchQueryChange,
  status,
  onStatusChange,
  isPublished,
  onPublishedChange,
  limit,
  onLimitChange,
  onReset,
  isLoading,
}) {
  const hasActiveFilters =
    Boolean(searchQuery.trim()) || status !== "all" || isPublished !== "all";

  return (
    <Card className="rounded-2xl border p-4 md:p-5 bg-card/80 backdrop-blur-sm gap-2">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">Filter events</p>
        {hasActiveFilters && (
          <p className="text-xs text-muted-foreground">Filters are active</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="relative md:col-span-5">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search title, description, or slug"
            className="pl-9 h-10"
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2 w-full">
          <Select
            value={status}
            onValueChange={onStatusChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-10 w-full">
              <div className="flex items-center gap-2 truncate">
                <IconFilter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 w-full gap-2">
          <Select
            value={isPublished}
            onValueChange={onPublishedChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Publish state" />
            </SelectTrigger>
            <SelectContent>
              {PUBLISH_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={limit}
            onValueChange={onLimitChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              {LIMIT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}/page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Button
            variant={hasActiveFilters ? "secondary" : "ghost"}
            className="w-full"
            onClick={onReset}
            disabled={isLoading || !hasActiveFilters}
          >
            <IconX className="mr-2 h-4 w-4" />
            Reset filters
          </Button>
        </div>
      </div>
    </Card>
  );
}
