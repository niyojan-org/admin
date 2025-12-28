import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  IconEye, 
  IconX, 
  IconCircleCheck, 
  IconAlertCircle, 
  IconClock, 
  IconCalendar, 
  IconUser,
  IconBrandWhatsapp,
  IconMail,
  IconDeviceMobile,
  IconSpeakerphone
} from '@tabler/icons-react';
import {
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  getMessageTypeInfo,
  formatDate,
  calculateSuccessRate,
} from '../utils/helpers';

/**
 * Card component for displaying individual announcement
 */
export const AnnouncementCard = ({ announcement, onViewDetails, onCancel }) => {
  const messageTypeInfo = getMessageTypeInfo(announcement.messageType);
  
  // Get the appropriate icon component
  const MessageIcon = {
    IconBrandWhatsapp,
    IconMail,
    IconDeviceMobile,
    IconSpeakerphone,
  }[messageTypeInfo.iconName] || IconSpeakerphone;
  const canCancel = ['pending', 'scheduled'].includes(announcement.status);
  const isProcessing = ['pending', 'processing'].includes(announcement.status);
  
  const deliveryRate = announcement.deliveryStats
    ? calculateSuccessRate(
        announcement.deliveryStats.sent,
        announcement.deliveryStats.total
      )
    : 0;

  return (
    <Card className="hover:shadow-md transition-shadow gap-0">
      <CardHeader className="">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center gap-2">
              <h3 className="font-semibold text-base sm:text-lg text-foreground break-words">{announcement.title}</h3>
              <Badge variant={getStatusColor(announcement.status)} className="w-fit">
                {getStatusLabel(announcement.status)}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
              <span className={`flex items-center gap-1 ${messageTypeInfo.className}`}>
                <MessageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{messageTypeInfo.label}</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <Badge variant={getPriorityColor(announcement.priority)} className="text-xs">
                {announcement.priority}
              </Badge>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <IconCalendar className="h-3 w-3" />
                <span className="text-xs">{formatDate(announcement.createdAt)}</span>
              </span>
            </div>

            {announcement.isScheduled && announcement.scheduleDateTime && (
              <div className="flex items-center gap-1 text-xs sm:text-sm text-blue-600">
                <IconClock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Scheduled for: {formatDate(announcement.scheduleDateTime)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-row sm:flex-col md:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(announcement)}
              className="gap-1 flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <IconEye className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">View</span>
            </Button>
            
            {canCancel && onCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel(announcement)}
                className="gap-1 flex-1 sm:flex-none text-xs sm:text-sm"
              >
                <IconX className="h-3 w-3 sm:h-4 sm:w-4" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {/* Delivery Stats */}
        {announcement.deliveryStats && (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm">
              <span className="text-muted-foreground">Delivery Progress</span>
              <span className="font-medium text-foreground">
                {announcement.deliveryStats.sent} / {announcement.deliveryStats.total}
                {' '}({deliveryRate}%)
              </span>
            </div>
            
            <Progress
              value={parseFloat(deliveryRate)}
              className="h-2"
            />
            
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs">
              <span className="text-green-600 flex items-center gap-1">
                <IconCircleCheck className="h-3 w-3" />
                <span>Sent: {announcement.deliveryStats.sent}</span>
              </span>
              <span className="text-red-600 flex items-center gap-1">
                <IconAlertCircle className="h-3 w-3" />
                <span>Failed: {announcement.deliveryStats.failed}</span>
              </span>
              {announcement.deliveryStats.pending > 0 && (
                <span className="text-orange-600 flex items-center gap-1">
                  <IconClock className="h-3 w-3" />
                  <span>Pending: {announcement.deliveryStats.pending}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Created By */}
        {announcement.createdBy && (
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground pt-2 border-t">
            <IconUser className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Created by:</span>
            <span className="font-medium text-foreground break-all">
              {announcement.createdBy.name || announcement.createdBy.email}
            </span>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
            <IconClock className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            <span>Processing announcement...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
