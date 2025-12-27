"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventCard } from './EventCard'
import { cn } from '@/lib/utils'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconCalendar } from '@tabler/icons-react'

export function EventCarousel({ events }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const totalEvents = events.length

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || totalEvents <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalEvents)
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(interval)
    }, [isAutoPlaying, totalEvents])

    const goToSlide = (index) => {
        setIsAutoPlaying(false)
        setCurrentIndex(index)
    }

    if (totalEvents === 0) return null

    return (
        <div className="">
            {/* Indicators */}
            <CardHeader className="shrink-0 flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                    <IconCalendar className="h-4 w-4" />
                    Events
                    {events.length > 0 && (
                        <span className="text-xs font-normal text-muted-foreground">
                            ({events?.length})
                        </span>
                    )}
                </CardTitle>

                <div>
                    {totalEvents > 1 && (
                        <div className="flex justify-center gap-1.5 pt-2 pb-1">
                            {events.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all",
                                        index === currentIndex
                                            ? "w-6 bg-primary"
                                            : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                    )}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </CardHeader>


            {/* Carousel Container */}
            <CardContent className="flex-1 relative overflow-hidden">
                <div
                    className="flex h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {events.map((event, index) => (
                        <div
                            key={event._id || index}
                            className="min-w-full h-full px-1"
                        >
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>

            </CardContent>
        </div>
    )
}
