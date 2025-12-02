"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Area, ComposedChart, ResponsiveContainer, Dot } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

function RevenueChart({ remoteData = null }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use remoteData when provided
  useEffect(() => {
    if (remoteData && Array.isArray(remoteData)) {
      setChartData(remoteData);
      setLoading(false);
    } else {
      // If remoteData is explicitly null/undefined, stop loading and show no-data
      setChartData([]);
      setLoading(false);
    }
  }, [remoteData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse w-full">
          <div className="flex justify-between mb-4">
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-100 rounded flex items-end justify-between px-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-t"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  // No remote data -> show message
  if (!remoteData || !Array.isArray(remoteData) || remoteData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="p-0">
      <div className="px-2 sm:p-6">
        <div className="w-full max-w-full min-w-0 h-[300px] overflow-hidden">
          <ChartContainer 
            config={{ 
              revenue: { 
                label: "Revenue", 
                color: "hsl(var(--chart-1))" 
              } 
            }} 
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={chartData} 
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  minTickGap={32}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
                    return `₹${value}`;
                  }}
                />
                
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[180px] border-2 shadow-lg backdrop-blur-sm"
                      nameKey="revenue"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                      formatter={(value) => [
                        `₹${Number(value).toLocaleString('en-IN', { 
                          minimumFractionDigits: 0, 
                          maximumFractionDigits: 0 
                        })}`,
                        "Revenue"
                      ]}
                    />
                  }
                  cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="none"
                  fill="url(#colorRevenue)"
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={({ cx, cy, payload, index }) => {
                    const isMax = chartData.reduce((max, item) => 
                      item.revenue > max ? item.revenue : max, 0) === payload.revenue;
                    const isMin = chartData.reduce((min, item) => 
                      item.revenue < min ? item.revenue : min, Infinity) === payload.revenue;
                    
                    if (isMax || isMin) {
                      return (
                        <Dot
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill="hsl(var(--chart-1))"
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        />
                      );
                    }
                    return (
                      <Dot
                        cx={cx}
                        cy={cy}
                        r={3}
                        fill="hsl(var(--chart-1))"
                        stroke="transparent"
                        strokeWidth={0}
                      />
                    );
                  }}
                  activeDot={{
                    r: 6,
                    fill: "hsl(var(--chart-1))",
                    stroke: "hsl(var(--background))",
                    strokeWidth: 3,
                  }}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;
