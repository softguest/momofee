"use client";

export type FeeDetails = {
  name: string;
  description?: string | null;
  academicYear: string;
  term: string;
  totalAmount: number;
  paymentType: "FULL" | "INSTALLMENT";
  createdAt: string;
};

export default function FeeDetailsComponent({ fee }: { fee: FeeDetails }) {
  return (
    <div className="rounded-lg border bg-white p-6 space-y-4">
      <h2 className="text-xl font-semibold">{fee.name}</h2>

      {fee.description && (
        <p className="text-gray-600">{fee.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Academic Year</p>
          <p className="font-medium">{fee.academicYear}</p>
        </div>

        <div>
          <p className="text-gray-500">Term</p>
          <p className="font-medium">{fee.term}</p>
        </div>

        <div>
          <p className="text-gray-500">Payment Type</p>
          <p className="font-medium">{fee.paymentType}</p>
        </div>

        <div>
          <p className="text-gray-500">Total Amount</p>
          <p className="font-semibold">
            {fee.totalAmount.toLocaleString()} XAF
          </p>
        </div>

        <div>
          <p className="text-gray-500">Created At</p>
          <p className="font-medium">
            {new Date(fee.createdAt).toLocaleDateString()}
          </p>
        </div>

      </div>
    </div>
  );
}
