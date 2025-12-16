import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {

  const inputRef = React.useRef(null);

  const handleFocus = (e) => {
    // Scroll input into view with padding when keyboard appears
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 300); // Delay to allow keyboard animation to start
    
    // Call original onFocus if provided
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  return (
    <input
      type={type}
      data-slot="input"
      ref={inputRef}
      onFocus={handleFocus}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground bg-input selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props} />
  );
}

export { Input }
