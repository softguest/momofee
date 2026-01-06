import FeeDetailsComponent, {
  FeeDetails,
} from "./FeeDetailsComponent";
import { db } from "@/config/db";
import { classFees } from "@/config/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { FiArrowDownLeft, FiArrowLeft, FiPlayCircle } from "react-icons/fi";

export default async function FeeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const fee = await db.query.classFees.findFirst({
    where: eq(classFees.id, id),
    columns: {
      id: true,
      name: true,
      description: true,
      academicYear: true,
      term: true,
      totalAmount: true,
      paymentType: true,
      createdAt: true,
    },
  });

  if (!fee) {
    throw new Error("Fee not found");
  }

  // ✅ Normalize DB → UI
  const normalizedFee: FeeDetails = {
    ...fee,
    createdAt: fee.createdAt
      ? fee.createdAt.toISOString()
      : new Date().toISOString(), // fallback safety
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
         {/* Header */}
        <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">Classes <FiPlayCircle/></h1>

        <Link
            href="/admin/fees"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded"
        >
            <FiArrowLeft /> Back Home
        </Link>
        </div>
       <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md mb-8">
        <div className="px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
            List Of Created Classes
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          </div>
        </div>
      </section>
      <FeeDetailsComponent fee={normalizedFee} />
    </div>
  );
}
