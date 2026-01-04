import WaterLoader from "@/components/loaders/WaterLoader";

export default function DashboardLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <WaterLoader label="Loading dashboard..." />
    </div>
  );
}
