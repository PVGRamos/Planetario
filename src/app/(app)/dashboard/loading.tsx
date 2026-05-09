import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard({ className = "" }: { className?: string }) {
  return <Skeleton className={`rounded-xl h-[100px] w-full ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <Skeleton className="h-11 w-full rounded-xl" />

      {/* 8 KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Main chart + insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-[340px] rounded-xl" />
        <Skeleton className="h-[340px] rounded-xl" />
      </div>

      {/* Category donuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[320px] rounded-xl" />
        <Skeleton className="h-[320px] rounded-xl" />
      </div>

      {/* Top performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[280px] rounded-xl" />
        <Skeleton className="h-[280px] rounded-xl" />
      </div>

      {/* Cost center + Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[260px] rounded-xl" />
        <Skeleton className="h-[260px] rounded-xl" />
      </div>

      {/* Dues + Overdue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[260px] rounded-xl" />
        <Skeleton className="h-[260px] rounded-xl" />
      </div>

      {/* Recent transactions */}
      <Skeleton className="h-[320px] rounded-xl" />
    </div>
  );
}
