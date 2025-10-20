"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { X, Info, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const BannerContext = createContext(null);

export function useBanner() {
    return useContext(BannerContext);
}

export function BannerProvider({ children }) {
    const [banner, setBanner] = useState(null);

    const showBanner = useCallback((type, message, link = null) => {
        setBanner({ type, message, link });
    }, []);

    const hideBanner = useCallback(() => {
        setBanner(null);
    }, []);

    // Memoize the API so its reference is stable between renders.
    const api = useMemo(() => ({
        info: (msg, link) => showBanner("info", msg, link),
        success: (msg, link) => showBanner("success", msg, link),
        error: (msg, link) => showBanner("error", msg, link),
        warning: (msg, link) => showBanner("warning", msg, link),
        clear: hideBanner,
    }), [showBanner, hideBanner]);

    const getIcon = (type) => {
        switch (type) {
            case "info":
                return <Info className="w-5 h-5 flex-shrink-0" />;
            case "success":
                return <CheckCircle2 className="w-5 h-5 flex-shrink-0" />;
            case "error":
                return <XCircle className="w-5 h-5 flex-shrink-0" />;
            case "warning":
                return <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
            default:
                return null;
        }
    };

    const handleLinkClick = () => {
        if (banner?.link?.onClick) {
            banner.link.onClick();
        } else if (banner?.link?.href) {
            window.location.href = banner.link.href;
        }
    };

    return (
        <BannerContext.Provider value={api}>
            {banner && (
                <div
                    className={cn(
                        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full sm:w-[calc(100%-8rem)] rounded-lg shadow-lg border backdrop-blur-sm transition-all animate-in slide-in-from-top-2",
                        banner.type === "info" && "bg-primary/10 border-primary/30 text-primary",
                        banner.type === "success" && "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
                        banner.type === "error" && "bg-destructive/10 border-destructive/30 text-destructive",
                        banner.type === "warning" && "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400"
                    )}
                >
                    <div className="flex items-center gap-3 px-4 justify-between py-2">
                        <div className={cn(
                            "mt-0.5",
                            banner.type === "info" && "text-primary",
                            banner.type === "success" && "text-green-600 dark:text-green-500",
                            banner.type === "error" && "text-destructive",
                            banner.type === "warning" && "text-yellow-600 dark:text-yellow-500"
                        )}>
                            {getIcon(banner.type)}
                        </div>

                        <div className=" min-w-0 text-center items-center flex gap-4">
                            <p className="text-sm font-medium leading-relaxed">
                                {banner.message}
                            </p>
                            {banner.link && (
                                <Link
                                    className={cn(
                                        "flex items-center gap-1 text-sm font-medium hover:underline underline-offset-4",
                                        banner.type === "info" && "text-primary ",
                                        banner.type === "success" && "text-green-700 dark:text-green-400 ",
                                        banner.type === "error" && "text-destructive ",
                                        banner.type === "warning" && "text-yellow-700 dark:text-yellow-400 "
                                    )}
                                    href={banner.link?.href || "/"}
                                >
                                    {banner.link.label || "View"}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                                variant="icon"
                                className={cn(
                                    banner.type === "info" && "text-primary hover:bg-primary/20",
                                    banner.type === "success" && "text-green-600 dark:text-green-500 hover:bg-green-500/20",
                                    banner.type === "error" && "text-destructive hover:bg-destructive/20",
                                    banner.type === "warning" && "text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/20"
                                )}
                                onClick={hideBanner}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {children}
        </BannerContext.Provider>
    );
}