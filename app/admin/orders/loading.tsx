import { Skeleton } from "@/components/ui/skeleton";

function TableRowSkeleton() {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3"><Skeleton className="h-3.5 w-24 font-mono" /></td>
      <td className="px-4 py-3">
        <Skeleton className="h-3.5 w-28 mb-1" />
        <Skeleton className="h-3 w-36" />
      </td>
      <td className="px-4 py-3"><Skeleton className="h-3.5 w-20" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3.5 w-12" /></td>
      <td className="px-4 py-3">
        <Skeleton className="h-3.5 w-16 mb-1" />
        <Skeleton className="h-3 w-10" />
      </td>
      <td className="px-4 py-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
      <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></td>
    </tr>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              {["ORDER ID", "CUSTOMER", "DATE", "ITEMS", "TOTAL", "STATUS", "ACTIONS"].map((h) => (
                <th key={h} className={`px-4 py-3 text-xs font-medium text-muted-foreground ${h === "ACTIONS" ? "text-right" : "text-left"}`}>{h}</th>
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
