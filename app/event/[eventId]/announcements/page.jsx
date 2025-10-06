'use client'
import { useEffect, useState } from 'react'
import AnnouncementManagement from './AnnouncementManagement'
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

const page = () => {
    const [eventId, setEventId] = useState(null);
    const params = useParams();
    useEffect(() => {
        const eventId = params.eventId;
        if (eventId) {
            setEventId(eventId);
        } else {
            toast.error("Event ID is missing in the URL");
        }
    }, [params.eventId]);

    if (!eventId) {
        return null;
    }

    return (
        <AnnouncementManagement eventId={eventId} />
    )
}

export default page