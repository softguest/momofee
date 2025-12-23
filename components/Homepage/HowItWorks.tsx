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
        <h2 className="text-3xl font-bold text-center">How It Works</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="rounded-xl bg-white/10 p-6 text-center"
            >
              <div className="mb-4 text-accent text-xl font-bold">
                {i + 1}
              </div>
              <p>{s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
