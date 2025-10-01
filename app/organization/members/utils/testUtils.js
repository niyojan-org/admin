/**
 * Test utilities for Member Management System
 */

// Mock data for testing
export const mockMembers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone_number: '+1234567890',
    avatar: 'https://example.com/avatar1.jpg',
    gender: 'male',
    isVerified: true,
    createdAt: '2023-01-15T10:30:00.000Z',
    organization: {
      role: 'admin',
      status: 'active',
      joinedAt: '2023-01-15T10:30:00.000Z'
    }
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone_number: '+1234567891',
    avatar: 'https://example.com/avatar2.jpg',
    gender: 'female',
    isVerified: false,
    createdAt: '2023-02-20T14:20:00.000Z',
    organization: {
      role: 'member',
      status: 'pending',
      joinedAt: null
    }
  },
  {
    _id: '3',
    name: 'Alex Wilson',
    email: 'alex@example.com',
    phone_number: null,
    avatar: null,
    gender: 'other',
    isVerified: true,
    createdAt: '2023-03-10T09:15:00.000Z',
    organization: {
      role: 'volunteer',
      status: 'active',
      joinedAt: '2023-03-10T09:15:00.000Z'
    }
  }
];

export const mockSummary = {
  totalMembers: 3,
  filteredCount: 3,
  roleDistribution: {
    owner: 0,
    admin: 1,
    manager: 0,
    member: 1,
    volunteer: 1
  },
  membershipStats: {
    active: 2,
    pending: 1,
    inactive: 0
  },
  genderDistribution: {
    male: 1,
    female: 1,
    other: 1,
    not_specified: 0
  }
};

export const mockPagination = {
  currentPage: 1,
  totalPages: 1,
  totalMembers: 3,
  membersPerPage: 10,
  hasNextPage: false,
  hasPrevPage: false
};

// Test helpers
export const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiResponse = (data, delay = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          status: 'success',
          message: 'Operation completed successfully',
          data
        }
      });
    }, delay);
  });
};

export const mockApiError = (message = 'An error occurred', delay = 100) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({
        response: {
          data: {
            status: 'error',
            message,
            code: 'TEST_ERROR'
          }
        }
      });
    }, delay);
  });
};

// Form validation helpers
export const validateMemberForm = (formData) => {
  const errors = {};
  
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!formData.orgRole) {
    errors.orgRole = 'Role is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Filter test helpers
export const testFilters = {
  empty: {
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
  },
  withRole: {
    page: 1,
    limit: 10,
    search: '',
    role: 'admin',
    isVerified: null,
    orgMembership: '',
    gender: '',
    sortBy: 'createdAt',
    order: 'desc',
    format: 'paginated'
  },
  withSearch: {
    page: 1,
    limit: 10,
    search: 'john',
    role: '',
    isVerified: null,
    orgMembership: '',
    gender: '',
    sortBy: 'name',
    order: 'asc',
    format: 'paginated'
  }
};

export default {
  mockMembers,
  mockSummary,
  mockPagination,
  waitFor,
  mockApiResponse,
  mockApiError,
  validateMemberForm,
  testFilters
};
