"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

function RevenueChart({ timeRange = "30days" }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        // Mock data based on time range
        const generateMockData = (range) => {
          const data = [];
          let days = 30;
          if (range === "7days") days = 7;
          else if (range === "90days") days = 90;
          else if (range === "1year") days = 365;

          for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
              date: date.toISOString().split("T")[0],
              revenue: Math.floor(Math.random() * 5000) + 1000,
            });
          }
          return data;
        };

        const mockData = generateMockData(timeRange);
        setTimeout(() => {
          setChartData(mockData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      }
    };

    fetchChartData();
  }, [timeRange]);

  if (loading) {
    return (
      <Card className="h-80 flex items-center justify-center">
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
      </Card>
    );
  }

  if (!mounted) {
    return null;
  }

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Revenue Chart</CardTitle>
          <CardDescription>
            Showing total revenue for the selected period
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">Total Revenue</span>
            <span className="text-lg leading-none font-bold sm:text-3xl">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
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
      </CardContent>
    </Card>
  );
}

export default RevenueChart;
