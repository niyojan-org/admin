import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export function PaginationControls({ 
    currentPage, 
    totalPages, 
    totalCoupons, 
    itemsPerPage, 
    onPageChange 
}) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalCoupons);

    if (totalCoupons === 0) {
        return null;
    }

    return (
        <div className="flex items-center justify-between mt-6 px-2">
            <div className="text-sm text-muted-foreground">
                Showing {startItem} to {endItem} of {totalCoupons} coupons
            </div>
            
            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                    >
                        <IconChevronLeft className="w-3 h-3" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className="h-8 w-8 p-0"
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                    >
                        <IconChevronRight className="w-3 h-3" />
                    </Button>
                </div>
            )}
        </div>
    );
}
