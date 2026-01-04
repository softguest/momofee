import WaterLoader from "@/components/loaders/WaterLoader";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <WaterLoader label="Loading..." />
    </div>
  );
}
