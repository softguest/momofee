import { FiList } from "react-icons/fi";
import UnpaidStudentsClient from "./UnpaidStudentsClient";

export default async function Page({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const {classId} = await params;
  return (
    <div className='max-w-5xl mx-auto px-4 py-10'>
      <h1 className="flex items-center text-2xl font-bold mb-8 gap-x-2">Unpaid List <FiList /></h1>
      <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md">
        <div className="px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
            Unpaid List Of Students
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          </div>
        </div>
      </section>
      <UnpaidStudentsClient classId={classId} />
    </div>
  );
}