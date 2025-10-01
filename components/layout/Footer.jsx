import Logo from '@/assets/svg/Logo'
import { IconArrowRight } from '@tabler/icons-react'
import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'

function Footer() {
    return (
        <footer>
            <div className="mx-auto grid max-w-7xl grid-cols-6 gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-16 md:py-24">
                <div className="col-span-full flex flex-col items-start gap-4 lg:col-span-2">
                    <a href="#">
                        <div className="flex items-center gap-3">
                            <Logo size={40} />
                            <span className="text-xl font-semibold">Oratick</span>
                        </div>
                    </a>
                    <p className="text-muted-foreground">
                        Oratick is an event management platform that helps you plan, organize, and execute events easily and efficiently.
                    </p>
                    <div
                        data-orientation="horizontal"
                        role="none"
                        data-slot="separator"
                        className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px !w-35"
                    />
                    <div className="flex items-center gap-4">
                        {/* Social icons unchanged */}
                        <a href="#" target="#">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-github size-5"
                                aria-hidden="true"
                            >
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                        </a>
                        <a href="#" target="#">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-instagram size-5 text-sky-600 dark:text-sky-400"
                                aria-hidden="true"
                            >
                                <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                        </a>
                        <a href="#" target="#">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-twitter size-5 text-amber-600 dark:text-amber-400"
                                aria-hidden="true"
                            >
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                            </svg>
                        </a>
                        <a href="#" target="#">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-youtube text-destructive size-5"
                                aria-hidden="true"
                            >
                                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                                <path d="m10 15 5-3-5-3z" />
                            </svg>
                        </a>
                   Add an oAdd an oAdd an oAdd an oAdd an oAdd an oAdd an og:image tag to the page to have control over the content's image on LinkedIn.g:image tag to the page to have control over the content's image on LinkedIn.g:image tag to the page to have control over the content's image on LinkedIn.g:image tag to the page to have control over the content's image on LinkedIn.g:image tag to the page to have control over the content's image on LinkedIn.g:image tag to the page to have control over the content's image on LinkedIn.g:image tag to the page to have control over the content's image on LinkedIn. </div>
                </div>
                {/* Rest of the footer unchanged */}
                <div className="col-span-full grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-4 lg:gap-8">
                    <div className="flex flex-col gap-5">
                        <div className="text-lg font-medium">Company</div>
                        <ul className="text-muted-foreground space-y-3">
                            <li>
                                <a href="#">About</a>
                            </li>
                            <li>
                                <a href="#">Features</a>
                            </li>
                            <li>
                                <a href="#">Works</a>
                            </li>
                            <li>
                                <a href="#">Career</a>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="text-lg font-medium">Help</div>
                        <ul className="text-muted-foreground space-y-3">
                            <li>
                                <a href="#">Customer Support</a>
                            </li>
                            <li>
                                <a href="#">Delivery Details</a>
                            </li>
                            <li>
                                <a href="#">Terms &amp; Conditions</a>
                            </li>
                            <li>
                                <a href="#">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-full flex flex-col gap-5 sm:col-span-2">
                        <div>
                            <p className="mb-3 text-lg font-medium">Subscribe to newsletter</p>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Your email..."
                                />
                                <Button
                                    className={'cursor-pointer'}
                                    type="submit"
                                >
                                    <IconArrowRight />
                                </Button>
                            </div>
                        </div>
                        <div
                            data-orientation="horizontal"
                            role="none"
                            data-slot="separator"
                            className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
                        />
                        {/* <div className="flex flex-wrap gap-4">
                            <img
                                src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/bestofjs-logo-bw.png"
                                alt="bestofjs"
                                className="h-5"
                            />
                            <img
                                src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/product-hunt-logo-bw.png"
                                alt="producthunt"
                                className="h-5"
                            />
                            <img
                                src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/reddit-logo-bw.png"
                                alt="reddit"
                                className="h-5"
                            />
                            <img
                                src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/medium-logo-bw.png"
                                alt="medium"
                                className="h-5"
                            />
                            <img
                                src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/ycombinator-logo-bw.png"
                                alt="ycombinator"
                                className="h-5"
                            />
                            <img
                                src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/launchtory-logo-bw.png"
                                alt="launchtory"
                                className="h-5"
                            />
                        </div> */}
                    </div>
                </div>
            </div>
            <Separator />
            <div className="mx-auto flex max-w-7xl justify-center px-4 py-6 sm:px-6">
                <p className="text-center font-medium text-balance">
                    ©{new Date().getFullYear()} <a href="https://orgatick.in">Orgatick</a>, All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer