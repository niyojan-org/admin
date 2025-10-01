'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Link from 'next/link';
import { 
  IconCalendarEvent, IconUsers, IconMapPin, IconDots,
  IconEdit, IconEye, IconTrash, IconCopy
} from '@tabler/icons-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function RecentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        // Mock data - replace with actual API call
        const mockEvents = [
          {
            id: 1,
            title: 'Tech Conference 2024',
            date: new Date('2024-08-15'),
            location: 'Mumbai, India',
            registrations: 245,
            maxCapacity: 300,
            status: 'upcoming',
            revenue: 61250,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
          },
          {
            id: 2,
            title: 'Startup Networking Event',
            date: new Date('2024-08-10'),
            location: 'Bangalore, India',
            registrations: 150,
            maxCapacity: 200,
            status: 'active',
            revenue: 22500,
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400'
          },
          {
            id: 3,
            title: 'Digital Marketing Workshop',
            date: new Date('2024-07-28'),
            location: 'Delhi, India',
            registrations: 89,
            maxCapacity: 100,
            status: 'completed',
            revenue: 17800,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400'
          },
          {
            id: 4,
            title: 'AI & Machine Learning Summit',
            date: new Date('2024-09-05'),
            location: 'Hyderabad, India',
            registrations: 320,
            maxCapacity: 400,
            status: 'upcoming',
            revenue: 128000,
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'
          },
          {
            id: 5,
            title: 'Web Development Bootcamp',
            date: new Date('2024-08-20'),
            location: 'Pune, India',
            registrations: 76,
            maxCapacity: 120,
            status: 'upcoming',
            revenue: 38000,
            image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400'
          }
        ];
        
        setTimeout(() => {
          setEvents(mockEvents);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.upcoming;
  };

  const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Events</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-1/2 h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="w-1/4 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Events</h2>
        <Link href="/dashboard/events">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
            View All Events
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const occupancyPercentage = Math.round((event.registrations / event.maxCapacity) * 100);
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-300">
                {/* Event Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
                      {event.title}
                    </h3>
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <IconCalendarEvent className="h-3 w-3 mr-1" />
                      {format(event.date, 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <IconMapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <IconUsers className="h-3 w-3 mr-1" />
                        <span className={getOccupancyColor(occupancyPercentage)}>
                          {event.registrations}/{event.maxCapacity}
                        </span>
                        <span className="ml-1">({occupancyPercentage}%)</span>
                      </div>
                      <div className="text-xs font-medium text-gray-900">
                        ₹{event.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <IconDots className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <IconEye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconEdit className="h-4 w-4 mr-2" />
                        Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconCopy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <IconTrash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {events.length === 0 && !loading && (
        <div className="text-center py-12">
          <IconCalendarEvent className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first event.</p>
          <Link href="/dashboard/events/create">
            <Button>
              <IconPlus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
