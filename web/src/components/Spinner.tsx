export function Spinner({ color = "border-white-700" }: { color?: string }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-4 h-4 border-b-2 border-l-2 ${color} rounded-full animate-spin`}
      ></div>
    </div>
  );
}
