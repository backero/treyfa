import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function OrderCardSkeleton() {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-secondary/30">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <Separator />

      {/* Items */}
      <div className="px-5 py-4 space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-48" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="px-5 py-3 flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Skeleton className="h-7 w-32 mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
