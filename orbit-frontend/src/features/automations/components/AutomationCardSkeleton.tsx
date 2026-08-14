import { Skeleton } from "@/components/ui/skeleton";

export function AutomationCardSkeleton() {
  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
        <Skeleton className="h-6 w-11 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="mt-auto border-t border-white/[0.06] pt-3">
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
