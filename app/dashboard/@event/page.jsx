"use client"
import useSWR from 'swr'
import { fetcher } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EventCarousel } from './components/EventCarousel'
import { EventCard } from './components/EventCard'
import { EmptyEvents } from './components/EmptyEvents'
import { IconRefresh } from '@tabler/icons-react'

export default function Page() {
  const { data, error, mutate, isValidating, isLoading } = useSWR('/organization/dashboard/events', fetcher, {
    refreshInterval: 180000,
    revalidateOnFocus: true
  })

  // console.log(data);

  const events = data?.data;
  const loading = isLoading || !data && !error

  const handleRefresh = async () => {
    await mutate();
  }


  return (
    <Card className="flex flex-col h-full border-0 gap-0 p-2 sm:px-2">

      {loading && (
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <IconRefresh className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Loading events...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-red-600 mb-2">Failed to load events</p>
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && events.length === 0 && <EmptyEvents />}

      {!loading && !error && events.length === 1 && (
        <EventCard event={events[0]} />
      )}

      {!loading && !error && events.length > 1 && (
        <EventCarousel events={events} />
      )}
      {/* <EventCarousel events={events} /> */}

    </Card>
  )
}
