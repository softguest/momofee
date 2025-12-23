export default function Solution() {
  const features = [
    "Remote fee payments using mobile money",
    "Installment-based payments",
    "Real-time payment confirmation",
    "Automated school dashboards",
    "Transparent financial reporting",
    "Actionable analytics & insights",
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-bold">
            A Simple, Secure Digital Solution
          </h2>
          <p className="mt-4 text-gray-600">
            Our School Fee Payment Platform modernizes how schools collect,
            track, and manage fees — removing cash, delays, and uncertainty.
          </p>

          <ul className="mt-6 space-y-3">
            {features.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent font-bold">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="h-80 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold">
            Dashboard / App Preview
          </span>
        </div>
      </div>
    </section>
  );
}
