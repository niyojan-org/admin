"use client"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

function Gauge({ sold = 0, total = 100 }) {
    const percentage = total > 0 ? (sold / total) * 100 : 0

    const chartData = [{ value: sold }]

    const chartConfig = {
        value: {
            label: "Sold",
            color: "var(--chart-1)",
        },
    }

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[90px] p-0"
        >
            <RadialBarChart
                data={chartData}
                startAngle={90}
                endAngle={90 - (percentage * 360) / 100}
                innerRadius="60%"
                outerRadius="90%"
                width={60}
                height={60}
            >
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) - 4}
                                            className="fill-foreground text-xs font-bold"
                                        >
                                            {sold}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 8}
                                            className="fill-muted-foreground text-[8px]"
                                        >
                                            /{total}
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </PolarRadiusAxis>
                <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill="var(--color-value)"
                    className="stroke-transparent stroke-2"
                />
            </RadialBarChart>
        </ChartContainer>
    )
}

export default Gauge