import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { DollarSign } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
} from "@/components/ui/chart"
import { RevenueTooltip } from "./RevenueTooltip"

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "var(--chart-1)",
    },
}

export function RevenueChart({ chartData }) {
    return (
        <CardContent className="flex-1">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart
                    data={chartData}
                    margin={{
                        left: 0,
                        right: 0,
                        top: 10,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--muted-foreground))"
                        opacity={0.2}
                    />
                    <XAxis
                        dataKey="fullDate"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip
                        content={({ active, payload }) => (
                            <RevenueTooltip 
                                active={active} 
                                payload={payload} 
                                chartData={chartData}
                            />
                        )}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        strokeWidth={1.2}
                        fill="url(#colorRevenue)"
                        fillOpacity={1}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                </AreaChart>
            </ChartContainer>
        </CardContent>
    )
}
