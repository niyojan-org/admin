/**
 * Generate dummy revenue data for the last 30 days
 * This should be replaced with actual API call
 */
export const generateRevenueData = () => {
    const data = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        // Generate realistic revenue data (higher on weekends)
        const isWeekend = date.getDay() === 0 || date.getDay() === 6
        const baseRevenue = isWeekend ? 3000 : 2000
        const variance = Math.random() * 1500

        data.push({
            date: date.toISOString().split('T')[0],
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            revenue: Math.round(baseRevenue + variance),
            fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })
    }

    return data
}

/**
 * Format revenue data from API response
 * @param {Array} apiData - Raw data from backend API
 * @returns {Array} Formatted data for chart
 */
export const formatRevenueData = (apiData) => {
    return apiData.map(item => {
        const date = new Date(item.date)
        return {
            date: item.date,
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            revenue: item.revenue,
            fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }
    })
}
