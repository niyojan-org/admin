"use client"

import React, { useState, useMemo } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconArrowsLeftRight, IconArrowsUpDown } from '@tabler/icons-react'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Page() {
  const { data, error, mutate } = useSWR('/org/dashboard/events/list', fetcher, { refreshInterval: 180000, revalidateOnFocus: true })

  const events = data && data.data ? data.data : []
  const [reversed, setReversed] = useState(false)

  const displayedEvents = useMemo(() => {
    if (!events) return []
    return reversed ? [...events].reverse() : events
  }, [events, reversed])

  const loading = !data && !error

  return (
    <Card className="flex flex-col h-full p-0 py-2 px-2 sm:px-2 gap-0">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xl font-semibold">Events</h2>
        <div>
          <Button size="sm" variant="icon" onClick={() => setReversed((r) => !r)} title="Reverse list">
            <IconArrowsUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading && (
        <Card className="p-4">
          <div>Loading events...</div>
        </Card>
      )}

      {error && (
        <Card className="p-4">
          <div className="text-red-600">Failed to load events</div>
        </Card>
      )}

      {!loading && !error && events.length === 0 && (
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">No events found.</div>
        </Card>
      )}

      <div className="flex-1 min-h-0 h-full">
        <ScrollArea className="h-full w-full" innerClassName="p-0">
          <div className="flex flex-col gap-2 pr-4">
            {displayedEvents.map((ev) => {
              const { _id, title, slug, status, isPublished, registrationStart, registrationEnd, totalRegistrations } = ev
              const showParticipants = ['published', 'ongoing', 'completed'].includes(status)

              // Prefer slug path if available, otherwise use id

              return (
                <div key={_id} className="border-b last:border-0 pb-2">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{title}</h3>
                        <div className="text-sm text-muted-foreground font-bold">Status: <span className="capitalize">{status}</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Registrations</div>
                        <div className="font-semibold">{totalRegistrations ?? 0}</div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <div>Reg start: {registrationStart ? new Date(registrationStart).toLocaleString() : '—'}</div>
                        <div>Reg end: {registrationEnd ? new Date(registrationEnd).toLocaleString() : '—'}</div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {showParticipants ? (
                          <Link href={`/events/${slug}/participants`} className="">
                            <Button size="sm">View Participants</Button>
                          </Link>
                        ) : (
                          <Button size="sm" variant="ghost" disabled>
                            View Participants
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {displayedEvents.length === 0 && (
              <div className="p-4 text-sm text-muted-foreground">
                No events to display.
              </div>
            )}
            {displayedEvents.length > 5 && (
              <div className="p-4 text-sm text-muted-foreground">
                View more events in the Events Management section.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}
