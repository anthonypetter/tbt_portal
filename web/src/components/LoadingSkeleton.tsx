import clsx from "clsx";

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={clsx(`p-4 w-full h-full overflow-hidden`, className)}>
      <div className="flex animate-pulse">
        <div className="flex-1 py-1 space-y-6">
          <div className="h-4 bg-gray-300 rounded"></div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
