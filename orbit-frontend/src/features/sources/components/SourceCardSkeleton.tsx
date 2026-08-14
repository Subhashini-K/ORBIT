import { Skeleton } from "@/components/ui/skeleton";

export function SourceCardSkeleton() {
  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  );
}
