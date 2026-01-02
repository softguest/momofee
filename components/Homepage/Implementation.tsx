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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-tight drop-shadow-[0_0_16px_rgba(59,130,246,0.6)]" data-aos="fade-down">
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
              <span className="text-gray-800 font-semibold">{i}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
