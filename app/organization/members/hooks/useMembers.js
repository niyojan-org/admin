import { useState, useCallback } from 'react';
import api from '@/lib/api';

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await api.get(`/org/members?${params.toString()}`);
      
      if (response.data.status === 'success') {
        setMembers(response.data.data.members || []);
        setSummary(response.data.data.summary || null);
        setPagination(response.data.data.pagination || null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch members');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch members');
      setMembers([]);
      setSummary(null);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMember = useCallback(async (memberData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/org/members', memberData);
      
      if (response.data.status === 'success') {
        // Refetch members to get updated list
        await fetchMembers();
        return response.data.newMember;
      } else {
        throw new Error(response.data.message || 'Failed to add member');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add member';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchMembers]);

  const updateMemberRole = useCallback(async (memberId, newRole) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/org/members/${memberId}`, { newRole });
      
      if (response.data.status === 'success') {
        // Update local state
        setMembers(prevMembers => 
          prevMembers.map(member => 
            member._id === memberId 
              ? { ...member, organization: { ...member.organization, role: newRole } }
              : member
          )
        );
        return response.data.data.member;
      } else {
        throw new Error(response.data.message || 'Failed to update member role');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update member role';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeMember = useCallback(async (memberId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/org/members/${memberId}`);
      
      if (response.data.status === 'success') {
        // Update local state
        setMembers(prevMembers => prevMembers.filter(member => member._id !== memberId));
        return response.data.data.removedMember;
      } else {
        throw new Error(response.data.message || 'Failed to remove member');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to remove member';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const resendInvitation = useCallback(async (memberId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/org/members/${memberId}/resend-invitation`);
      
      if (response.data.status === 'success') {
        return response.data.data.member;
      } else {
        throw new Error(response.data.message || 'Failed to resend invitation');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to resend invitation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelInvitation = useCallback(async (memberId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/org/members/${memberId}/cancel-invitation`);
      
      if (response.data.status === 'success') {
        // Update local state
        setMembers(prevMembers => prevMembers.filter(member => member._id !== memberId));
        return response.data.cancelledMember;
      } else {
        throw new Error(response.data.message || 'Failed to cancel invitation');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to cancel invitation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMemberById = useCallback(async (memberId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/org/members/${memberId}`);
      
      if (response.data.status === 'success') {
        return response.data.data.member;
      } else {
        throw new Error(response.data.message || 'Failed to get member details');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to get member details';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailableMembers = useCallback(async (search = '') => {
    try {
      setLoading(true);
      setError(null);

      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await api.get(`/org/members/available${params}`);
      
      if (response.data.status === 'success') {
        return response.data.data.members;
      } else {
        throw new Error(response.data.message || 'Failed to get available members');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to get available members';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    members,
    summary,
    pagination,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMemberRole,
    removeMember,
    resendInvitation,
    cancelInvitation,
    getMemberById,
    getAvailableMembers
  };
};
