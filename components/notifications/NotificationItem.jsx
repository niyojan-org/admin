'use client';
import Link from 'next/link';
import {
  Bell,
  Calendar,
  CreditCard,
  Lock,
  Building2,
  Ticket,
  Users,
  Trash2,
  ExternalLink,
  Archive,
  MailOpen,
  Mail,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  formatTimeAgo,
  NotificationType,
} from './notificationData';

const typeIcons = {
  [NotificationType.SYSTEM]: Bell,
  [NotificationType.EVENT]: Calendar,
  [NotificationType.TICKET]: Ticket,
  [NotificationType.ORGANIZATION]: Building2,
  [NotificationType.PAYMENT]: CreditCard,
  [NotificationType.SECURITY]: Lock,
  [NotificationType.SOCIAL]: Users,
};

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onDelete,
  onClose,
  variant = 'dropdown', // 'dropdown' or 'full'
}) {
  const Icon = typeIcons[notification.type] || Bell;

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onMarkAsRead(notification.id);
    onClose && onClose();
  };

  const handleMarkAsUnread = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onMarkAsUnread && onMarkAsUnread(notification.id);
    onClose && onClose();
  };

  const handleArchive = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onArchive && onArchive(notification.id);
    onClose && onClose();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(notification.id);
    onClose && onClose();
  };

  return (
    <div
      className={cn(
        'group relative flex gap-2.5 p-2.5 transition-colors',
        !notification.isRead && 'bg-primary/5',
        variant === 'dropdown' && 'hover:bg-accent/50',
        variant === 'full' && 'border border-border rounded-lg'
      )}
    >
      {/* Icon or Avatar */}
      <div className="shrink-0">
        {notification.imageUrl ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={notification.imageUrl} alt={notification.title} />
            <AvatarFallback>
              <Icon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div
            className={cn(
              'h-8 w-8 rounded-full flex items-center justify-center',
              notification.isRead ? 'bg-muted' : 'bg-primary/10'
            )}
          >
            <Icon
              className={cn(
                'h-4 w-4',
                notification.isRead ? 'text-muted-foreground' : 'text-primary'
              )}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <p
                  className={cn(
                    'text-sm font-medium leading-tight truncate',
                    notification.isRead
                      ? 'text-muted-foreground'
                      : 'text-foreground'
                  )}
                >
                  {notification.title}
                </p>
                {!notification.isRead && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                )}
              </div>
              {/* Quick Actions */}
              <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                {/* Mark as read/unread toggle */}
                {!notification.isRead ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleMarkAsRead}
                    title="Mark as read"
                  >
                    <MailOpen className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  onMarkAsUnread && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={handleMarkAsUnread}
                      title="Mark as unread"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                  )
                )}

                {/* Archive */}
                {onArchive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleArchive}
                    title="Archive"
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                )}

                {/* More Options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!notification.isRead ? (
                      <DropdownMenuItem onClick={handleMarkAsRead}>
                        <MailOpen className="mr-2 h-4 w-4" />
                        Mark as read
                      </DropdownMenuItem>
                    ) : (
                      onMarkAsUnread && (
                        <DropdownMenuItem onClick={handleMarkAsUnread}>
                          <Mail className="mr-2 h-4 w-4" />
                          Mark as unread
                        </DropdownMenuItem>
                      )
                    )}
                    {onArchive && (
                      <DropdownMenuItem onClick={handleArchive}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    )}
                    {notification.actionUrl && (
                      <DropdownMenuItem asChild>
                        <Link href={notification.actionUrl}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {notification.actionText || 'View'}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-0.5">
              {notification.message}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(notification.createdAt)}
              </span>
              {notification.actionUrl && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  asChild
                >
                  <Link href={notification.actionUrl} onClick={(e) => { e.stopPropagation(); onClose && onClose(); }}>
                    {notification.actionText || 'View'}
                    <ExternalLink className="ml-0.5 h-2.5 w-2.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
