'use client';

import { useEffect } from 'react';
import { useOrgStore } from '@/store/orgStore';
import type { OrganizationData } from '@/types/organizations/organization-data';

type HydrationProps = {
  organization: OrganizationData;
};

const Hydration = ({ organization }: HydrationProps) => {
  const setOrganization = useOrgStore((state) => state.setOrganization);

  useEffect(() => {
    setOrganization(organization);
  }, [organization, setOrganization]);
  return null;
};

export default Hydration;
