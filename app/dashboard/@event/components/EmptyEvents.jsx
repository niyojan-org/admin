import { CalendarX } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function EmptyEvents() {
    return (
        <Card className="h-full flex items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
                    <CalendarX className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-1">No Events Yet</h3>
                <p className="text-xs text-muted-foreground max-w-xs mb-4">
                    Create your first event to start managing registrations and participants.
                </p>
                <Link href="/events/create">
                    <Button size="sm" className="h-8">
                        Create Event
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
