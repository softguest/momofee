import Link from "next/link";
import { FiUser, FiBook, FiCreditCard, FiClock } from "react-icons/fi";

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md">
      <div className="px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
          Student Details
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {id}
        </div>
      </div>
    </section>
  );
};

// export default StudentPage;
