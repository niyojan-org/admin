import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Skeleton className="h-10 md:col-span-2" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden p-0">
            <Skeleton className="aspect-video w-full" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-8 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
