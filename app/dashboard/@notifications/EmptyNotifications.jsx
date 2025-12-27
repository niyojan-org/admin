import { BellOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyNotifications() {
    return (
        <Card className="h-full flex items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <BellOff className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium mb-1">No notifications</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                    You're all caught up!
                </p>
            </CardContent>
        </Card>
    )
}
