'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  IconUsers, IconCalendarEvent, IconCreditCard, IconChartPie,
} from '@tabler/icons-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RecentRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentRegistrations = async () => {
      try {
        // Mock data - replace with actual API call
        const mockRegistrations = [
          {
            id: 1,
            name: 'John Doe',
            event: 'Tech Conference 2024',
            date: new Date('2024-08-14'),
            amount: 1500,
            email: 'john.doe@example.com',
            status: 'confirmed'
          },
          {
            id: 2,
            name: 'Jane Smith',
            event: 'Startup Networking Event',
            date: new Date('2024-08-09'),
            amount: 750,
            email: 'jane.smith@example.com',
            status: 'pending'
          },
          {
            id: 3,
            name: 'Michael Johnson',
            event: 'Digital Marketing Workshop',
            date: new Date('2024-07-27'),
            amount: 500,
            email: 'michael.j@example.com',
            status: 'confirmed'
          }
        ];
        
        setTimeout(() => {
          setRegistrations(mockRegistrations);
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error('Error fetching registrations:', error);
        setLoading(false);
      }
    };

    fetchRecentRegistrations();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Registrations</h2>
          <Link href="/dashboard/users">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">View All</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Registrations</h2>
        <Link href="/dashboard/users">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">View All</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {registrations.map((registration, index) => (
          <motion.div
            key={registration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <IconUsers className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{registration.name}</h3>
                  <span className={`text-xs font-semibold ${registration.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500">
                  <div className="flex items-center">
                    <IconCalendarEvent className="h-3 w-3 mr-1" />
                    {registration.event}
                  </div>
                  <div className="flex items-center">
                    <IconCreditCard className="h-3 w-3 mr-1" />
                    ₹{registration.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
