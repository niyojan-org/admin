import { AnnouncementCard } from './AnnouncementCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

/**
 * Display list of announcements with pagination
 */
export const AnnouncementList = ({
  announcements,
  loading,
  pagination,
  onPageChange,
  onViewDetails,
  onCancel,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No announcements found. Create your first announcement to get started!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Announcements */}
      {announcements.map((announcement) => {
        return (
          <AnnouncementCard
            key={announcement._id}
            announcement={announcement}
            onViewDetails={onViewDetails}
            onCancel={onCancel}
          />
        );
      })}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem key="prev">
                <PaginationPrevious
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === pagination.pages ||
                    Math.abs(page - pagination.page) <= 1;

                  if (!showPage) {
                    // Show ellipsis for gaps
                    if (page === pagination.page - 2 || page === pagination.page + 2) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <span className="px-2">...</span>
                        </PaginationItem>
                      );
                    }
                    return null;
                  }

                  return (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={page === pagination.page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })
                .filter(Boolean)}
              
              <PaginationItem key="next">
                <PaginationNext
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={
                    pagination.page === pagination.pages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
