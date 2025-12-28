import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getStatusColor, getStatusLabel } from '../utils/helpers';

/**
 * Visual breakdown of announcement statuses
 */
export const StatusBreakdownChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const statuses = [
    { key: 'sent', label: 'Sent', color: 'bg-green-500' },
    { key: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { key: 'processing', label: 'Processing', color: 'bg-blue-500' },
    { key: 'partial', label: 'Partial', color: 'bg-orange-500' },
    { key: 'failed', label: 'Failed', color: 'bg-red-500' },
    { key: 'cancelled', label: 'Cancelled', color: 'bg-gray-500' },
  ];

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  const statusData = statuses
    .map((status) => ({
      ...status,
      count: data[status.key] || 0,
      percentage: total > 0 ? ((data[status.key] || 0) / total) * 100 : 0,
    }))
    .filter((status) => status.count > 0);

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
          <CardDescription>Distribution by status</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No announcements yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Breakdown</CardTitle>
        <CardDescription>Distribution of {total} announcements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Bar */}
        <div className="w-full h-8 flex rounded-lg overflow-hidden">
          {statusData.map((status) => (
            <div
              key={status.key}
              className={`${status.color} transition-all hover:opacity-80`}
              style={{ width: `${status.percentage}%` }}
              title={`${status.label}: ${status.count} (${status.percentage.toFixed(1)}%)`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {statusData.map((status) => (
            <div key={status.key} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${status.color}`} />
                <span className="text-sm text-muted-foreground">
                  {status.label}
                </span>
              </div>
              <div className="text-sm font-medium">
                {status.count} ({status.percentage.toFixed(1)}%)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
