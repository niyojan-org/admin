import { create } from 'zustand';
import type { OrganizationData } from '@/types/organizations/organization-data';

type OrgState = {
  organization: OrganizationData | null;
  setOrganization: (organization: OrganizationData | null) => void;
};

export const useOrgStore = create<OrgState>((set) => ({
  organization: null,
  setOrganization: (organization) => set({ organization }),
}));
