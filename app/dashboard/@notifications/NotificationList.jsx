import { ScrollArea } from "@/components/ui/scroll-area"
import { NotificationCard } from "./NotificationCard"

export function NotificationList({ notifications }) {
    return (
        <ScrollArea className="h-full">
            <div className="space-y-1.5 pr-3">
                {notifications.map((notification) => (
                    <NotificationCard 
                        key={notification.id} 
                        notification={notification}
                    />
                ))}
            </div>
        </ScrollArea>
    )
}
