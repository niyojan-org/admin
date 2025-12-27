"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { RevenueHeader } from "./RevenueHeader"
import { RevenueChart } from "./RevenueChart"
import useSWR from 'swr'
import { fetcher } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconInfoCircle } from "@tabler/icons-react"
import { CardContent, CardHeader } from "@/components/ui/card"

// Helper to convert paisa to rupees
const paisaToRupees = (paisa) => paisa / 100

function Revenue() {
    const [selectedDays, setSelectedDays] = useState("auto")
    const [isMobile, setIsMobile] = useState(false)

    // Fetch revenue data using SWR
    const { data, error, isLoading } = useSWR('/organization/dashboard/revenue', fetcher, {
        refreshInterval: 300000, // Refresh every 5 minutes
        revalidateOnFocus: true
    })

    const revenueData = data?.data || []
    const meta = data?.meta

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const daysToShow = useMemo(() => {
        if (selectedDays === "auto") {
            return isMobile ? 7 : 15
        }
        return parseInt(selectedDays)
    }, [selectedDays, isMobile])

    // Transform API data to chart format
    const chartData = useMemo(() => {
        if (!revenueData.length) return []
        
        return revenueData
            .slice(-daysToShow)
            .map(item => ({
                date: item.date,
                fullDate: new Date(item.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                }),
                revenue: paisaToRupees(item.revenue) // Convert paisa to rupees
            }))
    }, [revenueData, daysToShow])

    if (isLoading) {
        return (
            <Card className="h-full flex flex-col border-0 sm:px-3">
                <CardHeader className="shrink-0">
                    <Skeleton className="h-7 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="flex-1">
                    <Skeleton className="w-full h-full" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="h-full flex flex-col border-0 sm:px-3">
                <CardHeader className="shrink-0">
                    <Skeleton className="h-7 w-32" />
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <Alert variant="destructive">
                        <IconInfoCircle className="h-4 w-4" />
                        <AlertDescription>
                            Failed to load revenue data. Please try again later.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    if (!chartData.length) {
        return (
            <Card className="h-full flex flex-col border-0 sm:px-3">
                <RevenueHeader 
                    daysToShow={daysToShow}
                    selectedDays={selectedDays}
                    setSelectedDays={setSelectedDays}
                    isMobile={isMobile}
                    totalRevenue={0}
                    meta={meta}
                />
                <CardContent className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <p>No revenue data available yet.</p>
                        <p className="text-sm mt-2">Start creating events to track revenue.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full flex flex-col border-0 sm:px-3">
            <RevenueHeader 
                daysToShow={daysToShow}
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
                isMobile={isMobile}
                totalRevenue={meta ? paisaToRupees(meta.totalRevenue) : 0}
                averageRevenue={meta ? paisaToRupees(meta.averageRevenue) : 0}
                meta={meta}
            />
            <RevenueChart chartData={chartData} />
        </Card>
    )
}

export default Revenue
