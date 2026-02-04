"use client";

/**
 * Loading skeleton for profile modal content
 */
export default function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start gap-4 p-6 border-b border-gray-700">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gray-700 flex-shrink-0" />

        <div className="flex-1 space-y-3">
          {/* Name */}
          <div className="h-6 bg-gray-700 rounded w-40" />
          {/* NIP-05 */}
          <div className="h-4 bg-gray-700 rounded w-32" />
          {/* Pubkey */}
          <div className="h-3 bg-gray-700 rounded w-24" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex gap-3">
          <div className="h-8 bg-gray-700 rounded-full w-24" />
          <div className="h-8 bg-gray-700 rounded-full w-20" />
          <div className="h-8 bg-gray-700 rounded-full w-20" />
        </div>
      </div>

      {/* About skeleton */}
      <div className="p-6 border-b border-gray-700">
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-3/4" />
        </div>
      </div>

      {/* Notes skeleton */}
      <div className="p-6">
        <div className="h-5 bg-gray-700 rounded w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-gray-700/50 rounded-lg space-y-2">
              <div className="h-4 bg-gray-600 rounded w-full" />
              <div className="h-4 bg-gray-600 rounded w-5/6" />
              <div className="h-3 bg-gray-600 rounded w-24 mt-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
