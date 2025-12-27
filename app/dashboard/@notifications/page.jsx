"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { NotificationHeader } from "./NotificationHeader"
import { NotificationList } from "./NotificationList"
import { EmptyNotifications } from "./EmptyNotifications"
import { generateDummyNotifications, filterNotifications } from "./notificationHelpers"

function Notifications() {
    const [notifications, setNotifications] = useState(generateDummyNotifications())
    const [filter, setFilter] = useState('all')

    const filteredNotifications = useMemo(() => {
        return filterNotifications(notifications, filter)
    }, [notifications, filter])

    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.isRead).length
    }, [notifications])

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    }

    // Show empty state if no notifications
    if (notifications.length === 0) {
        return <EmptyNotifications />
    }

    return (
        <Card className="h-full  flex-col border-0 gap-2 relative hidden">
            <NotificationHeader
                unreadCount={unreadCount}
                filter={filter}
                setFilter={setFilter}
                onMarkAllRead={handleMarkAllRead}
            />

            <CardContent className="flex-1 min-h-0 pb-0 pt-0 px-0">
                {filteredNotifications.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground text-xs">
                            No {filter} notifications
                        </p>
                    </div>
                ) : (
                    <NotificationList notifications={filteredNotifications} />
                )}
            </CardContent>

           
        </Card>
    )
}

export default Notifications
