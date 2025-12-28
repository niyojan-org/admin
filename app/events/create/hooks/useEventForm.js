"use client";
import { useState } from "react";
import { toast } from "sonner";

export const useEventForm = () => {
    // Form data state
    const [eventData, setEventData] = useState({
        // Basic Details
        title: "",
        description: "",
        bannerImage: "",
        tags: [],
        category: "",
        mode: "offline",
        type: "",

        // Registration Details
        registrationStart: "",
        registrationEnd: "",

        // Sessions
        sessions: [
            {
                title: "",
                description: "",
                startTime: "",
                endTime: "",
                venue: {
                    name: "",
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    zipCode: ""
                }
            }
        ],

        // Tickets
        tickets: [
            {
                type: "Regular",
                price: 0,
                capacity: 50,
                templateUrl: ""
            }
        ],

        // Custom Input Fields
        inputFields: [],

        // Event Settings
        isPrivate: false,
        allowMultipleSessions: true,
        allowCoupons: true,
        autoApproveParticipants: true,
        enableEmailNotifications: true,
        enableSmsNotifications: false,
        feedbackEnabled: true
    });

    // Handle basic input changes
    const handleInputChange = (field, value) => {
        setEventData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle sessions
    const addSession = () => {
        setEventData(prev => ({
            ...prev,
            sessions: [...prev.sessions, {
                title: "",
                description: "",
                startTime: "",
                endTime: "",
                venue: {
                    name: "",
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    zipCode: ""
                }
            }]
        }));
    };

    const updateSession = (index, field, value) => {
        setEventData(prev => ({
            ...prev,
            sessions: prev.sessions.map((session, i) =>
                i === index ? { ...session, [field]: value } : session
            )
        }));
    };

    const updateSessionVenue = (sessionIndex, field, value) => {
        setEventData(prev => ({
            ...prev,
            sessions: prev.sessions.map((session, i) =>
                i === sessionIndex ? {
                    ...session,
                    venue: { ...session.venue, [field]: value }
                } : session
            )
        }));
    };

    const removeSession = (index) => {
        if (eventData.sessions.length > 1) {
            setEventData(prev => ({
                ...prev,
                sessions: prev.sessions.filter((_, i) => i !== index)
            }));
        }
    };

    // Handle tickets
    const addTicket = () => {
        setEventData(prev => ({
            ...prev,
            tickets: [...prev.tickets, {
                type: "Regular",
                price: 0,
                capacity: 50,
                templateUrl: ""
            }]
        }));
    };

    const updateTicket = (index, field, value) => {
        setEventData(prev => ({
            ...prev,
            tickets: prev.tickets.map((ticket, i) =>
                i === index ? { ...ticket, [field]: value } : ticket
            )
        }));
    };

    const removeTicket = (index) => {
        if (eventData.tickets.length > 1) {
            setEventData(prev => ({
                ...prev,
                tickets: prev.tickets.filter((_, i) => i !== index)
            }));
        }
    };

    // Handle custom input fields
    const addInputField = () => {
        setEventData(prev => ({
            ...prev,
            inputFields: [...prev.inputFields, {
                label: "",
                name: "",
                type: "text",
                required: false,
                options: []
            }]
        }));
    };

    const updateInputField = (index, field, value) => {
        setEventData(prev => ({
            ...prev,
            inputFields: prev.inputFields.map((inputField, i) =>
                i === index ? { ...inputField, [field]: value } : inputField
            )
        }));
    };

    const addFieldOption = (fieldIndex, option) => {
        if (option.trim()) {
            setEventData(prev => ({
                ...prev,
                inputFields: prev.inputFields.map((field, i) =>
                    i === fieldIndex ? {
                        ...field,
                        options: [...(field.options || []), option.trim()]
                    } : field
                )
            }));
        }
    };

    const removeFieldOption = (fieldIndex, optionIndex) => {
        setEventData(prev => ({
            ...prev,
            inputFields: prev.inputFields.map((field, i) =>
                i === fieldIndex ? {
                    ...field,
                    options: field.options.filter((_, oi) => oi !== optionIndex)
                } : field
            )
        }));
    };

    const removeInputField = (index) => {
        setEventData(prev => ({
            ...prev,
            inputFields: prev.inputFields.filter((_, i) => i !== index)
        }));
    };

    // Validation functions
    const validateBasicDetails = () => {
        if (!eventData.title.trim()) {
            toast.error("Event title is required");
            return false;
        }
        if (!eventData.description.trim()) {
            toast.error("Event description is required");
            return false;
        }

        return true;
    };

    const validateRegistration = () => {
        if (!eventData.registrationStart) {
            toast.error("Registration start date is required");
            return false;
        }
        if (!eventData.registrationEnd) {
            toast.error("Registration end date is required");
            return false;
        }
        if (new Date(eventData.registrationStart) >= new Date(eventData.registrationEnd)) {
            toast.error("Registration end date must be after start date");
            return false;
        }
        if (!eventData.category) {
            toast.error("Event category is required");
            return false;
        }
        if (!eventData.type) {
            toast.error("Event type is required");
            return false;
        }
        return true;
    };

    const validateSessions = () => {
        for (let i = 0; i < eventData.sessions.length; i++) {
            const session = eventData.sessions[i];
            if (!session.title.trim()) {
                toast.error(`Session ${i + 1} title is required`);
                return false;
            }
            if (!session.startTime) {
                toast.error(`Session ${i + 1} start time is required`);
                return false;
            }
            if (!session.endTime) {
                toast.error(`Session ${i + 1} end time is required`);
                return false;
            }
            if (new Date(session.startTime) >= new Date(session.endTime)) {
                toast.error(`Session ${i + 1} end time must be after start time`);
                return false;
            }
            
            // Validate venue details for offline and hybrid events
            if (eventData.mode === "offline" || eventData.mode === "hybrid") {
                if (!session.venue?.name?.trim()) {
                    toast.error(`Session ${i + 1} venue name is required for ${eventData.mode} events`);
                    return false;
                }
                if (!session.venue?.address?.trim()) {
                    toast.error(`Session ${i + 1} venue address is required for ${eventData.mode} events`);
                    return false;
                }
                if (!session.venue?.city?.trim()) {
                    toast.error(`Session ${i + 1} venue city is required for ${eventData.mode} events`);
                    return false;
                }
                if (!session.venue?.state?.trim()) {
                    toast.error(`Session ${i + 1} venue state is required for ${eventData.mode} events`);
                    return false;
                }
                if (!session.venue?.country?.trim()) {
                    toast.error(`Session ${i + 1} venue country is required for ${eventData.mode} events`);
                    return false;
                }
            }
        }
        return true;
    };

    const validateTickets = () => {
        for (let i = 0; i < eventData.tickets.length; i++) {
            const ticket = eventData.tickets[i];
            if (!ticket.type.trim()) {
                toast.error(`Ticket ${i + 1} type is required`);
                return false;
            }
            if (ticket.capacity <= 0) {
                toast.error(`Ticket ${i + 1} capacity must be greater than 0`);
                return false;
            }
        }
        return true;
    };

    return {
        eventData,
        setEventData,
        handleInputChange,
        // Session methods
        addSession,
        updateSession,
        updateSessionVenue,
        removeSession,
        // Ticket methods
        addTicket,
        updateTicket,
        removeTicket,
        // Input field methods
        addInputField,
        updateInputField,
        addFieldOption,
        removeFieldOption,
        removeInputField,
        // Validation methods
        validateBasicDetails,
        validateRegistration,
        validateSessions,
        validateTickets
    };
};
