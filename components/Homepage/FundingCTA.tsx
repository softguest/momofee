export default function FundingCTA() {
  return (
    <section
      id="funding"
      className="bg-primary py-20 text-white text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">
        Support Digital Education Transformation
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-white/80 font-semibold">
        We curently at the stages of Outreaching, Demo presentations and partnering with schools and institutions,
        showing them the simple onboarding, and long-term impact of Subjectspot.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <a className="rounded-xl bg-accent px-6 py-3 font-semibold text-primary">
          Watch Demo
        </a>
        <a className="rounded-xl border px-6 py-3 font-semibold">
          Contact Us
        </a>
      </div>
    </section>
  );
}
