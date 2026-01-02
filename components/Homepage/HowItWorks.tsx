export default function HowItWorks() {
  const steps = [
    "Schools are onboarded and trained",
    "Fee structures are configured",
    "Parents & students pay digitally",
    "Schools track payments in real time",
  ];

  return (
    <section className="bg-primary py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">How It Works</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="rounded-xl bg-white/10 p-6 text-center"
            >
              <div className="mb-4 text-accent text-4xl font-extrabold">
                {i + 1}
              </div>
              <p className="font-bold">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
