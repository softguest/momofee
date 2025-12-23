export default function Implementation() {
  const items = [
    "School outreach & meetings",
    "On-site training & capacity building",
    "Platform onboarding",
    "Monitoring & technical support",
  ];

  return (
    <section
      className="relative bg-cover bg-center bg-fixed" // bg-fixed adds subtle parallax
      style={{ backgroundImage: "url('/images/payment02.jpg')" }}
    >
      <div className="py-32 px-6 bg-white/60 backdrop-blur-md rounded-xl"
           data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-center mb-10" data-aos="fade-down">
          Implementation Activities
        </h2>

        <ul className="mt-10 max-w-3xl mx-auto space-y-3">
          {items.map((i, idx) => (
            <li
              key={idx}
              className="flex gap-2 items-center"
              data-aos="fade-right"
              data-aos-delay={idx * 150} // staggered fade-in
            >
              <span className="text-accent font-bold text-xl">✓</span>
              <span className="text-gray-800">{i}</span>
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
