'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  IconBell,
  IconBuilding,
  IconCalendarEvent,
  IconChartBar,
  IconDashboard,
  IconEdit,
  IconHeadset,
  IconHomeCog,
  IconIdBadge2,
  IconMenu2,
  IconPlus,
  IconQrcode,
  IconShare3,
  IconSpeakerphone,
  IconTicket,
  IconUsers,
  IconX,
} from '@tabler/icons-react';

import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useOrgStore } from '@/store/orgStore';
import { useUserStore } from '@/store/userStore';

import NavigationItem from './sidebar/NavigationItem';
import SidebarHeader from './sidebar/SidebarHeader';
import ThemeToggle from './sidebar/ThemeToggle';
import UserProfile from './sidebar/UserProfile';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: IconDashboard,
    href: '/dashboard',
  },
  {
    id: 'events',
    label: 'Events',
    icon: IconCalendarEvent,
    href: '/events',
    badge: { text: '3', variant: 'secondary' },
    children: [
      {
        id: 'all-events',
        label: 'All Events',
        href: '/events',
        icon: IconCalendarEvent,
      },
      {
        id: 'create-event',
        label: 'Create Event',
        href: '/events/create',
        icon: IconPlus,
      },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: IconBell,
    href: '/notifications',
  },
];

const settingsItems = [
  {
    id: 'settings',
    label: 'Organization',
    icon: IconBuilding,
    href: '/organization',
    exact: true,
  },
  {
    id: 'member-management',
    label: 'Members',
    icon: IconHomeCog,
    href: '/organization/members',
  },
  {
    id: 'contact-support',
    label: 'Support',
    icon: IconHeadset,
    href: '/contact',
  },
];

const getEventIdFromPath = (pathname) => {
  const match = pathname.match(/^\/events\/([^/]+)/);
  const eventId = match?.[1];

  if (!eventId || eventId === 'create') return null;
  return eventId;
};

const getEventContextItems = (eventId) => [
  {
    id: 'event-overview',
    label: 'Overview',
    href: `/events/${eventId}`,
    icon: IconChartBar,
    exact: true,
  },
  {
    id: 'event-participants',
    label: 'Participants',
    href: `/events/${eventId}/participants`,
    icon: IconUsers,
  },
  {
    id: 'event-tickets',
    label: 'Tickets',
    href: `/events/${eventId}/tickets`,
    icon: IconTicket,
  },
  {
    id: 'event-sessions',
    label: 'Sessions',
    href: `/events/${eventId}/sessions`,
    icon: IconCalendarEvent,
  },
  {
    id: 'event-registration',
    label: 'Registration',
    href: `/events/${eventId}/registrations`,
    icon: IconIdBadge2,
  },
  {
    id: 'event-share',
    label: 'Share',
    href: `/events/${eventId}/share`,
    icon: IconShare3,
  },
  {
    id: 'event-announcements',
    label: 'Announcements',
    href: `/events/${eventId}/announcements`,
    icon: IconSpeakerphone,
  },
  {
    id: 'event-checkin',
    label: 'Check-in',
    href: `/events/${eventId}/checkin`,
    icon: IconQrcode,
  },
  {
    id: 'event-edit',
    label: 'Edit Event',
    href: `/events/${eventId}/edit`,
    icon: IconEdit,
  },
];

const Divider = () => (
  <div className="py-2">
    <Separator className="my-2" />
  </div>
);

const AppSidebarClient = ({ className }) => {
  const pathname = usePathname();
  const eventId = useMemo(() => getEventIdFromPath(pathname), [pathname]);
  const eventContextItems = useMemo(() => (eventId ? getEventContextItems(eventId) : []), [eventId]);
  const isEventWorkspace = Boolean(eventId);

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const { user, logout } = useUserStore();
  const { organization } = useOrgStore();

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    if (item.href === '/events') {
      return pathname === '/events' || pathname.startsWith('/events/');
    }
    if (item.children) return item.children.some((child) => isActive(child));
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  useEffect(() => {
    setExpandedItems((prev) => ({
      ...prev,
      events: pathname.startsWith('/events'),
    }));
  }, [pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleCollapse = () => setIsCollapsed((current) => !current);
  const toggleExpanded = (itemId) =>
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  const toggleMobileMenu = () => setIsMobileMenuOpen((current) => !current);
  const handleNavigationClick = (isMobile) => {
    if (isMobile) setIsMobileMenuOpen(false);
  };
  const handleLogout = async () => {
    await logout();
  };

  const SidebarContent = ({ isMobile = false }) => {
    const isCompact = isCollapsed && !isMobile;
    const handleItemClick = () => handleNavigationClick(isMobile);

    return (
      <div className="scrollbar-none flex h-full w-full min-w-0 flex-col overflow-hidden bg-card border-r border-border">
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          organization={organization}
          isMobile={isMobile}
        />

        <Separator />

        <nav className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {isEventWorkspace && (
            <>
              {!isCompact && (
                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Event</p>
              )}
              {eventContextItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  isActive={isActive(item)}
                  isCollapsed={isCompact}
                  onItemClick={handleItemClick}
                />
              ))}
              <Divider />
            </>
          )}

          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={isActive(item)}
              isCollapsed={isCompact}
              isExpanded={expandedItems[item.id]}
              onToggleExpanded={() => toggleExpanded(item.id)}
              onItemClick={handleItemClick}
            />
          ))}

          <Divider />

          {settingsItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={isActive(item)}
              isCollapsed={isCompact}
              onItemClick={handleItemClick}
            />
          ))}

          <ThemeToggle isCollapsed={isCompact} />
        </nav>

        <div className="p-4 border-t border-border">
          <UserProfile user={user} organization={organization} isCollapsed={isCompact} onLogout={handleLogout} />
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.div
        className={cn(
          'scrollbar-none hidden lg:flex h-dvh shrink-0 flex-col overflow-visible bg-card sticky top-0 z-40',
          className,
        )}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <TooltipProvider>
          <SidebarContent />
        </TooltipProvider>
      </motion.div>

      <div className="lg:hidden fixed top-0 z-10 bg-card overflow-hidden w-full">
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/icons/icon.png" width={100} height={100} alt="Orgatick" className="h-8 w-8 object-contain" />
            <h2 className="text-xl font-semibold text-foreground truncate">Orgatick</h2>
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            {isMobileMenuOpen ? (
              <IconX className="h-4 w-4 text-foreground" />
            ) : (
              <IconMenu2 className="h-4 w-4 text-foreground" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="scrollbar-none fixed left-0 top-0 h-full w-72 overflow-y-auto bg-card border-r border-border shadow-lg z-50 lg:hidden"
              >
                <SidebarContent isMobile />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AppSidebarClient;
