"use client";

import { IconConfetti } from "@tabler/icons-react";

export default function SuccessHeader({ isPaid = false, message = "" }) {
  return (
    <div className="text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        {isPaid ? (
          <p className="flex items-center w-full justify-center gap-2">
            Payment Successful! <IconConfetti />
          </p>
        ) : (
          <p className="flex items-center w-full justify-center gap-2">
            Registration Successful! <IconConfetti />
          </p>
        )}
      </h1>
      <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        {message || "You have successfully registered for the event."}
      </p>
    </div>
  );
}
