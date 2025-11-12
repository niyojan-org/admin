"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Users } from 'lucide-react';

const TablePagination = ({
  pagination,
  onPageChange,
  onLimitChange,
  loading = false
}) => {
  if (!pagination) return null;

  const {
    currentPage,
    totalPages,
    totalMembers,
    membersPerPage,
    hasNextPage,
    hasPrevPage
  } = pagination;

  const startItem = (currentPage - 1) * membersPerPage + 1;
  const endItem = Math.min(currentPage * membersPerPage, totalMembers);

  const handlePageChange = (page) => {
    if (!loading && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleLimitChange = (limit) => {
    if (!loading && limit !== membersPerPage) {
      onLimitChange(parseInt(limit));
    }
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <Card className="mt-4 py-2 px-0">
      <CardContent className="">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-4">
          {/* Members Info Section */}
          <div className="flex flex-row sm:items-center gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                Showing{' '}
                <Badge variant="secondary" className="mx-1">
                  {startItem}
                  {' - '}
                  {endItem}
                </Badge>

                of{' '}
                <Badge variant="outline" className="mx-1">
                  {totalMembers}
                </Badge>
                members
              </span>
            </div>

            <Separator orientation="vertical" className="hidden sm:block h-6" />

            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm text-muted-foreground whitespace-nowrap">
                Show
              </Label>
              {loading ? (
                <Skeleton className="w-20 h-9" />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select
                        value={membersPerPage.toString()}
                        onValueChange={handleLimitChange}
                        disabled={loading}
                      >
                        <SelectTrigger id="items-per-page" className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Items per page</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

            </div>
          </div>

          <Separator className="lg:hidden" />

          {/* Pagination Controls */}
          <div className="flex items-center justify-center lg:justify-end">
            {loading ? (
              <div className="flex items-center gap-1">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
                <div className="flex gap-1 mx-2">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-8 h-8" />
                </div>
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  {/* First Page */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(1)}
                        disabled={!hasPrevPage}
                        className="h-8 w-8"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                        <span className="sr-only">First page</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>First page</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Previous Page */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!hasPrevPage}
                        className="h-8 w-8"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Previous page</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 mx-2">
                    {getVisiblePages().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
                            ...
                          </span>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={page === currentPage ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className="h-8 w-8"
                              >
                                {page}
                                <span className="sr-only">
                                  {page === currentPage ? 'Current page' : `Go to page ${page}`}
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {page === currentPage ? 'Current page' : `Go to page ${page}`}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Next Page */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                        className="h-8 w-8"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Next page</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Last Page */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={!hasNextPage}
                        className="h-8 w-8"
                      >
                        <ChevronsRight className="h-4 w-4" />
                        <span className="sr-only">Last page</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Last page</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TablePagination;
