import Image from "next/image";

export default function Impact() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">Our Impact Goals</h2>
          <ul className="mt-6 space-y-3 text-gray-700">
            <li className="font-semibold">• Reduce fee payment time by at least 60%</li>
            <li className="font-semibold">• Improve transparency and accountability</li>
            <li className="font-semibold">• Enable remote & installment payments</li>
            <li className="font-semibold">• Increase collection efficiency and accuracy</li>
          </ul>
          <p className="mt-10 font-semibold">
            This initiative directly improves education access, financial
            inclusion, and digital transformation for schools across Cameroon.
          </p>
        </div>

        <div className="rounded-xl bg-primary/5">
          <div className="relative w-full h-[400px]">
            <Image
              src="/images/payment01.jpg"
              alt="payment success run"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
