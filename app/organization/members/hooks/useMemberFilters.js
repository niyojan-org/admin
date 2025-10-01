import { useState, useCallback } from 'react';

const initialFilters = {
  page: 1,
  limit: 10,
  search: '',
  role: '',
  isVerified: null,
  orgMembership: '',
  gender: '',
  sortBy: 'createdAt',
  order: 'desc',
  format: 'paginated'
};

export const useMemberFilters = () => {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset page when filters change (except for page and limit changes)
      ...(key !== 'page' && key !== 'limit' ? { page: 1 } : {})
    }));
  }, []);

  const updateMultipleFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset page when multiple filters change
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const applyFilters = useCallback((callback) => {
    if (callback && typeof callback === 'function') {
      callback(filters);
    }
  }, [filters]);

  const getActiveFiltersCount = useCallback(() => {
    return Object.keys(filters).filter(key => {
      const value = filters[key];
      return value !== null && 
             value !== undefined && 
             value !== '' && 
             key !== 'page' && 
             key !== 'limit' && 
             key !== 'sortBy' && 
             key !== 'order' && 
             key !== 'format';
    }).length;
  }, [filters]);

  const hasActiveFilters = useCallback(() => {
    return getActiveFiltersCount() > 0;
  }, [getActiveFiltersCount]);

  const getFilterSummary = useCallback(() => {
    const summary = [];
    
    if (filters.search) {
      summary.push(`Search: "${filters.search}"`);
    }
    
    if (filters.role) {
      summary.push(`Role: ${filters.role}`);
    }
    
    if (filters.isVerified !== null) {
      summary.push(`Verified: ${filters.isVerified ? 'Yes' : 'No'}`);
    }
    
    if (filters.orgMembership) {
      summary.push(`Status: ${filters.orgMembership}`);
    }
    
    if (filters.gender) {
      summary.push(`Gender: ${filters.gender}`);
    }

    return summary;
  }, [filters]);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });

    return params.toString();
  }, [filters]);

  return {
    filters,
    updateFilter,
    updateMultipleFilters,
    resetFilters,
    applyFilters,
    getActiveFiltersCount,
    hasActiveFilters,
    getFilterSummary,
    buildQueryString
  };
};
