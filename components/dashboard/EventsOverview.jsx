"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "../ui/progress";

export default function EventsOverview() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventsOverview = async () => {
      try {
        // Mock data - replace with actual API call
        const mockEvents = [
          {
            id: 1,
            name: "Tech Conference 2024",
            registrations: 245,
            capacity: 300,
            revenue: 61250,
          },
          {
            id: 2,
            name: "Startup Networking Event",
            registrations: 150,
            capacity: 200,
            revenue: 22500,
          },
          {
            id: 3,
            name: "Digital Marketing Workshop",
            registrations: 89,
            capacity: 100,
            revenue: 17800,
          },
          {
            id: 4,
            name: "AI & ML Summit",
            registrations: 320,
            capacity: 400,
            revenue: 128000,
          },
        ];

        setTimeout(() => {
          setEvents(mockEvents);
          setLoading(false);
        }, 700);
      } catch (error) {
        console.error("Error fetching events overview:", error);
        setLoading(false);
      }
    };

    fetchEventsOverview();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="w-48 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-32 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="w-20 h-3 bg-gray-200 rounded"></div>
              <div className="w-24 h-8 bg-gray-200 rounded ml-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-orange-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getOccupancyTextColor = (percentage) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-orange-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const occupancyPercentage = Math.round((event.registrations / event.capacity) * 100);

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate pr-4">{event.name}</h3>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <span>Registrations: </span>
                    <span
                      className={`ml-1 font-medium ${getOccupancyTextColor(occupancyPercentage)}`}
                    >
                      {event.registrations}/{event.capacity}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Revenue:{" "}
                    <span className="font-medium text-gray-900">
                      ₹{event.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Progress Bar */}
                <Progress className="w-24 lg:w-64" value={occupancyPercentage} />

                {/* Percentage */}
                <div className="text-sm font-medium text-gray-900 w-12 text-right">
                  {occupancyPercentage}%
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
