'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import NotificationItem from './NotificationItem';
import NotificationPreferences from './NotificationPreferences';
import { NotificationCategory } from './notificationData';
import { IconBell, IconCheck, IconExternalLink, IconFilter2, IconInbox, IconSettings2, IconTrash, IconDotsVertical, IconChecks } from '@tabler/icons-react';

export default function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAsUnread,
  onMarkAllAsRead,
  onArchive,
  onUnarchive,
  onDelete,
  onClearAll,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [filterCategory, setFilterCategory] = useState(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Filter out archived notifications by default
  const activeNotifications = notifications.filter((n) => !n.isArchived);
  const unreadCount = activeNotifications.filter((n) => !n.isRead).length;

  // Filter notifications based on active tab and category filter
  const filteredNotifications = activeNotifications.filter((notification) => {
    if (activeTab === 'unread' && notification.isRead) return false;
    if (filterCategory && notification.category !== filterCategory) return false;
    return true;
  });

  const categories = Object.values(NotificationCategory).map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: activeNotifications.filter((n) => n.category === cat).length,
  }));

  return (
    <>
      <div className="flex flex-col h-full w-full px-2">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconBell className="h-5 w-5" />
              <h3 className="font-semibold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Filter Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <IconFilter2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setFilterCategory(null)}
                    className={!filterCategory ? 'bg-accent' : ''}
                  >
                    All Categories
                    <Badge variant="secondary" className="ml-auto">
                      {activeNotifications.length}
                    </Badge>
                  </DropdownMenuItem>
                  {categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat.value}
                      onClick={() => setFilterCategory(cat.value)}
                      className={filterCategory === cat.value ? 'bg-accent' : ''}
                    >
                      {cat.label}
                      <Badge variant="secondary" className="ml-auto">
                        {cat.count}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPreferencesOpen(true)}
              >
                <IconSettings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center justify-between gap-2">
            {/* Custom Tabs */}
            <div className="inline-flex items-center rounded-lg bg-muted p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-all',
                  activeTab === 'all'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                All
                <span className="ml-1.5 text-xs">{activeNotifications.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-all',
                  activeTab === 'unread'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Unread
                <span className="ml-1.5 text-xs">{unreadCount}</span>
              </button>
            </div>

            {/* Actions Dropdown */}
            {activeNotifications.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <IconDotsVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {unreadCount > 0 && (
                    <DropdownMenuItem onClick={onMarkAllAsRead}>
                      <IconChecks className="mr-2 h-4 w-4" />
                      Mark all as read
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={onClearAll}
                    className="text-destructive focus:text-destructive"
                  >
                    <IconTrash className="mr-2 h-4 w-4" />
                    Clear all
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="h-105 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="rounded-full bg-muted p-4 mb-3">
                  <IconInbox className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {activeTab === 'unread'
                    ? 'No unread notifications'
                    : 'No notifications'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeTab === 'unread'
                    ? "You're all caught up!"
                    : 'New notifications will appear here'}
                </p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-105">
              <div className="divide-y divide-border">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onMarkAsUnread={onMarkAsUnread}
                    onArchive={onArchive}
                    onDelete={onDelete}
                    onClose={onClose}
                    variant="dropdown"
                  />
                ))}
              </div>
            </ScrollArea>
          )}

        </div>

        {/* Footer */}
        {activeNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3">
              <Button
                variant="ghost"
                className="w-full justify-between"
                asChild
                onClick={onClose}
              >
                <Link href="/notifications">
                  View all notifications
                  <IconExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Preferences Dialog */}
      <NotificationPreferences
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
      />
    </>
  );
}
