
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

/**
 * FullPageLoader - A custom full page loader overlay using shadcn/ui Spinner and Tailwind colors.
 * Usage: Place <FullPageLoader /> at the root of your page/component when loading.
 */
export function FullPageLoader({ className, children }) {
    return (
        <div
            className={cn(
                "fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm",
                className
            )}
            role="status"
            aria-live="polite"
        >
            <div className="flex flex-col items-center gap-4">
                <Spinner className="size-16 text-primary animate-spin" />
                <div>
                    {children ? children : <span className="text-lg font-medium text-primary">Loading...</span>}
                </div>
            </div>
        </div>
    );
}
