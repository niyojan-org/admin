/**
 * Generate dummy event data for demonstration
 * Replace this with actual API call
 */
export const generateDummyEvents = (number) => {
    const events = [
        {
            _id: "evt_001",
            title: "Tech Innovation Summit 2025",
            slug: "tech-innovation-summit-2025",
            description: "Join industry leaders for groundbreaking discussions on AI and Web3",
            bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
            status: "published",
            mode: "hybrid",
            type: "conference",
            category: "Technology",
            sessions: [
                {
                    title: "Keynote Session",
                    startTime: new Date("2025-01-15T09:00:00"),
                    endTime: new Date("2025-01-15T17:00:00"),
                    venue: {
                        name: "Convention Center",
                        city: "Mumbai",
                        state: "Maharashtra",
                        country: "India"
                    }
                },
                {
                    title: "Workshop Day",
                    startTime: new Date("2025-01-16T09:00:00"),
                    endTime: new Date("2025-01-16T17:00:00"),
                    venue: {
                        name: "Convention Center",
                        city: "Mumbai",
                        state: "Maharashtra",
                        country: "India"
                    }
                }
            ],
            tickets: [
                {
                    type: "Early Bird",
                    price: 2500,
                    capacity: 100,
                    sold: 85,
                    isActive: true
                },
                {
                    type: "Regular",
                    price: 3500,
                    capacity: 150,
                    sold: 120,
                    isActive: true
                },
                {
                    type: "VIP",
                    price: 7500,
                    capacity: 50,
                    sold: 35,
                    isActive: true
                },
                {
                    type: "VIP",
                    price: 7500,
                    capacity: 50,
                    sold: 35,
                    isActive: true
                },
                {
                    type: "VIP",
                    price: 7500,
                    capacity: 50,
                    sold: 35,
                    isActive: true
                },
                {
                    type: "VIP",
                    price: 7500,
                    capacity: 50,
                    sold: 35,
                    isActive: true
                }
            ],
            totalRegistrations: 240,
            viewCount: 1250,
            registrationStart: new Date("2024-12-01"),
            registrationEnd: new Date("2025-01-14"),
            isPublished: true,
            isRegistrationOpen: true,
            organization: "org_001"
        },
        {
            _id: "evt_002",
            title: "Annual College Fest 2025",
            slug: "annual-college-fest-2025",
            description: "Three days of music, dance, and cultural celebrations",
            bannerImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
            status: "ongoing",
            mode: "offline",
            type: "festival",
            category: "Cultural",
            sessions: [
                {
                    title: "Day 1 - Music Night",
                    startTime: new Date("2025-12-26T18:00:00"),
                    endTime: new Date("2025-12-26T23:00:00"),
                    venue: {
                        name: "College Auditorium",
                        city: "Bangalore",
                        state: "Karnataka",
                        country: "India"
                    }
                }
            ],
            tickets: [
                {
                    type: "Student Pass",
                    price: 500,
                    capacity: 500,
                    sold: 450,
                    isActive: true
                },
                {
                    type: "General",
                    price: 1000,
                    capacity: 200,
                    sold: 180,
                    isActive: true
                }
            ],
            totalRegistrations: 630,
            viewCount: 3420,
            registrationStart: new Date("2024-11-01"),
            registrationEnd: new Date("2025-12-25"),
            isPublished: true,
            isRegistrationOpen: true,
            organization: "org_001"
        },
        {
            _id: "evt_003",
            title: "Online Workshop: React Masterclass",
            slug: "react-masterclass-2025",
            description: "Learn advanced React patterns from industry experts",
            bannerImage: null,
            status: "published",
            mode: "online",
            type: "workshop",
            category: "Education",
            sessions: [
                {
                    title: "Session 1",
                    startTime: new Date("2025-01-20T10:00:00"),
                    endTime: new Date("2025-01-20T13:00:00"),
                    venue: {
                        name: "Zoom",
                        city: "Online",
                        country: "Global"
                    }
                }
            ],
            tickets: [
                {
                    type: "Standard",
                    price: 999,
                    capacity: 100,
                    sold: 45,
                    isActive: true
                }
            ],
            totalRegistrations: 45,
            viewCount: 890,
            registrationStart: new Date("2024-12-15"),
            registrationEnd: new Date("2025-01-19"),
            isPublished: true,
            isRegistrationOpen: true,
            organization: "org_001"
        }
    ]

    return number ? events.slice(0, number) : events
}

/**
 * Format event data from API response
 * @param {Array} apiData - Raw event data from backend
 * @returns {Array} Formatted events
 */
export const formatEventData = (apiData) => {
    return apiData.map(event => ({
        _id: event._id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        bannerImage: event.bannerImage,
        status: event.status,
        mode: event.mode,
        type: event.type,
        category: event.category,
        sessions: event.sessions,
        tickets: event.tickets,
        totalRegistrations: event.totalRegistrations,
        viewCount: event.viewCount,
        registrationStart: event.registrationStart,
        registrationEnd: event.registrationEnd,
        isPublished: event.isPublished,
        isRegistrationOpen: event.isRegistrationOpen
    }))
}

/**
 * Calculate event metrics
 * @param {Object} event - Event object
 * @returns {Object} Event metrics
 */
export const calculateEventMetrics = (event) => {
    const tickets = event.tickets || []

    const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.sold), 0)
    const totalTicketsSold = tickets.reduce((sum, ticket) => sum + ticket.sold, 0)
    const totalCapacity = tickets.reduce((sum, ticket) => sum + ticket.capacity, 0)
    const isPaidEvent = tickets.some(ticket => ticket.price > 0)
    const salesPercentage = totalCapacity > 0 ? ((totalTicketsSold / totalCapacity) * 100).toFixed(0) : 0

    return {
        totalRevenue,
        totalTicketsSold,
        totalCapacity,
        isPaidEvent,
        salesPercentage
    }
}

/**
 * Get event status color and label
 * @param {string} status - Event status
 * @returns {Object} Status styling
 */
export const getEventStatus = (status) => {
    const statusMap = {
        draft: {
            variant: "secondary",
            label: "Draft"
        },
        published: {
            variant: "default",
            label: "Published"
        },
        ongoing: {
            variant: "default",
            label: "Live"
        },
        completed: {
            variant: "secondary",
            label: "Completed"
        },
        cancelled: {
            variant: "destructive",
            label: "Cancelled"
        }
    }

    return statusMap[status] || statusMap.draft
}
