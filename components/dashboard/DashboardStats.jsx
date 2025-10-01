'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IconUsers, IconCalendarEvent, IconCreditCard, IconTrendingUp,
  IconArrowUpRight, IconArrowDownRight
} from '@tabler/icons-react';
import { Card } from '@/components/ui/card';

export default function DashboardStats({ timeRange }) {
  const [stats, setStats] = useState({
    totalEvents: { value: 0, change: 0, trend: 'up' },
    totalRegistrations: { value: 0, change: 0, trend: 'up' },
    totalRevenue: { value: 0, change: 0, trend: 'up' },
    conversionRate: { value: 0, change: 0, trend: 'up' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simulated data - replace with actual API call
        const mockStats = {
          totalEvents: { value: 12, change: 8.2, trend: 'up' },
          totalRegistrations: { value: 1843, change: 12.5, trend: 'up' },
          totalRevenue: { value: 45670, change: -2.1, trend: 'down' },
          conversionRate: { value: 67.8, change: 4.3, trend: 'up' }
        };
        
        setTimeout(() => {
          setStats(mockStats);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  const statItems = [
    {
      title: 'Total Events',
      value: stats.totalEvents.value,
      change: stats.totalEvents.change,
      trend: stats.totalEvents.trend,
      icon: IconCalendarEvent,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations.value.toLocaleString(),
      change: stats.totalRegistrations.change,
      trend: stats.totalRegistrations.trend,
      icon: IconUsers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.value.toLocaleString()}`,
      change: stats.totalRevenue.change,
      trend: stats.totalRevenue.trend,
      icon: IconCreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate.value}%`,
      change: stats.conversionRate.change,
      trend: stats.conversionRate.trend,
      icon: IconTrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-32 h-4 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className={`p-6 border-l-4 ${item.borderColor} hover:shadow-lg transition-shadow duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="flex items-center space-x-1">
                {item.trend === 'up' ? (
                  <IconArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <IconArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(item.change)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
              <p className="text-sm font-medium text-gray-600">{item.title}</p>
              <p className="text-xs text-gray-500">
                {item.trend === 'up' ? 'Increased' : 'Decreased'} from last period
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
