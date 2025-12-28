import { Bell, Calendar, Users, AlertCircle, CheckCircle, Info, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const notificationIcons = {
    event: Calendar,
    registration: Users,
    alert: AlertCircle,
    success: CheckCircle,
    info: Info,
    revenue: TrendingUp,
    general: Bell
}

const notificationStyles = {
    event: {
        icon: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950/30",
        border: "border-blue-200 dark:border-blue-800"
    },
    registration: {
        icon: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-950/30",
        border: "border-purple-200 dark:border-purple-800"
    },
    alert: {
        icon: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-800"
    },
    success: {
        icon: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-950/30",
        border: "border-green-200 dark:border-green-800"
    },
    info: {
        icon: "text-cyan-600 dark:text-cyan-400",
        bg: "bg-cyan-50 dark:bg-cyan-950/30",
        border: "border-cyan-200 dark:border-cyan-800"
    },
    revenue: {
        icon: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-800"
    },
    general: {
        icon: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-50 dark:bg-gray-950/30",
        border: "border-gray-200 dark:border-gray-800"
    }
}

export function NotificationCard({ notification }) {
    const { type = 'general', title, message, time, isRead, priority } = notification
    const Icon = notificationIcons[type] || Bell
    const styles = notificationStyles[type] || notificationStyles.general

    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInMs = now - date
        const diffInMins = Math.floor(diffInMs / 60000)
        const diffInHours = Math.floor(diffInMs / 3600000)
        const diffInDays = Math.floor(diffInMs / 86400000)

        if (diffInMins < 1) return 'Just now'
        if (diffInMins < 60) return `${diffInMins}m ago`
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInDays < 7) return `${diffInDays}d ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <div className={cn(
            "flex gap-2.5 p-2.5 transition-colors border-0 hover:bg-accent/50 cursor-pointer",
            !isRead ? "bg-accent/20 border-l-2 border-l-primary" : " border-b"
        )}>
            {/* Icon */}
            <div className={cn(
                "shrink-0 h-7 w-7 rounded-md flex items-center justify-center",
                styles.bg
            )}>
                <Icon className={cn("h-3.5 w-3.5", styles.icon)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className={cn(
                        "text-xs font-medium line-clamp-1",
                        !isRead ? "text-foreground" : "text-muted-foreground"
                    )}>
                        {title}
                    </h4>
                    <div className="flex items-center gap-1.5 shrink-0">
                        {priority === 'high' && (
                            <Badge variant="destructive" className="p-0 px-2">
                                !
                            </Badge>
                        )}
                        {!isRead && (
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                        )}
                    </div>
                </div>
                
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                    {message}
                </p>
                
                <span className="text-[10px] text-muted-foreground/70 mt-1 inline-block">
                    {formatTime(time)}
                </span>
            </div>
        </div>
    )
}
