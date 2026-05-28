// Breadcrumb label mappings
const breadcrumbLabels: Record<string, string> = {
  events: 'Events',
  participants: 'Participants',
  registrations: 'Registrations',
  share: 'Share',
  announcements: 'Announcements',
  checkin: 'Check-in',
  edit: 'Edit Event',
  tickets: 'Tickets',
  sessions: 'Sessions',
  settings: 'Settings',
  users: 'Users',
  reports: 'Reports',
  analytics: 'Analytics',
  dashboard: 'Dashboard',
};

export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive: boolean;
}

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always add home
  breadcrumbs.push({
    label: 'Home',
    href: '/',
    isActive: pathname === '/',
  });

  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Skip dynamic segments like [eventId]
    if (segment.startsWith('[') && segment.endsWith(']')) {
      return;
    }

    const label = breadcrumbLabels[segment] || formatLabel(segment);

    breadcrumbs.push({
      label,
      href: currentPath,
      isActive: isLast,
    });
  });

  return breadcrumbs;
}

function formatLabel(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
