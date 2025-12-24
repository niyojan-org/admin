// Utility functions for referral data processing

export function processReferrals(referrals, searchQuery, statusFilter, sortBy) {
    return referrals
        .filter(referral => {
            // Search filter
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const matchesCode = referral.code?.toLowerCase().includes(searchLower);
                const matchesUser = referral.whose?.name?.toLowerCase().includes(searchLower) ||
                    referral.whose?.email?.toLowerCase().includes(searchLower);
                if (!matchesCode && !matchesUser) return false;
            }

            // Status filter
            if (statusFilter === 'active') return referral.isActive;
            if (statusFilter === 'inactive') return !referral.isActive;
            if (statusFilter === 'expired') {
                return referral.expiresAt && new Date(referral.expiresAt) < new Date();
            }

            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'usage':
                    return (b.usageCount || 0) - (a.usageCount || 0);
                case 'code':
                    return a.code.localeCompare(b.code);
                default:
                    return 0;
            }
        });
}

export function paginateData(data, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
    
    return {
        data: paginatedData,
        totalPages,
        startIndex,
        totalItems: data.length
    };
}
