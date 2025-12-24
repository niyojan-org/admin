'use client'
import { IconShare } from '@tabler/icons-react';

export function ReferralEmptyState({ 
    searchQuery, 
    statusFilter, 
    userRole,
    systemEnabled = false,
    hasAccessDenied = false
}) {
    const hasFilters = searchQuery || statusFilter !== 'all';
    
    // Determine the appropriate message based on context
    const getEmptyStateMessage = () => {
        if (hasFilters) {
            return {
                title: 'No referrals match your filters',
                description: 'Try adjusting your search terms or filters to find referrals'
            };
        }

        if (hasAccessDenied) {
            return {
                title: 'Access restricted',
                description: 'You don\'t have permission to view referrals for this event'
            };
        }

        if (!systemEnabled) {
            return {
                title: 'Referral system is disabled',
                description: userRole === 'volunteer' 
                    ? 'The referral system is currently disabled for this event'
                    : 'Enable the referral system to start creating referral codes'
            };
        }

        if (userRole === 'volunteer') {
            return {
                title: 'No referral codes assigned to you',
                description: 'Contact your admin to get a referral code for tracking referrals'
            };
        }

        return {
            title: 'No referral codes created yet',
            description: 'Create your first referral code to start tracking participant referrals'
        };
    };

    const { title, description } = getEmptyStateMessage();
    
    return (
        <div className="text-center py-12 px-4 text-muted-foreground">
            <IconShare className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
                {title}
            </p>
            <p className="text-sm max-w-md mx-auto">
                {description}
            </p>
        </div>
    );
}

export default ReferralEmptyState;
