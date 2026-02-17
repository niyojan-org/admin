import NotificationBell from '@/components/notifications/NotificationBell';
import { useUserStore } from '@/store/userStore';

export default function NotificationMenu() {
  const { user, isAuthenticated } = useUserStore();
  
  if (!isAuthenticated && !user) {
    return null;
  }
  
  return <NotificationBell />;
}
