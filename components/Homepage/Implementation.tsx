export default function Implementation() {
  const items = [
    "School outreach & meetings",
    "On-site training & capacity building",
    "Platform onboarding",
    "Monitoring & technical support",
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-center">
          Implementation Activities
        </h2>

        <ul className="mt-10 max-w-3xl mx-auto space-y-3">
          {items.map((i, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-accent font-bold">✓</span>
              {i}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Sustainability() {
  return (
    <section className="bg-primary/5 py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-3xl font-bold">Sustainability & Scale</h2>
        <p className="mt-6 text-gray-700">
          After onboarding, schools operate independently. The platform is
          low-cost to maintain, scalable across regions, and designed for
          long-term impact beyond the grant period.
        </p>
      </div>
    </section>
  );
}
