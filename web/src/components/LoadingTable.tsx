export function LoadingTableSkeleton() {
  return (
    <div className="border-b border-gray-200 shadow overflow-hidden sm:rounded-lg p-6">
      <SkeletonBars />
    </div>
  );
}

export function SkeletonBars() {
  return (
    <div className="flex space-x-4 animate-pulse">
      <div className="flex-1 py-1 space-y-6">
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
