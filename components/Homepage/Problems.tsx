export default function Problems() {
  const problems = [
    "Long queues and wasted time",
    "Manual and error-prone record keeping",
    "Difficulty paying fees in installments",
    "No real-time payment confirmation",
    "Poor financial visibility",
    "Stress for parents and administrators",
  ];

  return (
    <section className="bg-primary/5 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          The Problem Schools Face Today
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <p className="font-medium">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
