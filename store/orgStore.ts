import { createClientApi } from '@/lib/client-api';
import { toast } from 'sonner';
import { create } from 'zustand';

// Accept searchParams as an argument to setToken
export const useOrgStore = create((set) => ({
  organization: null,
  loading: false,
  error: null,
  isInfoComplete: true,
  isVerified: true,

  fetchOrganization: async () => {
    set({ loading: true, error: null }); // Set loading true at start
    try {
      const api = createClientApi();
      const res = await api.get('/organizations/admin');
      const organization = res.data.organization;
      let isInfoComplete = true;
      const isVerified = true;
      // Check if steps are completed
      if (organization.verified === true) {
        isInfoComplete = true;
      } else {
        isInfoComplete = false;
      }

      set({
        organization,
        isInfoComplete,
        isVerified,
        loading: false, // Set loading false on success
        error: null,
      });
      return organization;
    } catch (error) {
      console.log(error);
      const msg = error?.response?.data?.message || 'Failed to fetch organization data';
      toast.error(msg);
      set({
        loading: false, // Set loading false on error
        error: msg,
      });
    }
  },

  setOrganization: (organization) => set({ organization }),
}));
