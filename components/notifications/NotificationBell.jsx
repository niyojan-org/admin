'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import NotificationDropdown from './NotificationDropdown';
import { IconBell } from '@tabler/icons-react';
import { useNotificationStore } from '@/store/notificationStore';
import useNotificationSocket from '@/hooks/useNotificationSocket';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        archiveNotification,
        deleteNotification,
        fetchNotifications,
    } = useNotificationStore();

    // Initialize WebSocket connection for real-time notifications
    useNotificationSocket();

    // Fetch notifications on mount
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id) => {
        await markAsRead(id);
    };

    const handleMarkAsUnread = (id) => {
        // Not implementing mark as unread for now
        console.log('Mark as unread not implemented');
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    const handleArchive = async (id) => {
        await archiveNotification(id);
    };

    const handleUnarchive = (id) => {
        // Not implementing unarchive for now
        console.log('Unarchive not implemented');
    };

    const handleDelete = (id) => {
        deleteNotification(id);
    };

    const handleClearAll = () => {
        // Clear all from store
        useNotificationStore.getState().clearAll();
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-lg shadow-none size-8 relative"
                    aria-label="Open Notifications"
                >
                    <IconBell className={`h-5 w-5`} />
                    {unreadCount > 0 && (
                        <div
                            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-sm font-semibold bg-destructive/70 text-destructive-foreground rounded-sm"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="max-w-105 p-0 sm:w-full rounded-t-none w-sm"
                sideOffset={10}
            >
                <NotificationDropdown
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAsUnread={handleMarkAsUnread}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onArchive={handleArchive}
                    onUnarchive={handleUnarchive}
                    onDelete={handleDelete}
                    onClearAll={handleClearAll}
                    onClose={() => setIsOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
}
