import { Skeleton } from "@/components/ui/skeleton";

export function MemoryTimelineSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div key={groupIndex}>
          <Skeleton className="mb-4 h-3 w-20" />
          <div className="space-y-6 border-l border-white/[0.08] pl-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass flex items-start gap-3 rounded-xl p-4">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full max-w-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
