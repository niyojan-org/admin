"use client";

import { FullPageLoader } from "@/components/ui/full-page-loader";
import { useOrgStore } from "@/store/orgStore";
import ExistingOrg from "./components/ExistingOrg";
import ProtectedRoute from "@/components/ProtectedRoute";

function Layout({ children }) {
  const { organization, loading } = useOrgStore();

  if (loading) {
    return <FullPageLoader />;
  }

  if (organization) {
    return <ExistingOrg />;
  }

  return (
    <ProtectedRoute requireOrganization={false}>{children}</ProtectedRoute>
  );
}

export default Layout;
