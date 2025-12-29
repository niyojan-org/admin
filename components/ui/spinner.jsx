import { cn } from "@/lib/utils"
import { IconLoader3 } from "@tabler/icons-react";

function Spinner({
  className,
  ...props
}) {
  return (
    <IconLoader3
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props} />
  );
}


export function SpinnerCustom() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
    </div>
  )
}

export { Spinner }
