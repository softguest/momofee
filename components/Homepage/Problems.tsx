import { FileStack } from "lucide-react";


export default function Problems() {
  const problems = [
    ["Long queues and wasted time", "FileStack"],
    ["Manual and error-prone record keeping", "FileStack"],
    ["Difficulty paying fees in installments", "FileStack"],
    ["No real-time payment confirmation", "FileStack"],
    ["Poor financial visibility", "FileStack"],
    ["Stress for parents and administrators", "FileStack"],
  ];

  return (
    <section className="bg-primary/5 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">
          The Problem Schools Face Today
        </h2>
        <div className="flex flex-col items-center space-y-2 mt-6">
          <div className="bg-primary/80 w-38 h-1" />
          <div className="bg-accent/60 w-24 h-1" />
          <div className="bg-primary/30 w-16 h-1" />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-6 shadow-sm flex items-center justify-center space-x-2"
            >
              <FileStack size={20}/>
              <p className="font-bold">{p[0]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
