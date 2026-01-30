"use client";

import { FullPageLoader } from "@/components/ui/full-page-loader";
import { useOrgStore } from "@/store/orgStore";
import ExistingOrg from "./components/ExistingOrg";

function Layout({ children }) {
    const { organization, loading } = useOrgStore();

    if (loading) {
        return <FullPageLoader />
    }

    if (organization) {
        return <ExistingOrg />
    }

    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    )
}

export default Layout