import { UserGroupIcon } from "@heroicons/react/outline";

export function EmptyStaffingState() {
  return (
    <div className="flex flex-col items-center mx-4 mt-8">
      <UserGroupIcon className="h-16 w-16 text-gray-400 text-sm" />
      <h2 className="mt-2 text-lg font-medium text-gray-900">Add teachers</h2>
      <p className="mt-1 text-sm text-gray-500">
        {"You haven't added any teachers yet."}
      </p>
    </div>
  );
}
