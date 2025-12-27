import {
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IconCalendar, IconCashPlus } from "@tabler/icons-react"

export function RevenueHeader({ daysToShow, selectedDays, setSelectedDays, isMobile, totalRevenue, averageRevenue, meta }) {
    return (
        <CardHeader className="shrink-0">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                        <IconCashPlus className="h-5 w-5" />
                        Revenue
                    </CardTitle>
                    <CardDescription>
                        Last {daysToShow} days performance
                    </CardDescription>
                    {meta && (
                        <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                            <span>Total: ₹{totalRevenue?.toLocaleString() || 0}</span>
                            <span>Avg: ₹{averageRevenue?.toLocaleString() || 0}/day</span>
                        </div>
                    )}
                </div>
                <Select value={selectedDays} onValueChange={setSelectedDays}>
                    <SelectTrigger className="h-8 text-xs font-semibold">
                        <IconCalendar className="h-3 w-3 mr-1 font-semibold" stroke={2} />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="auto">Auto ({isMobile ? '7' : '15'} days)</SelectItem>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="15">Last 15 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
    )
}
