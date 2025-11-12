import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAnnouncementDetails } from '../hooks/useAnnouncementDetails';
import {
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  getMessageTypeInfo,
  formatDate,
  formatDeliveryStats,
  replacePlaceholders,
} from '../utils/helpers';

/**
 * Detailed view of an announcement with participant status
 */
export const AnnouncementDetails = ({ eventId, announcementId, open, onOpenChange }) => {
  const { announcement, loading } = useAnnouncementDetails(
    eventId,
    announcementId,
    open // Enable polling when dialog is open
  );

  // Don't render if dialog is not open
  if (!open) {
    return null;
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              <Skeleton className="h-8 w-64" />
            </DialogTitle>
            <DialogDescription>
              Loading announcement details...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!announcement) {
    return null;
  }

  const messageTypeInfo = getMessageTypeInfo(announcement.messageType);
  const deliveryStats = formatDeliveryStats(announcement.deliveryStats);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-xl">{announcement.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Announcement details including delivery status, message content, and participant information
              </DialogDescription>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={getStatusColor(announcement.status)}>
                  {getStatusLabel(announcement.status)}
                </Badge>
                <Badge variant={getPriorityColor(announcement.priority)}>
                  {announcement.priority}
                </Badge>
                <span className="text-muted-foreground">
                  {messageTypeInfo.icon} {messageTypeInfo.label}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="message">Message</TabsTrigger>
            <TabsTrigger value="participants">
              Participants ({announcement.participants?.length || 0})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 pr-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Delivery Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Delivery Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {deliveryStats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{formatDate(announcement.createdAt)}</span>
                  </div>
                  
                  {announcement.createdBy && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created by:</span>
                      <span className="font-medium">
                        {announcement.createdBy.name || announcement.createdBy.email}
                      </span>
                    </div>
                  )}

                  {announcement.isScheduled && announcement.scheduleDateTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scheduled for:</span>
                      <span className="font-medium">
                        {formatDate(announcement.scheduleDateTime)}
                      </span>
                    </div>
                  )}

                  {announcement.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="font-medium">
                        {formatDate(announcement.completedAt)}
                      </span>
                    </div>
                  )}

                  {announcement.jobId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Job ID:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {announcement.jobId}
                      </code>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Error */}
              {announcement.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <strong>Error:</strong> {announcement.error}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Message Tab */}
            <TabsContent value="message" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Original Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{announcement.message}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Preview Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    How the message appears to participants:
                  </p>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {replacePlaceholders(announcement.message, {
                        name: 'John Doe',
                        email: 'john@example.com',
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Participants Tab */}
            <TabsContent value="participants" className="mt-4">
              {announcement.participants && announcement.participants.length > 0 ? (
                <div className="space-y-2">
                  {announcement.participants.map((participant, index) => (
                    <Card key={participant.participantId?._id || index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">
                              {participant.participantId?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {participant.participantId?.email}
                            </div>
                            {participant.participantId?.phone && (
                              <div className="text-sm text-muted-foreground">
                                {participant.participantId.phone}
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            <Badge variant={getStatusColor(participant.status)}>
                              {getStatusLabel(participant.status)}
                            </Badge>
                            
                            {participant.sentAt && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatDate(participant.sentAt)}
                              </div>
                            )}

                            {participant.retryCount > 0 && (
                              <div className="text-xs text-yellow-600 mt-1">
                                Retried {participant.retryCount}x
                              </div>
                            )}

                            {participant.error && (
                              <div className="text-xs text-red-600 mt-1">
                                {participant.error}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>No participant data available.</AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
