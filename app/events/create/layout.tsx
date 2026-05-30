'use client';
import { useOrgStore } from '@/store/orgStore';
import EventCreationNotAllowed from './components/EventCreationNotAllowed';

export default function Layout({ children }) {
  const { organization } = useOrgStore();
  if (!organization) return null;
  if (!organization.allowsEventCreation) {
    return <EventCreationNotAllowed />;
  }
  return children;
}
