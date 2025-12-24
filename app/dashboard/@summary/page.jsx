'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStore } from "@/store/userStore"
import { IconArrowUpRight, IconCalendarEvent, IconCurrencyRupee, IconTrendingUp, IconTriangle, IconTriangleFilled, IconUsers, IconUsersGroup } from "@tabler/icons-react"
import Link from "next/link"
import { useEffect, useState } from "react"

function page() {
    const { user } = useUserStore();
    const [greeting, setGreeting] = useState("");
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting("Good Morning");
        } else if (hour < 18) {
            setGreeting("Good Afternoon");
        } else if (hour < 21) {
            setGreeting("Good Evening");
        } else {
            setGreeting("Good Night");
        }
    }, []);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2 mb-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {greeting}
                        {user?.name && (
                            <span className="text-primary">, {user.name}</span>
                        )}
                    </h1>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Here's what's happening in your organization today.
                </p>
            </div>
            <Card className="border-0 shadow-sm p-2 sm:px-3 gap-3">
                <CardHeader className="">
                    <CardTitle className="flex items-center justify-between text-lg font-normal text-card-foreground/80">
                        <p>Total Revenue</p>
                        <div className="bg-accent/10 p-1 rounded-full">
                            <IconTrendingUp size={20} />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold flex items-center"><IconCurrencyRupee /> 12,485</p>
                    <div className="text-xs flex items-center justify-between mt-1">
                        <div className="flex items-center">
                            <IconTriangleFilled className="text-green-600" size={10} />
                            <span className="text-green-600 ml-1"> 4.5% </span>
                            <span className="ml-1 text-muted-foreground"> vs last week </span>
                        </div>

                        <Link href={'/payments'} className="bg-muted-f text-muted-foreground rounded-full px-0.5">
                            Details <IconArrowUpRight size={12} className="inline-block ml-0.5" />
                        </Link>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-0 shadow-sm p-2 sm:px-3 gap-3">
                <CardHeader className="">
                    <CardTitle className="flex items-center justify-between text-lg font-normal text-card-foreground/80">
                        <p>Total Participants</p>
                        <div className="bg-accent/10 p-1 rounded-full">
                            <IconUsersGroup size={20} />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold flex items-center">100k</p>
                    <div className="text-xs flex items-center justify-between mt-1">
                        <div className="flex items-center">
                            <IconTriangleFilled className="text-green-600" size={10} />
                            <span className="text-green-600 ml-1"> 4.5% </span>
                            <span className="ml-1 text-muted-foreground"> vs last week </span>
                        </div>

                        <Link href={'/payments'} className="bg-muted-f text-muted-foreground rounded-full px-0.5">
                            Details <IconArrowUpRight size={12} className="inline-block ml-0.5" />
                        </Link>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-0 shadow-sm p-2 sm:px-3 gap-3">
                <CardHeader className="">
                    <CardTitle className="flex items-center justify-between text-lg font-normal text-card-foreground/80">
                        <p>Total Events</p>
                        <div className="bg-accent/10 p-1 rounded-full">
                            <IconCalendarEvent size={20} />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold flex items-center">4</p>
                    <div className="text-xs flex items-center justify-between mt-1">
                        <div className="flex items-center">
                            {/* <IconTriangleFilled className="text-green-600" size={10} />
                            <span className="text-green-600 ml-1"> 4.5% </span>
                            <span className="ml-1 text-muted-foreground"> vs last week </span> */}
                        </div>

                        <Link href={'/events'} className="bg-muted-f text-muted-foreground rounded-full px-0.5">
                            Details <IconArrowUpRight size={12} className="inline-block ml-0.5" />
                        </Link>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-0 shadow-sm p-2 sm:px-3 gap-3 ">
                <CardHeader className="">
                    <CardTitle className="flex items-center justify-between text-lg font-normal text-card-foreground/80">
                        <p>Total Members</p>
                        <div className="bg-accent/10 p-1 rounded-full">
                            <IconUsers size={20} />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold flex items-center">50</p>
                    <div className="text-xs flex items-center justify-between mt-1">
                        <div className="flex items-center">
                            {/* <IconTriangleFilled className="text-green-600" size={10} />
                            <span className="text-green-600 ml-1"> 4.5% </span>
                            <span className="ml-1 text-muted-foreground"> vs last week </span> */}
                        </div>

                        <Link href={'/organization/members'} className="bg-muted-f text-muted-foreground rounded-full px-0.5">
                            Details <IconArrowUpRight size={12} className="inline-block ml-0.5" />
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default page