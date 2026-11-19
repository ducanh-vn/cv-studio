'use client';

import React from 'react';

export interface CVSkeletonLoadingProps {
  className?: string;
}

export function CVSkeletonLoading({ className = '' }: CVSkeletonLoadingProps) {
  return (
    <div className={`no-print w-[210mm] min-h-[297mm] bg-white rounded-sm shadow-2xl p-8 space-y-8 animate-pulse flex flex-col justify-between select-none ${className}`}>
      {/* Header Skeleton */}
      <div className="space-y-4 pb-6 border-b border-neutral-200">
        <div className="flex justify-between items-start">
          <div className="space-y-3 w-2/3">
            <div className="w-28 h-4 bg-neutral-200 rounded-md" />
            <div className="w-4/5 h-8 bg-neutral-300 rounded-lg" />
            <div className="w-1/2 h-4 bg-cyan-100 rounded-md" />
            <div className="flex gap-4 pt-2">
              <div className="w-32 h-3 bg-neutral-200 rounded" />
              <div className="w-24 h-3 bg-neutral-200 rounded" />
              <div className="w-28 h-3 bg-neutral-200 rounded" />
            </div>
          </div>
          <div className="w-24 h-24 rounded-2xl bg-neutral-200 border border-neutral-300 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-neutral-300/60" />
          </div>
        </div>
      </div>

      {/* Body Skeleton (2 Columns) */}
      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Column (60%) */}
        <div className="col-span-7 space-y-6">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-neutral-50 space-y-2 border border-neutral-200">
            <div className="w-40 h-4 bg-neutral-300 rounded" />
            <div className="w-full h-3 bg-neutral-200 rounded" />
            <div className="w-5/6 h-3 bg-neutral-200 rounded" />
            <div className="w-4/6 h-3 bg-neutral-200 rounded" />
          </div>

          {/* Timeline Experience */}
          <div className="space-y-4">
            <div className="w-48 h-4 bg-neutral-300 rounded" />
            <div className="relative pl-6 ml-2 border-l-2 border-neutral-200 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative space-y-2">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-white" />
                  <div className="flex justify-between">
                    <div className="w-44 h-4 bg-neutral-300 rounded" />
                    <div className="w-24 h-3 bg-neutral-200 rounded" />
                  </div>
                  <div className="w-full h-3 bg-neutral-200 rounded" />
                  <div className="w-4/5 h-3 bg-neutral-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-3">
            <div className="w-40 h-4 bg-neutral-300 rounded" />
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="w-36 h-4 bg-neutral-300 rounded" />
              <div className="w-full h-3 bg-neutral-200 rounded" />
              <div className="flex gap-1.5 pt-1">
                <div className="w-12 h-4 bg-neutral-200 rounded" />
                <div className="w-14 h-4 bg-neutral-200 rounded" />
                <div className="w-10 h-4 bg-neutral-200 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (40%) */}
        <div className="col-span-5 space-y-6">
          {/* Skills Matrix */}
          <div className="space-y-3">
            <div className="w-36 h-4 bg-neutral-300 rounded" />
            <div className="flex flex-wrap gap-2">
              {[16, 20, 14, 24, 18, 16, 22, 14].map((w, idx) => (
                <div key={idx} className="h-6 bg-cyan-50 border border-cyan-100 rounded-lg" style={{ width: `${w * 4}px` }} />
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <div className="w-32 h-4 bg-neutral-300 rounded" />
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="w-44 h-4 bg-neutral-300 rounded" />
              <div className="w-36 h-3 bg-cyan-100 rounded" />
              <div className="w-20 h-3 bg-neutral-200 rounded" />
            </div>
          </div>

          {/* Engineering Practices */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="w-32 h-3.5 bg-neutral-300 rounded" />
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-2.5 bg-neutral-200 rounded" />
              <div className="w-4/5 h-2.5 bg-neutral-200 rounded" />
              <div className="w-3/4 h-2.5 bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CVSkeletonLoading;
