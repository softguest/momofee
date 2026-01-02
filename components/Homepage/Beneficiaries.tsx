export default function Beneficiaries() {
  const groups = [
    "Schools",
    "Administrators",
    "Teachers",
    "Students",
    "Parents & Guardians",
  ];

  return (
    <section className="bg-primary/5 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-center tracking-tight drop-shadow-[0_0_16px_rgba(59,130,246,0.6)]">
          Who Benefits
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {groups.map((g, i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-6 text-center shadow-sm"
            >
              <p className="font-semibold">{g}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
