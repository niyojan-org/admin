import { formatFullTimeline } from "./timelineFormate";

const normalizeDynamicFields = (fields) => {
    const out = {};
    for (const [key, val] of Object.entries(fields || {})) {
        out[key] = Array.isArray(val) ? val.join(", ") : val ?? "";
    }
    return out;
};

export const validateFormData = (formData, registrationForm) => {
    const errors = {};
    const allFields = [
        ...(registrationForm?.defaultFields || []),
        ...(registrationForm?.customFields || []),
    ];

    let firstErrorField = null;

    allFields.forEach((field) => {
        if (field.required) {
            const value = formData[field.name];

            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[field.name] = `${field.label} is required`;
                if (!firstErrorField) {
                    firstErrorField = field.name;
                }
            }
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        firstErrorField,
    };
};

export const prepareRegistrationPayload = (formData, ticketId, registrationForm, couponCode) => {
    const defaultFieldNames = registrationForm?.defaultFields?.map(f => f.name) || ['name', 'email', 'phone'];
    const customFieldNames = registrationForm?.customFields?.map(f => f.name) || [];

    const payload = {
        ticketId
    };

    // Add default fields
    defaultFieldNames.forEach(fieldName => {
        if (formData[fieldName]) {
            payload[fieldName] = formData[fieldName];
        }
    });

    // Add optional codes
    if (formData.referralCode) {
        payload.referralCode = formData.referralCode;
    }
    if (couponCode) {
        payload.couponCode = couponCode;
    }

    // Add custom fields as dynamicFields
    const dynamicFields = {};
    customFieldNames.forEach(fieldName => {
        if (formData[fieldName] !== undefined && formData[fieldName] !== null) {
            dynamicFields[fieldName] = formData[fieldName];
        }
    });

    if (Object.keys(dynamicFields).length > 0) {
        payload.dynamicFields = normalizeDynamicFields(dynamicFields);
    }

    return payload;
};

export const GetSuccessData = (data) => {
    if (!data || !data.data) return null;

    const participants = Array.isArray(data.data) ? data.data : [data.data];
    const event = data.event || {};
    const isGroup = participants.length > 1;
    
    const firstParticipant = participants[0];
    const ticketInfo = firstParticipant?.ticket || {};

    return {
        registrationId: firstParticipant?._id || "",
        message: data.message || "",
        eventName: event?.title || "",
        eventDate: event?.sessions ? formatFullTimeline(event.sessions) : "",
        eventLocation: (event?.sessions?.[0]?.venue?.name || "") + (event?.sessions?.[0]?.venue?.address ? " " + event.sessions[0].venue.address : "") || "Venue TBD",
        ticketType: ticketInfo?.type || "",
        ticketPrice: ticketInfo?.price || 0,
        isPaid: (ticketInfo?.price || 0) > 0,
        isGroup: isGroup,
        groupName: firstParticipant?.groupInfo?.groupName || "",
        participants: participants.map(p => ({
            name: p.name || "",
            email: p.email || "",
            phone: p.phone || "",
            isLeader: p.isGroupLeader || false,
        })),
        participantCount: participants.length,
        totalAmount: 0,
        qrCode: "",
        eventSlug: event?.slug || "",
    };
}

export const prepareGroupRegistrationPayload = (groupData, ticketId, registrationForm, couponCode) => {
    const DATA = {
        groupName: groupData.groupName,
        groupLeader: groupData.leader,
        groupMembers: groupData.groupMembers,
        ticketId,
        couponCode
    }
    return DATA;
}

export const sortTickets = (tickets) => {
    return tickets.map(ticket => {
        const soldPercentage = (ticket.sold / ticket.capacity) * 100;
        let badge = null;
        if (soldPercentage >= 40 && ticket.capacity >= 50) {
            badge = 'best';
        } else if (soldPercentage >= 25 && ticket.capacity >= 50) {
            badge = 'interesting';
        }
        return {
            ...ticket,
            soldPercentage: Math.round(soldPercentage),
            badge
        };
    }).sort((a, b) => {
        const badgePriority = { 'best': 3, 'interesting': 2, null: 1 };
        const priorityDiff = (badgePriority[b.badge] || 0) - (badgePriority[a.badge] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        return a.price - b.price;
    });
};

export { normalizeDynamicFields };