import { Bell, Filter, CheckCheck } from "lucide-react"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationHeader({ 
    unreadCount, 
    filter, 
    setFilter, 
    onMarkAllRead 
}) {
    return (
        <CardHeader className="flex-shrink-0 pb-3">
            <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-1.5 text-base">
                    <Bell className="h-4 w-4" />
                    Notifications
                    {unreadCount > 0 && (
                        <Badge variant="default" className="h-4 px-1.5 text-[10px]">
                            {unreadCount}
                        </Badge>
                    )}
                </CardTitle>
                
                <div className="flex items-center gap-1.5">
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={onMarkAllRead}
                            className="h-7 text-[11px] px-2"
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Mark all
                        </Button>
                    )}
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 text-[11px] px-2">
                                <Filter className="h-3 w-3 mr-1" />
                                {filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : 'Read'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setFilter('all')}>
                                All
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('unread')}>
                                Unread
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('read')}>
                                Read
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </CardHeader>
    )
}
