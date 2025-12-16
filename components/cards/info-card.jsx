import { cn } from "@/lib/utils"
import { Card, CardHeader } from "../ui/card"

function Info({ children, className }) {
    return (
        <div className={cn("h-dvh flex flex-col items-center justify-center w-full", className)}>
            {children}
        </div>
    )
}

export function InfoCard({ children, className }) {
    return (
        <div className={cn("bg-card text-card-foreground flex flex-col rounded-xl border py-6 px-3 sm:px-6 shadow-sm", className)}>
            {children}
        </div>
    )
}

export function InfoCardHeader({ children, className }) {
    return (
        <p className={cn("text-xl font-semibold  ", className)}>
            {children}
        </p>
    )
}

export function InfoCardIcon({children, className}){
    
}



export default Info