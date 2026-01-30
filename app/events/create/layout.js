"use client";
import { useOrgStore } from '@/store/orgStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import EventCreationNotAllowed from './components/EventCreationNotAllowed';

export default function Layout({ children }) {
  const { organization } = useOrgStore();

  if (!organization?.allowsEventCreation) {
    return (
      <ProtectedRoute>
        <EventCreationNotAllowed />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
