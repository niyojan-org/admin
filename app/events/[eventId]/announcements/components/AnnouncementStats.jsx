import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IconSpeakerphone, IconUsers, IconCircleCheck, IconClock } from '@tabler/icons-react';


/**
 * Display announcement statistics overview
 */
export const AnnouncementStats = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        {
            title: 'Total Announcements',
            value: stats.total || 0,
            icon: <IconSpeakerphone className="h-6 w-6 text-primary" />,
            description: 'All time',
            colorClass: 'text-primary',
        },
        {
            title: 'Participants Reached',
            value: stats.totalParticipantsReached || 0,
            icon: <IconUsers className="h-6 w-6 text-blue-600" />,
            description: 'Successfully delivered',
            colorClass: 'text-blue-600',
        },
        {
            title: 'Success Rate',
            value: stats.totalParticipantsTargeted > 0
                ? `${((stats.totalParticipantsReached / stats.totalParticipantsTargeted) * 100).toFixed(1)}%`
                : '0%',
            icon: <IconCircleCheck className="h-6 w-6 text-green-600" />,
            description: 'Overall delivery rate',
            colorClass: 'text-green-600',
        },
        {
            title: 'Active',
            value: (stats.pending || 0) + (stats.processing || 0),
            icon: <IconClock className="h-6 w-6 text-orange-600" />,
            description: 'Pending & processing',
            colorClass: 'text-orange-600',
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow gap-0 p-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        {stat.icon}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stat.colorClass}`}>{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
