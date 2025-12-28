// Guest speaker validation utilities

export const validateGuestSpeaker = (speaker) => {
    const errors = [];

    if (!speaker.name?.trim()) {
        errors.push('Speaker name is required');
    }

    if (speaker.name && speaker.name.trim().length < 2) {
        errors.push('Speaker name must be at least 2 characters long');
    }

    if (speaker.socialLinks) {
        for (const [platform, url] of Object.entries(speaker.socialLinks)) {
            if (url && (!url.startsWith('http://') && !url.startsWith('https://'))) {
                errors.push(`${platform} link must start with http:// or https://`);
            }
            if (url && !validateSocialPlatform(platform, url)) {
                errors.push(`Invalid ${platform} URL format`);
            }
        }
    }

    if (speaker.photoUrl && speaker.photoUrl.trim() && !isValidUrl(speaker.photoUrl)) {
        errors.push('Photo URL must be a valid URL');
    }

    return errors;
};

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Supported social platforms
export const socialPlatforms = [
    'instagram',
    'youtube', 
    'twitter',
    'facebook',
    'linkedin',
    'tiktok',
    'website'
];

// Get platform icon color
export const getPlatformColor = (platform) => {
    const colors = {
        instagram: '#E4405F',
        youtube: '#FF0000',
        twitter: '#1DA1F2',
        facebook: '#4267B2',
        linkedin: '#0077B5',
        tiktok: '#000000',
        website: '#6B7280'
    };
    return colors[platform] || '#6B7280';
};

// Platform URL validators
export const validateSocialPlatform = (platform, url) => {
    const validators = {
        instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
        linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
        twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/,
        facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/,
        youtube: /^https?:\/\/(www\.)?youtube\.com\/.+/,
        tiktok: /^https?:\/\/(www\.)?tiktok\.com\/.+/,
        website: /^https?:\/\/.+\..+/,
    };

    return validators[platform]?.test(url) || /^https?:\/\/.+/.test(url);
};

// Format speaker name for display
export const formatSpeakerName = (name) => {
    if (!name) return '';
    return name.trim().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
};

// Truncate bio for preview
export const truncateBio = (bio, maxLength = 100) => {
    if (!bio) return '';
    if (bio.length <= maxLength) return bio;
    return bio.substring(0, maxLength).trim() + '...';
};

// Get initials from speaker name
export const getInitials = (name) => {
    if (!name) return 'SP';
    const words = name.trim().split(' ');
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase();
};

// Validate speaker data for duplicate checking
export const isSpeakerDuplicate = (newSpeaker, existingSpeakers, excludeId = null) => {
    const normalizedNewName = newSpeaker.name?.toLowerCase().trim();
    if (!normalizedNewName) return false;

    return existingSpeakers.some(speaker => {
        if (excludeId && speaker._id === excludeId) return false;
        return speaker.name?.toLowerCase().trim() === normalizedNewName;
    });
};

// Check if social platform URL is already used by another speaker
export const isSocialLinkDuplicate = (platform, url, allSpeakers, excludeSpeakerId = null) => {
    if (!url) return false;
    const normalizedUrl = url.toLowerCase().trim();

    return allSpeakers.some(speaker => {
        if (excludeSpeakerId && speaker._id === excludeSpeakerId) return false;
        const speakerUrl = speaker.socialLinks?.[platform]?.toLowerCase().trim();
        return speakerUrl === normalizedUrl;
    });
};

// Get speaker statistics
export const getSpeakerStats = (speakers) => {
    const stats = {
        total: speakers.length,
        withBio: 0,
        withPhoto: 0,
        withSocialLinks: 0,
        totalSocialLinks: 0,
        platformDistribution: {}
    };

    speakers.forEach(speaker => {
        if (speaker.bio?.trim()) stats.withBio++;
        if (speaker.photoUrl?.trim()) stats.withPhoto++;
        
        const socialLinks = speaker.socialLinks || {};
        const linkCount = Object.keys(socialLinks).length;
        
        if (linkCount > 0) {
            stats.withSocialLinks++;
            stats.totalSocialLinks += linkCount;
            
            Object.keys(socialLinks).forEach(platform => {
                stats.platformDistribution[platform] = (stats.platformDistribution[platform] || 0) + 1;
            });
        }
    });

    return stats;
};

// Export speaker data for backup/migration
export const exportSpeakerData = (speakers) => {
    return {
        exportDate: new Date().toISOString(),
        version: '1.0',
        count: speakers.length,
        speakers: speakers.map(speaker => ({
            name: speaker.name,
            bio: speaker.bio,
            photoUrl: speaker.photoUrl,
            socialLinks: speaker.socialLinks,
            createdAt: speaker.createdAt,
            updatedAt: speaker.updatedAt
        }))
    };
};

// Validate imported speaker data
export const validateImportedSpeakers = (importedData) => {
    const errors = [];
    
    if (!importedData || !Array.isArray(importedData.speakers)) {
        errors.push('Invalid import format');
        return errors;
    }

    importedData.speakers.forEach((speaker, index) => {
        const speakerErrors = validateGuestSpeaker(speaker);
        if (speakerErrors.length > 0) {
            errors.push(`Speaker ${index + 1}: ${speakerErrors.join(', ')}`);
        }
    });

    return errors;
};
