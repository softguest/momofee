"use client";

export default function WaterLoader({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-24 h-24 rounded-full border-4 border-blue-200 overflow-hidden">
        {/* Water */}
        <div className="absolute bottom-0 left-0 w-full h-full bg-blue-500 animate-water-wave" />

        {/* Glass shine */}
        <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
      </div>

      <p className="mt-4 text-sm font-medium text-gray-600">
        {label}
      </p>
    </div>
  );
}
