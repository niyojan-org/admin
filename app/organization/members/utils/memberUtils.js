/**
 * Utility functions for member management
 */

/**
 * Get user initials from name
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date and time for display
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get badge variant for member role
 */
export const getRoleBadgeVariant = (role) => {
  const variants = {
    owner: 'destructive',
    admin: 'default',
    manager: 'secondary',
    member: 'outline',
    volunteer: 'outline'
  };
  return variants[role] || 'outline';
};

/**
 * Get badge variant for member status
 */
export const getStatusBadgeVariant = (status) => {
  const variants = {
    active: 'default',
    pending: 'secondary',
    inactive: 'outline'
  };
  return variants[status] || 'outline';
};

/**
 * Get role hierarchy level for permission checks
 */
export const getRoleLevel = (role) => {
  const levels = {
    owner: 5,
    admin: 4,
    manager: 3,
    member: 2,
    volunteer: 1
  };
  return levels[role] || 0;
};

/**
 * Check if user can manage another member
 */
export const canManageMember = (currentUserRole, targetMemberRole) => {
  const currentLevel = getRoleLevel(currentUserRole);
  const targetLevel = getRoleLevel(targetMemberRole);
  
  // Owner can manage everyone except other owners
  if (currentUserRole === 'owner' && targetMemberRole !== 'owner') {
    return true;
  }
  
  // Admin can manage members below their level
  if (currentUserRole === 'admin' && targetLevel < getRoleLevel('admin')) {
    return true;
  }
  
  return false;
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (basic validation)
 */
export const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Generate random color for avatar placeholder
 */
export const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Filter members by search query
 */
export const filterMembersBySearch = (members, searchQuery) => {
  if (!searchQuery) return members;
  
  const query = searchQuery.toLowerCase();
  return members.filter(member => 
    member.name?.toLowerCase().includes(query) ||
    member.email?.toLowerCase().includes(query) ||
    member.phone_number?.toLowerCase().includes(query)
  );
};

/**
 * Sort members by field
 */
export const sortMembers = (members, sortBy, order = 'asc') => {
  return [...members].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
        break;
      case 'email':
        aValue = a.email?.toLowerCase() || '';
        bValue = b.email?.toLowerCase() || '';
        break;
      case 'organization.role':
        aValue = getRoleLevel(a.organization?.role);
        bValue = getRoleLevel(b.organization?.role);
        break;
      case 'organization.status':
        aValue = a.organization?.status || '';
        bValue = b.organization?.status || '';
        break;
      case 'isVerified':
        aValue = a.isVerified ? 1 : 0;
        bValue = b.isVerified ? 1 : 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Calculate member statistics
 */
export const calculateMemberStats = (members) => {
  const stats = {
    total: members.length,
    verified: 0,
    unverified: 0,
    roles: {
      owner: 0,
      admin: 0,
      manager: 0,
      member: 0,
      volunteer: 0
    },
    status: {
      active: 0,
      pending: 0,
      inactive: 0
    },
    gender: {
      male: 0,
      female: 0,
      other: 0,
      not_specified: 0
    }
  };
  
  members.forEach(member => {
    // Verification stats
    if (member.isVerified) {
      stats.verified++;
    } else {
      stats.unverified++;
    }
    
    // Role stats
    const role = member.organization?.role;
    if (role && stats.roles.hasOwnProperty(role)) {
      stats.roles[role]++;
    }
    
    // Status stats
    const status = member.organization?.status;
    if (status && stats.status.hasOwnProperty(status)) {
      stats.status[status]++;
    }
    
    // Gender stats
    const gender = member.gender || 'not_specified';
    if (stats.gender.hasOwnProperty(gender)) {
      stats.gender[gender]++;
    } else {
      stats.gender.not_specified++;
    }
  });
  
  return stats;
};

/**
 * Export members to CSV format
 */
export const exportToCSV = (members, filename = 'members.csv') => {
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Role',
    'Status',
    'Verified',
    'Gender',
    'Join Date'
  ];
  
  const rows = members.map(member => [
    member.name || '',
    member.email || '',
    member.phone_number || '',
    member.organization?.role || '',
    member.organization?.status || '',
    member.isVerified ? 'Yes' : 'No',
    member.gender || '',
    formatDate(member.organization?.joinedAt || member.createdAt)
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
