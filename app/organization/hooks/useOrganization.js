'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

export const useOrganization = () => {
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganizationData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/org/me");
      if (response.data.success) {
        setOrgData(response.data.org);
      } else {
        throw new Error('Failed to fetch organization data');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch organization data';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching org data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrganizationData = () => {
    fetchOrganizationData();
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  return {
    orgData,
    loading,
    error,
    refreshOrganizationData
  };
};
