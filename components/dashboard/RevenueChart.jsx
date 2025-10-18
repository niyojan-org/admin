"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
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
        <ChartContainer config={{ revenue: { label: "Revenue", color: "var(--chart-1)" } }} className="aspect-auto h-[250px] w-full">
          <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="revenue"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

export default RevenueChart;
