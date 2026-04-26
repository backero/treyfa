import { Skeleton } from "@/components/ui/skeleton";

function BlogCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background overflow-hidden">
      <Skeleton className="h-44 w-full" />
      <div className="p-5 space-y-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-px" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-4 w-16 mt-1" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-border">
        <div className="container mx-auto px-4 text-center space-y-3">
          <Skeleton className="h-3 w-32 mx-auto" />
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-14 md:py-20">
        {/* Featured post skeleton */}
        <div className="mb-14 rounded-2xl border border-border bg-background overflow-hidden grid md:grid-cols-2 gap-0">
          <Skeleton className="h-56 md:h-72 w-full" />
          <div className="p-7 md:p-8 flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
              <Skeleton className="h-3.5 w-4/6" />
            </div>
            <Skeleton className="h-4 w-24 mt-2" />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-full" />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}
