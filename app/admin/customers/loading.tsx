import { Skeleton } from "@/components/ui/skeleton";

function TableRowSkeleton() {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><Skeleton className="h-3.5 w-24" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3.5 w-8" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3.5 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-5 w-18 rounded-full" /></td>
    </tr>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              {["CUSTOMER", "JOINED", "ORDERS", "TOTAL SPENT", "STATUS"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
