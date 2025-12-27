import { IconCurrencyRupee } from "@tabler/icons-react"

export function RevenueTooltip({ active, payload, chartData }) {
    if (!active || !payload || !payload.length) return null
    
    const data = payload[0].payload
    const revenue = data.revenue
    const average = chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.length
    const percentOfAvg = ((revenue - average) / average * 100)
    const date = new Date(data.date)
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
    
    return (
        <div className="rounded-lg border bg-background p-3 shadow-xl">
            <div className="grid gap-2">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-muted-foreground">{dayOfWeek}</span>
                    <span className="text-xs font-medium">{data.fullDate}</span>
                </div>
                <div className="flex items-center gap-2 border-t pt-2">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-revenue)]" />
                    <span className="text-xs text-muted-foreground">Revenue</span>
                </div>
                <div className="flex items-center gap-1">
                    <IconCurrencyRupee size={20} className="text-foreground" />
                    <span className="text-2xl font-bold">{revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className={`font-medium ${percentOfAvg >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        {percentOfAvg >= 0 ? '+' : ''}{percentOfAvg.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs average</span>
                </div>
            </div>
        </div>
    )
}
