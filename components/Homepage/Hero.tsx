import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Digitizing School Fee Payments for a More Transparent Education System
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
          Helping schools, parents, and students in Cameroon save time, reduce
          stress, and manage school fees efficiently through secure digital
          payments.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="#funding"
            className="rounded-xl bg-accent px-6 py-3 font-semibold text-primary shadow-md hover:opacity-90"
          >
            Support This Initiative
          </Link>

          <Link
            href="#contact"
            className="rounded-xl border border-primary px-6 py-3 font-semibold hover:bg-primary hover:text-white"
          >
            Partner With Us
          </Link>
        </div>
      </div>
    </section>
  );
}
