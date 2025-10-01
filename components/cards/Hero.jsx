"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  IconCalendarEvent,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconTrendingUp,
  IconTarget,
  IconSparkles
} from "@tabler/icons-react";
import Footer from "../layout/Footer";

export default function Hero() {
  const stats = [
    { icon: IconCalendarEvent, label: "Events Created", value: "2,547", trend: "+12%" },
    { icon: IconUsers, label: "Total Participants", value: "48.2K", trend: "+8%" },
    { icon: IconChartBar, label: "Revenue Generated", value: "₹12.8L", trend: "+24%" },
    { icon: IconTrendingUp, label: "Success Rate", value: "94.3%", trend: "+2%" }
  ];

  const features = [
    { icon: IconTarget, title: "Smart Analytics", desc: "Real-time event performance insights" },
    { icon: IconSparkles, title: "Automated Workflows", desc: "Streamline your event management" },
    { icon: IconSettings, title: "Custom Branding", desc: "Personalize with your own colors & themes" }
  ];

  return (
    <section className="relative bg-gradient-to-br from-background via-muted/20 to-background min-h-screen items-center justify-center overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-grid-small-black/[0.2] bg-grid-small-white/[0.2] dark:bg-grid-small-white/[0.05] -z-50" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-50" />
      <div className="absolute bottom-20 right-20 w-60 h-60 bg-secondary/10 rounded-full blur-2xl -z-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Main Hero Content */}
        <div className="text-center space-y-8 mb-16">
          <Badge variant="outline" className="mx-auto">
            <IconSparkles className="h-3 w-3 mr-1" />
            Event Management Dashboard
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Analyze. Optimize.{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Succeed.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your comprehensive admin panel for event management. Track performance,
            manage participants, and customize your brand with intelligent insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="rounded-lg">
                Get Started
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-lg">
              Know More
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-dashed hover:border-solid">
              <CardContent className="p-6 text-center">
                <div className="mb-4 mx-auto w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-sm text-muted-foreground mb-4">
            Join <span className="font-semibold text-foreground">10,000+</span> event organizers worldwide
          </p>
          <div className="flex justify-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary border-2 border-background" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
