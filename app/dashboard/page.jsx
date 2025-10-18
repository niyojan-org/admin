"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  IconUsers,
  IconCalendarEvent,
  IconCreditCard,
  IconTrendingUp,
  IconEye,
  IconPlus,
  IconDownload,
  IconSettings,
  IconBell,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentEvents from "@/components/dashboard/RecentEvents";
import QuickActions from "@/components/dashboard/QuickActions";
import RevenueChart from "@/components/dashboard/RevenueChart";
import EventsOverview from "@/components/dashboard/EventsOverview";
import RecentRegistrations from "@/components/dashboard/RecentRegistrations";
import { useOrgStore } from "@/store/orgStore";
import { useUserStore } from "@/store/userStore";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

export default function Dashboard() {
  const { organization, events, loading } = useOrgStore();
  const { user } = useUserStore();
  const [timeRange, setTimeRange] = useState("30days");

  useEffect(() => {
    // Fetch dashboard data on component mount
  }, []);

  const quickActionItems = [
    {
      title: "Create Event",
      description: "Set up a new event",
      icon: IconPlus,
      href: "/event/create",
      color: "bg-blue-500",
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      icon: IconTrendingUp,
      href: "/dashboard/analytics",
      color: "bg-green-500",
    },
    {
      title: "Manage Participants",
      description: "View registered attendees",
      icon: IconUsers,
      href: "/user",
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      {/* Original Dashboard Content - Keeping for reference */}
      <div className="pt-8 border-t border-border">
        <h2 className="text-2xl font-bold mb-6">Original Dashboard Components</h2>

        {/* Header */}
        <div className="border-b bg-card rounded-lg mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-foreground">Enhanced Dashboard</h3>
                <p className="text-muted-foreground mt-1">
                  Welcome back, {user?.name || "Admin"}! Here's what's happening with your events.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <IconDownload className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button size="sm">
                  <IconPlus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <DashboardStats timeRange={timeRange} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Revenue Overview</h3>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[140px]">{timeRange}</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="1year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <RevenueChart timeRange={timeRange} />
              </Card>
            </motion.div>

            {/* Events Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Event Performance</h3>
                  <Button variant="ghost" size="sm">
                    <IconEye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
                <EventsOverview />
              </Card>
            </motion.div>

            {/* Recent Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <RecentEvents />
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <QuickActions items={quickActionItems} />
            </motion.div>

            {/* Recent Registrations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <RecentRegistrations />
            </motion.div>

            {/* Organization Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">Organization Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Verification</span>
                    <Badge variant={organization?.isVerified ? "default" : "secondary"}>
                      {organization?.isVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Profile</span>
                    <Badge variant={organization?.isComplete ? "default" : "destructive"}>
                      {organization?.isComplete ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subscription</span>
                    <Badge variant="outline">{organization?.plan || "Free"}</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-foreground">Notifications</h4>
                  <IconBell className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-primary font-medium">New Registration</p>
                    <p className="text-xs text-primary/80 mt-1">
                      Someone registered for your event "Tech Conference 2024"
                    </p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                    <p className="text-sm text-secondary font-medium">Payment Received</p>
                    <p className="text-xs text-secondary/80 mt-1">
                      ₹2,500 payment confirmed for event ticket
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-sm">
                    View All Notifications
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
