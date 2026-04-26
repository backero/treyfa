import { Skeleton } from "@/components/ui/skeleton";

function TableRowSkeleton() {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3">
        <Skeleton className="h-3.5 w-28 mb-1.5" />
        <Skeleton className="h-3 w-20" />
      </td>
      <td className="px-4 py-3"><Skeleton className="h-3.5 w-48" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3.5 w-8" /></td>
      <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
      <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></td>
    </tr>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              {["NAME", "DESCRIPTION", "PRODUCTS", "STATUS", "ACTIONS"].map((h) => (
                <th key={h} className={`px-4 py-3 text-xs font-medium text-muted-foreground ${h === "ACTIONS" ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
