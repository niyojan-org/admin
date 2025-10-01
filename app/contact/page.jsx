import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconMail, IconMapPin2, IconMessageCircle2, IconPhoneCall } from "@tabler/icons-react";
import Link from "next/link";

const Contact02Page = () => (
    <div className="h-full">
        <div className="w-full mx-auto space-y-1">
            <b className="text-muted-foreground uppercase font-semibold text-sm">
                Contact Us
            </b>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Chat with our friendly team!
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
                We&apos;d love to hear from you. Please fill out this form or shoot us
                an email.
            </p>
            <div className="mt-6 sm:mt-16 grid lg:grid-cols-2 gap-8 md:gap-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 sm:gap-y-12">
                    <div className="sm:space-y-1">
                        <div
                            className="h-12 w-12 flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary rounded-full">
                            <IconMail />
                        </div>
                        <h3 className=" font-semibold text-xl">Email</h3>
                        <p className="text-muted-foreground">
                            Our friendly team is here to help.
                        </p>
                        <Link
                            className="font-medium text-primary"
                            href="mailto:support@orgatick.in">
                            support@orgatick.in
                        </Link>
                    </div>
                    <div className="sm:space-y-1">
                        <div
                            className="h-12 w-12 flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary rounded-full">
                            <IconMessageCircle2 />
                        </div>
                        <h3 className="font-semibold text-xl">Live chat</h3>
                        <p className="text-muted-foreground">
                            Our friendly team is here to help.
                        </p>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <p className="font-medium text-primary cursor-pointer">Open Chat</p>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Sorry this feature is not available</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Live chat feature is not available right now. We are working on it. Please try again later.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>


                    </div>
                    <div className="sm:space-y-1">
                        <div
                            className="h-12 w-12 flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary rounded-full">
                            <IconMapPin2 />
                        </div>
                        <h3 className=" font-semibold text-xl">Office</h3>
                        <p className="text-muted-foreground">
                            Come say hello at our up.
                        </p>
                        <Link
                            className="font-medium text-primary"
                            href="https://map.google.com"
                            target="_blank">
                            Lovely Professional University<br /> Phagwara, Punjab, India
                        </Link>
                    </div>
                    <div className="sm:space-y-1">
                        <div
                            className="h-12 w-12 flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary rounded-full">
                            <IconPhoneCall />
                        </div>
                        <h3 className="font-semibold text-xl">Phone</h3>
                        <p className="text-muted-foreground">
                            Mon-Fri from 8am to 5pm.
                        </p>
                        <Link
                            className="font-medium text-primary"
                            href="tel:+91 6206418701">
                            +91 6206418701
                        </Link>
                    </div>
                </div>

                {/* Form */}
                <Card className="shadow-none p-2 sm:p-4">
                    <CardContent className="p-4 sm:p-6 md:p-8 overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                        <form>
                            <div className="grid md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6">
                                <div className="col-span-2 sm:col-span-1">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        placeholder="First name"
                                        id="firstName"
                                        className="mt-2  h-10 shadow-none" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        placeholder="Last name"
                                        id="lastName"
                                        className="mt-2  h-10 shadow-none" />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        id="email"
                                        className="mt-2 h-10 shadow-none" />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Message"
                                        className="mt-2 shadow-none"
                                        rows={6} />
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <Checkbox id="acceptTerms" className="bg-background" />
                                    <Label htmlFor="acceptTerms" className="gap-0">
                                        You agree to our
                                        <Link href="#" className="underline ml-1">
                                            terms and conditions
                                        </Link>
                                        <span>.</span>
                                    </Label>
                                </div>
                            </div>
                            <Button className="mt-4 sm:mt-6 w-full" size="lg">
                                Submit
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

export default Contact02Page;
