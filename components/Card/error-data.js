import {
    IconExclamationCircle,
    IconLock,
    IconCalendarOff,
    IconWifi,
    IconShieldX,
    IconServerOff,
    IconCalendarCheck,
    IconTicketOff
} from "@tabler/icons-react";

/**
 * Error configuration mapping
 * Each error code maps to an object with:
 * - icon: The Tabler icon component to display
 * - title: Main error title
 * - message: Primary error message (can be overridden by error.message)
 * - details: Additional details or help text (can be overridden by error.error.details)
 * - color: Color theme ("destructive" or "warning")
 */
export const errorConfigs = {
    REGISTRATION_CLOSED: {
        icon: IconLock,
        title: "Registration Closed",
        message: "Registration is currently closed for this event",
        details: "The registration period has ended. Please contact the organizer for more information.",
        color: "warning"
    },

    PARTICIPANT_EXISTS: {
        icon: IconExclamationCircle,
        title: "Participant Exists",
        message: "Your registration with this email already exists for this event",
        details: "If you believe this is an error, please contact support.",
        color: "warning"
    },

    PARTICIPANT_CONFIRMED: {
        icon: IconCalendarCheck,
        title: "Already Registered",
        message: "You are already registered for this event",
        details: "If you have not received your ticket, please try logging in to our platform with the same email.",
        color: "warning"
    },

    PARTICIPANT_PENDING: {
        icon: IconCalendarCheck,
        title: "Registration Pending",
        message: "Your registration is pending",
        details: "Please complete the payment to confirm your registration.",
        color: "warning"
    },

    PARTICIPANT_CANCELLED: {
        icon: IconCalendarOff,
        title: "Registration Cancelled",
        message: "Your registration has been cancelled",
        details: "If this is a mistake, please contact the event organizer for assistance via our platform.",
        color: "destructive"
    },

    TICKET_SOLD_OUT: {
        icon: IconTicketOff,
        title: "Ticket Sold Out",
        message: "The selected ticket is sold out",
        details: "Please select a different ticket or check back later.",
        color: "destructive"
    },

    EVENT_NOT_FOUND: {
        icon: IconCalendarOff,
        title: "Event Not Found",
        message: "The event you're looking for doesn't exist",
        details: "Please check the event URL or browse our available events.",
        color: "destructive"
    },

    NETWORK_ERROR: {
        icon: IconWifi,
        title: "Network Error",
        message: "Unable to connect to the server",
        details: "Please check your internet connection and try again.",
        color: "warning"
    },

    ERR_NETWORK: {
        icon: IconWifi,
        title: "Network Error",
        message: "Unable to connect to the server",
        details: "Please check your internet connection and try again.",
        color: "warning"
    },

    UNAUTHORIZED: {
        icon: IconShieldX,
        title: "Unauthorized",
        message: "You don't have permission to access this resource",
        details: "Please log in or contact support if you believe this is an error.",
        color: "warning"
    },

    TOKEN_REQUIRED: {
        icon: IconShieldX,
        title: "Access Denied",
        message: "Access denied. Token required.",
        details: "Please log in to access this resource.",
        color: "warning"
    },

    SERVER_ERROR: {
        icon: IconServerOff,
        title: "Server Error",
        message: "Something went wrong on our end",
        details: "Our team has been notified. Please try again in a few minutes.",
        color: "destructive"
    },
    TOKEN_EMAIL_MISSING: {
        icon: IconLock,
        title: "Invalid Link",
        message: "The password reset link is invalid or missing required information",
        details: "Please request a new password reset link.",
        color: "warning"
    }
};

/**
 * HTTP status code error configurations
 */
export const statusCodeConfigs = {
    401: {
        icon: IconShieldX,
        title: "Unauthorized",
        message: "You don't have permission to access this resource",
        details: "Please log in or contact support if you believe this is an error.",
        color: "warning"
    },

    404: {
        icon: IconCalendarOff,
        title: "Not Found",
        message: "The requested resource was not found",
        details: "Please check the URL or go back to the previous page.",
        color: "warning"
    },

    500: {
        icon: IconServerOff,
        title: "Server Error",
        message: "Something went wrong on our end",
        details: "Our team has been notified. Please try again in a few minutes.",
        color: "destructive"
    }
};

/**
 * Default error configuration for unknown errors
 */
export const defaultErrorConfig = {
    icon: IconExclamationCircle,
    title: "Something Went Wrong",
    message: "An unexpected error occurred",
    details: "Please try refreshing the page or contact support if the issue persists.",
    color: "destructive"
};

/**
 * Size configuration for the error card
 */
export const sizeClasses = {
    sm: {
        container: "max-w-sm",
        icon: "w-12 h-12",
        iconContainer: "w-12 h-12",
        title: "text-lg",
        message: "text-sm",
        details: "text-xs"
    },
    md: {
        container: "max-w-md",
        icon: "w-8 h-8",
        iconContainer: "w-16 h-16",
        title: "text-xl",
        message: "text-base",
        details: "text-sm"
    },
    lg: {
        container: "max-w-lg",
        icon: "w-10 h-10",
        iconContainer: "w-20 h-20",
        title: "text-2xl",
        message: "text-lg",
        details: "text-base"
    }
};

/**
 * Color theme classes for error types
 */
export const colorClasses = {
    destructive: {
        bg: "bg-destructive/10",
        border: "border-destructive/20",
        icon: "text-destructive",
        title: "text-destructive"
    },
    warning: {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        icon: "text-yellow-600",
        title: "text-yellow-700"
    }
};
