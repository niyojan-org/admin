"use client";

import { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

export default function NextSteps({ isPaid = false, isGroup = false }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-accent/30 border border-primary/10 rounded-lg mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-all duration-200"
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 rounded-full p-1.5 shrink-0">
            <Info className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">What's Next?</h3>
        </div>
        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
      </button>
      
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-3 pt-0">
            <ul className="text-xs text-muted-foreground space-y-1.5 pl-8">
              <li className="flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Check your email for a confirmation message with{" "}
                  {isPaid ? "your tickets" : "registration details"}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                <span>You can also download {isGroup ? "tickets" : "ticket"} from your profile</span>
              </li>
              {isGroup && (
                <li className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Share tickets with all participants</span>
                </li>
              )}
              {isPaid && (
                <li className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Keep the order ID for any payment queries</span>
                </li>
              )}
              <li className="flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                <span>Arrive 15 minutes early on event day</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                <span>Carry a valid ticket and ID (if any) for entry verification</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
