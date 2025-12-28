'use client'
import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export function ReferralPagination({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange
}) {
    if (totalPages <= 1) return null;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
                Showing {startIndex + 1}-{endIndex} of {totalItems} referrals
            </div>

            <div className="flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                >
                    <IconChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                </Button>

                <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                        ) {
                            return (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(page)}
                                    className="w-8 h-8 p-0 text-sm"
                                >
                                    {page}
                                </Button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-1 text-muted-foreground">...</span>;
                        }
                        return null;
                    })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <IconChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

export default ReferralPagination;
