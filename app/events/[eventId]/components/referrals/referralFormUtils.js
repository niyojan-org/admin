// Debounce utility
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Code generation utility
export const generateSecureCode = (length = 8) => {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const allChars = upperCase + numbers;

    let result = '';
    // Ensure at least one uppercase and one number
    result += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));

    // Fill the rest randomly
    for (let i = 2; i < length; i++) {
        result += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the result
    return result.split('').sort(() => Math.random() - 0.5).join('');
};

// Validation rules
export const validationRules = {
    code: {
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[A-Z0-9!@#$%^&*]+$/,
        message: 'Code must contain only uppercase letters, numbers, and special characters'
    },
    maxUsage: {
        required: true,
        min: 1,
        max: 10000
    },
    whose: {
        required: true
    }
};

// Field name mappings for better error messages
const fieldNameMap = {
    code: 'Referral code',
    maxUsage: 'Maximum usage',
    whose: 'User assignment',
    expiresAt: 'Expiry date'
};

// Validation functions
export const validateField = (fieldName, value) => {
    const rule = validationRules[fieldName];
    if (!rule) return null;

    if (rule.required && (!value || value.toString().trim() === '')) {
        const displayName = fieldNameMap[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        return `${displayName} is required`;
    }

    if (fieldName === 'code') {
        if (value.length < rule.minLength) {
            return `Code must be at least ${rule.minLength} characters`;
        }
        if (value.length > rule.maxLength) {
            return `Code cannot exceed ${rule.maxLength} characters`;
        }
        if (!rule.pattern.test(value)) {
            return rule.message;
        }
    }

    if (fieldName === 'maxUsage') {
        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue < rule.min) {
            return `Maximum usage must be at least ${rule.min}`;
        }
        if (numValue > rule.max) {
            return `Maximum usage cannot exceed ${rule.max}`;
        }
    }

    if (fieldName === 'expiresAt' && value) {
        const expiryDate = new Date(value);
        if (expiryDate <= new Date()) {
            return 'Expiry date must be in the future';
        }
    }

    return null;
};

export const validateForm = (formData) => {
    const newErrors = {};

    Object.keys(validationRules).forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
    });

    if (formData.expiresAt) {
        const error = validateField('expiresAt', formData.expiresAt);
        if (error) newErrors.expiresAt = error;
    }

    return newErrors;
};
