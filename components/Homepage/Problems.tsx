import { FileIcon } from "lucide-react";


export default function Problems() {
  const problems = [
    ["Long queues and wasted time", "FileIcon"],
    ["Manual and error-prone record keeping", "FileIcon"],
    ["Difficulty paying fees in installments", "FileIcon"],
    ["No real-time payment confirmation", "FileIcon"],
    ["Poor financial visibility", "FileIcon"],
    ["Stress for parents and administrators", "FileIcon"],
  ];

  return (
    <section className="bg-primary/5 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">
          The Problem Schools Face Today
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-6 shadow-sm flex items-center justify-center space-x-2"
            >
              <FileIcon size={20}/>
              <p className="font-bold">{p[0]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
