import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden bg-slate-900/80 rounded-xl border border-slate-800/60 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent ${className}`}
    />
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-6 rounded-3xl bg-[#0C0F17]/80 border border-slate-800/80 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="w-20 h-5 rounded-full" />
            <Skeleton className="w-12 h-4 rounded-md" />
          </div>
          <Skeleton className="w-full aspect-video rounded-2xl" />
          <div className="space-y-2 pt-1">
            <Skeleton className="w-3/4 h-5 rounded-lg" />
            <Skeleton className="w-full h-3.5 rounded-md" />
            <Skeleton className="w-5/6 h-3.5 rounded-md" />
          </div>
          <div className="flex gap-2 pt-2 border-t border-slate-800/50">
            <Skeleton className="w-16 h-4 rounded-md" />
            <Skeleton className="w-16 h-4 rounded-md" />
            <Skeleton className="w-16 h-4 rounded-md" />
          </div>
        </div>
      ))}
    </>
  );
};

export const ProjectGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardSkeleton count={count} />
    </div>
  );
};

export const ArticleSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-6 rounded-3xl bg-[#0C0F17]/80 border border-slate-800/80 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="w-28 h-3.5 rounded-md" />
              <Skeleton className="w-20 h-3 rounded-md" />
            </div>
          </div>
          <Skeleton className="w-2/3 h-6 rounded-lg" />
          <Skeleton className="w-full h-4 rounded-md" />
          <Skeleton className="w-4/5 h-4 rounded-md" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="w-14 h-5 rounded-full" />
            <Skeleton className="w-16 h-5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AppCardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-6 rounded-3xl bg-[#0C0F17]/80 border border-slate-800/80 space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-start gap-4">
            <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-1/2 h-5 rounded-lg" />
              <Skeleton className="w-3/4 h-3.5 rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="w-full h-3 rounded-md" />
            <Skeleton className="w-4/5 h-3 rounded-md" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
            <Skeleton className="w-20 h-4 rounded-md" />
            <Skeleton className="w-24 h-8 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const DownloaderPreviewSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-[#0C0F17]/90 border border-cyan-500/30 space-y-6 shadow-2xl animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="w-32 h-4 rounded-md" />
            <Skeleton className="w-24 h-3 rounded-md" />
          </div>
        </div>
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-cyan-500/20 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="w-3/4 h-6 rounded-lg" />
          <Skeleton className="w-1/2 h-4 rounded-md" />
          <div className="space-y-2 pt-2">
            <Skeleton className="w-full h-3.5 rounded-md" />
            <Skeleton className="w-5/6 h-3.5 rounded-md" />
            <Skeleton className="w-4/6 h-3.5 rounded-md" />
          </div>
          <div className="space-y-2 pt-4">
            <Skeleton className="w-full h-10 rounded-xl" />
            <Skeleton className="w-full h-10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnalyticsDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-[#0C0F17]/80 border border-slate-800 space-y-2">
            <Skeleton className="w-24 h-3.5 rounded-md" />
            <Skeleton className="w-32 h-7 rounded-lg" />
            <Skeleton className="w-20 h-3 rounded-md" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#0C0F17]/80 border border-slate-800 space-y-4">
          <Skeleton className="w-48 h-5 rounded-lg" />
          <Skeleton className="w-full h-64 rounded-2xl" />
        </div>
        <div className="p-6 rounded-3xl bg-[#0C0F17]/80 border border-slate-800 space-y-4">
          <Skeleton className="w-48 h-5 rounded-lg" />
          <Skeleton className="w-full h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      <div className="space-y-3">
        <Skeleton className="w-24 h-4 rounded-md" />
        <Skeleton className="w-72 h-9 rounded-xl" />
        <Skeleton className="w-96 h-4 rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <CardSkeleton count={3} />
      </div>
    </div>
  );
};
